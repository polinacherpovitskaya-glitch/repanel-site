import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { ProjectGallery } from "@/components/ProjectGallery";
import { caseBySlug, cases } from "@/data/cases";

const BODY = "'Gramatika', sans-serif";

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = caseBySlug[slug];
  return { title: project ? `${project.name} — кейс RePanel` : "Кейс RePanel", description: project?.result || "" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseBySlug[slug];

  if (!project) {
    return (
      <section className="px-[var(--site-margins)] pt-32 pb-32 text-center">
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: "'Chalet','Gramatika',sans-serif", fontSize: "clamp(28px,4vw,48px)" }}>Кейс не найден</h1>
        <div className="mt-6 flex justify-center"><Link href="/projects" className="font-bold underline" style={{ fontFamily: BODY }}>Все проекты →</Link></div>
      </section>
    );
  }

  const facts: [string, string][] = [
    ["Сектор", project.use], ["Что сделали", project.what], ["Формат", project.format], ["Город", project.city], ["Объём", project.volume],
  ];

  return (
    <>
      <PageHero title={project.name} lead={project.result} image={project.photos[0]} imageAlt={project.name} />

      {/* Факты */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-7">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {facts.map(([l, v]) => (
              <div key={l} className="flex items-baseline gap-1.5">
                <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "14px", lineHeight: 1.35 }}>{l}:</span>
                <span className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "14px", lineHeight: 1.35 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фото кейса — разбросанная галерея (без первого кадра — он уже в hero) */}
      <ProjectGallery photos={project.photos.slice(1)} alt={project.name} />

      {/* Что мы сделали — мелкая подпись точно над линией + крупные заголовки (Figma 68:4979, мобилка 68:5268) */}
      <section className="px-[var(--site-margins)] pt-8 lg:pt-10">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <p className="text-[#171513] mb-2.5" style={{ fontFamily: BODY, fontSize: "15px", lineHeight: "20px" }}>Что мы сделали</p>
          {[
            { t: "Задача", d: project.task },
            { t: "Решение", d: project.solution },
            { t: "Как отработал материал", d: project.material },
            { t: "Результат", d: project.outcome },
          ].map((r) => (
            <div key={r.t} className="border-t border-[#171513] grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-5 pt-[21px] pb-5 lg:pb-9">
              <h3 className="lg:col-span-7 font-bold text-[#171513] text-[18px] lg:text-[34px] leading-[22.77px] lg:leading-[43px] tracking-[-0.36px] lg:tracking-[-0.68px]" style={{ fontFamily: BODY }}>{r.t}</h3>
              <p className="lg:col-span-5 lg:self-start text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px" }}>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      <FinalCTA heading="Хотите похожий проект?" text="Расскажите о задаче — предложим решение на основе нашего опыта." compact />
    </>
  );
}
