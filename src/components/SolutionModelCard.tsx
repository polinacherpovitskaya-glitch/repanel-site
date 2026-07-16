"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { formatRub, type SolutionObject } from "@/data/solutionObjects";

const BODY = "'Gramatika', sans-serif";
const GREY = "#b7b4b0"; // нейтральный «серенький» рендер по умолчанию

const Model3D = dynamic(() => import("./Model3D"), { ssr: false, loading: () => null });

/** Карточка предмета на «Готовых решениях»: серый статичный 3D, по наведению крутится, клик → конфигуратор. */
export function SolutionModelCard({ object, fromPrice }: { object: SolutionObject; fromPrice?: number | null }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/solutions/horeca/${object.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: "#EAEAE7" }}>
        <Model3D
          url={object.glb}
          colorIndex={-1}
          customHex={GREY}
          interactive={false}
          autoRotate={hovered}
          frameloop={hovered ? "always" : "demand"}
          scale={object.viewScale ?? 1}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-bold text-[#171513] relative inline-block" style={{ fontFamily: BODY, fontSize: 16, fontWeight: 700 }}>
          {object.short}
          <span className="absolute left-0 -bottom-0.5 h-[1.5px] bg-[#171513] w-0 group-hover:w-full transition-[width] duration-300" />
        </span>
        <span style={{ fontFamily: BODY, fontSize: 14, color: "rgba(23,21,19,0.6)", whiteSpace: "nowrap" }}>
          от {formatRub(fromPrice ?? object.basePrice)}
        </span>
      </div>
      {object.dims && (
        <div className="mt-1" style={{ fontFamily: BODY, fontSize: 12.5, color: "#8a8783" }}>
          {object.dims} · лист {object.thickness}
        </div>
      )}
    </Link>
  );
}
