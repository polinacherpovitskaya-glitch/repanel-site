import Image from "next/image";

/**
 * Полоса фото кейса — высота ряда всегда одинаковая (контейнер 455*4:606).
 * Обычный режим: портретные ячейки 455:606; при 1–2 кадрах они того же размера
 * и центрируются (симметричные отступы).
 * wide: кадры заполняют ряд равными колонками (горизонтальные) — для кейсов,
 * где уместнее 2 широких изображения вместо 4 вертикальных.
 */
export function CaseStrip({ photos, alt, wide = false }: { photos: string[]; alt: string; wide?: boolean }) {
  const shown = photos.slice(0, 4);
  return (
    <div className="flex justify-center" style={{ aspectRatio: `${455 * 4} / 606` }}>
      {shown.map((src, i) => (
        <div
          key={i}
          className={`relative h-full overflow-hidden ${wide ? "flex-1" : "flex-none"}`}
          style={wide ? undefined : { width: "25%" }}
        >
          <Image
            src={src}
            alt={`${alt} — фото ${i + 1}`}
            fill
            sizes={wide ? "(max-width:1024px) 50vw, 720px" : "(max-width:1024px) 25vw, 360px"}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
