/**
 * Проверка подписи входящего вебхука Точки.
 *
 * Точка подписывает тело вебхука как JWS/JWT по алгоритму RS256.
 * Публичный ключ — статический JWK, отдаётся по адресу:
 *   https://enter.tochka.com/doc/openapi/static/keys/public
 * (формат: один JWK { kty:"RSA", n, e }; на всякий случай поддерживаем и JWKS).
 *
 * Используется встроенный Node `crypto` — без новых npm-зависимостей.
 * Эта проверка — слой "защита в глубину" поверх перепроверки статуса через API
 * (см. tochka-webhook route, флаг TOCHKA_WEBHOOK_REVERIFY).
 */
import crypto from 'node:crypto';

const PUBLIC_KEY_URL = 'https://enter.tochka.com/doc/openapi/static/keys/public';
const KEY_TTL_MS = 24 * 60 * 60 * 1000; // ключ статический — кэшируем на сутки

type Jwk = { kty?: string; n?: string; e?: string; keys?: Jwk[] };

let cachedKey: { key: crypto.KeyObject; fetchedAt: number } | null = null;

async function loadPublicKey(): Promise<crypto.KeyObject | null> {
  if (cachedKey && Date.now() - cachedKey.fetchedAt < KEY_TTL_MS) {
    return cachedKey.key;
  }
  try {
    const res = await fetch(PUBLIC_KEY_URL);
    if (!res.ok) throw new Error(`public key fetch failed: ${res.status}`);
    const json = (await res.json()) as Jwk;
    const jwk = Array.isArray(json.keys) ? json.keys[0] : json;
    if (!jwk || jwk.kty !== 'RSA' || !jwk.n || !jwk.e) {
      throw new Error('unexpected public key shape');
    }
    const key = crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: 'jwk' });
    cachedKey = { key, fetchedAt: Date.now() };
    return key;
  } catch (e) {
    console.error('[tochka-verify] public key load failed:', e);
    // Если ключ временно недоступен — отдаём прошлый кэш (если был),
    // иначе null → вызывающий трактует результат как 'unknown' и не блокирует.
    return cachedKey?.key ?? null;
  }
}

export type WebhookVerifyResult = 'valid' | 'invalid' | 'unknown';

/**
 * Чистая проверка RS256-подписи JWT заданным ключом. Вынесена отдельно,
 * чтобы её можно было протестировать с собственной парой ключей без сети.
 */
export function verifyJwtRs256(rawJwt: string, key: crypto.KeyObject): WebhookVerifyResult {
  try {
    const parts = rawJwt.trim().split('.');
    if (parts.length !== 3) return 'invalid';
    const [headerB64, payloadB64, signatureB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;
    const signature = Buffer.from(signatureB64, 'base64url');
    // RS256 = RSASSA-PKCS1-v1_5 + SHA-256 (паддинг по умолчанию для RSA-ключа).
    const ok = crypto.verify('RSA-SHA256', Buffer.from(signingInput), key, signature);
    return ok ? 'valid' : 'invalid';
  } catch (e) {
    console.error('[tochka-verify] signature verify error:', e);
    return 'unknown';
  }
}

/**
 * Проверяет подпись тела вебхука публичным ключом Точки.
 * 'unknown' означает «не смогли проверить прямо сейчас» (ключ недоступен) —
 * вызывающий код в режиме monitor/enforce не должен из-за этого ронять платежи.
 */
export async function verifyTochkaWebhookSignature(rawJwt: string): Promise<WebhookVerifyResult> {
  if (!rawJwt || rawJwt.trim().split('.').length !== 3) return 'invalid';
  const key = await loadPublicKey();
  if (!key) return 'unknown';
  return verifyJwtRs256(rawJwt, key);
}
