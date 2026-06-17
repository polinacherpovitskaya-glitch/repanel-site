import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { CaseStrip } from "@/components/CaseStrip";
import { Group, DefRows } from "@/components/blocks";
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
      <section className="px-[var(--site-margins)] pt-10 lg:pt-14">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {facts.map(([l, v]) => (
              <div key={l}>
                <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>{l}: </span>
                <span className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фото — полоса кадров кейса */}
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <CaseStrip photos={project.photos} alt={project.name} wide={project.wide} />
        </div>
      </section>

      <Group title="Что мы сделали">
        <DefRows rows={[
          { t: "Задача", d: project.task },
          { t: "Решение", d: project.solution },
          { t: "Как отработал материал", d: project.material },
          { t: "Результат", d: project.outcome },
        ]} />
      </Group>

      <FinalCTA heading="Хотите похожий проект?" text="Расскажите о задаче — предложим решение на основе нашего опыта." />
    </>
  );
}
