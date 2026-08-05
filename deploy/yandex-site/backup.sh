#!/usr/bin/env bash
set -euo pipefail

backup_dir="${REPANEL_SITE_BACKUP_DIR:?set REPANEL_SITE_BACKUP_DIR}"
bucket="${REPANEL_SITE_BACKUP_BUCKET:?set REPANEL_SITE_BACKUP_BUCKET}"
pg_container="${REPANEL_SITE_PG_CONTAINER:-ro-platform-shadow-postgres}"
yc_bin="${REPANEL_SITE_YC_BIN:-yc}"
yc_profile="${REPANEL_SITE_YC_PROFILE:-}"

case "$backup_dir" in
  /*) ;;
  *) echo "REPANEL_SITE_BACKUP_DIR must be absolute" >&2; exit 2 ;;
esac
if [[ "$backup_dir" == "/" ]]; then
  echo "Refusing a filesystem-root backup directory" >&2
  exit 2
fi

install -d -m 700 "$backup_dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
dump_name="repanel-site-${stamp}.dump"
dump_path="$backup_dir/$dump_name"
checksum_path="$dump_path.sha256"
manifest_path="$backup_dir/repanel-site-${stamp}.manifest.json"

docker exec "$pg_container" sh -lc 'pg_dump -U "$POSTGRES_USER" -d repanel_site -Fc' > "$dump_path"
chmod 600 "$dump_path"
(
  cd "$backup_dir"
  sha256sum "$dump_name" > "$dump_name.sha256"
)
chmod 600 "$checksum_path"

row_count="$(docker exec "$pg_container" sh -lc 'psql -U "$POSTGRES_USER" -d repanel_site -Atc "select count(*) from site_records"')"
dump_bytes="$(stat -c '%s' "$dump_path")"
python3 -c '
import json, sys
print(json.dumps({
    "schemaVersion": 1,
    "createdAt": sys.argv[1],
    "database": "repanel_site",
    "recordCount": int(sys.argv[2]),
    "dumpBytes": int(sys.argv[3]),
}, ensure_ascii=False, indent=2))
' "$stamp" "$row_count" "$dump_bytes" > "$manifest_path"
chmod 600 "$manifest_path"

yc_args=()
if [[ -n "$yc_profile" ]]; then yc_args+=(--profile "$yc_profile"); fi
remote_prefix="s3://${bucket}/site/m5/postgres/${stamp}"
"$yc_bin" "${yc_args[@]}" storage s3 cp "$dump_path" "$remote_prefix/$dump_name" >/dev/null
"$yc_bin" "${yc_args[@]}" storage s3 cp "$checksum_path" "$remote_prefix/$dump_name.sha256" >/dev/null
"$yc_bin" "${yc_args[@]}" storage s3 cp "$manifest_path" "$remote_prefix/$(basename "$manifest_path")" >/dev/null

verify_dir="$(mktemp -d "$backup_dir/.verify-${stamp}.XXXXXX")"
"$yc_bin" "${yc_args[@]}" storage s3 cp "$remote_prefix/$dump_name" "$verify_dir/$dump_name" >/dev/null
"$yc_bin" "${yc_args[@]}" storage s3 cp "$remote_prefix/$dump_name.sha256" "$verify_dir/$dump_name.sha256" >/dev/null
(
  cd "$verify_dir"
  sha256sum -c "$dump_name.sha256"
)
unlink "$verify_dir/$dump_name"
unlink "$verify_dir/$dump_name.sha256"
rmdir "$verify_dir"

printf 'backup_object=%s/%s\n' "$remote_prefix" "$dump_name"
printf 'record_count=%s dump_bytes=%s\n' "$row_count" "$dump_bytes"
