import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, DefRows } from "@/components/blocks";

const BODY = "'Gramatika', sans-serif";

const projectsData: Record<
  string,
  { title: string; result: string; sector: string; what: string; format: string; city: string; volume: string; task: string; solution: string; material: string; outcome: string; photos: string[] }
> = {
  samolet: {
    title: "САМОЛЕТ — 40 000 органайзеров", result: "Тиражное производство предмета из переработанного полистирола", sector: "Девелопмент", what: "Органайзеры", format: "Тиражное производство", city: "Москва", volume: "40 000 шт",
    task: "Девелоперу нужен был функциональный, тиражируемый предмет из переработанного материала для передачи жильцам при заселении. Важно было, чтобы предмет не выглядел дёшево и имел реальную функцию.",
    solution: "Мы разработали конструкцию органайзера, подобрали цветовое решение и запустили серийное производство. Каждый предмет — из переработанного полистирола, произведённого на нашем производстве.",
    material: "RePanel позволил выдержать тираж в 40 000 единиц с предсказуемым качеством и визуалом. Материал выдерживает ежедневное использование и при этом имеет выразительную фактуру.",
    outcome: "40 000 органайзеров произведены и переданы. Предмет стал частью программы sustainability девелопера.",
    photos: ["07.jpg", "04.jpg", "05.jpg"],
  },
  drinkit: {
    title: "Drinkit — панели и перегородки", result: "Интерьерное решение для сети кофеен", sector: "HoReCa", what: "Панели, перегородки", format: "Поставка материала + монтаж", city: "Москва", volume: "Несколько точек",
    task: "Сети кофеен нужен был выразительный материал для зонирования пространства, который отличается от типовых интерьерных решений и масштабируется на несколько точек.",
    solution: "Мы подобрали цветовое решение, изготовили панели нужного формата и обеспечили поставку для нескольких локаций.",
    material: "Материал RePanel создаёт в интерьере кофейни визуальный акцент, при этом легко повторяется для новых точек сети.",
    outcome: "Панели и перегородки установлены в нескольких точках. Материал работает как элемент айдентики бренда.",
    photos: ["DSC09441.jpg", "DSC09389.jpg", "DSC09429.jpg"],
  },
  "ripple-chopchop": {
    title: "RIPPle × Chop-Chop", result: "Комплексное интерьерное решение: ресепшен, мебель, детали", sector: "HoReCa", what: "Ресепшен, меню, столы, полки", format: "Комплексный проект", city: "Москва", volume: "Полный интерьер",
    task: "Для гастропространства нужно было создать целостную систему мебели и интерьерных элементов, объединённых одним материалом и визуальным языком.",
    solution: "Мы разработали и произвели полный комплект: ресепшен, столы, полки, столешницы, меню-борды — всё из RePanel, адаптированное под концепцию заведения.",
    material: "RePanel стал основой визуальной идентичности пространства. Единый материал во всех элементах создаёт ощущение продуманного дизайна.",
    outcome: "Все элементы произведены и установлены. Пространство получило узнаваемый характер благодаря единому материалу.",
    photos: ["photo_2025-09-09 10.10.09.jpeg", "photo_2025-09-09 10.10.08.jpeg", "photo_2025-09-09 10.10.10.jpeg"],
  },
  lucky: {
    title: "ЖК Lucky — детская площадка", result: "Игровые элементы из переработанного полистирола для жилого комплекса", sector: "Девелопмент", what: "Игровые элементы", format: "Спецпроект", city: "Москва", volume: "Детская зона",
    task: "Для жилого комплекса нужны были уникальные игровые элементы для детской площадки, которые не выглядят как типовое оборудование и при этом безопасны.",
    solution: "Мы спроектировали и произвели набор игровых элементов из RePanel, адаптированных под требования безопасности и визуальную концепцию ЖК.",
    material: "Материал RePanel достаточно прочен для уличного использования, устойчив к погодным условиям и имеет безопасную фактуру.",
    outcome: "Игровые элементы установлены и работают. Детская зона стала визуальным акцентом двора.",
    photos: ["DSC02233.jpg", "DSC02232.jpg", "DSC02247.jpg"],
  },
};

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData[slug];
  return { title: project ? `${project.title} — кейс RePanel` : "Кейс RePanel", description: project?.result || "" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return (
      <section className="px-[var(--site-margins)] pt-32 pb-32 text-center">
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: "'Chalet','Gramatika',sans-serif", fontSize: "clamp(28px,4vw,48px)" }}>Кейс не найден</h1>
        <div className="mt-6 flex justify-center"><Link href="/projects" className="font-bold underline" style={{ fontFamily: BODY }}>Все кейсы →</Link></div>
      </section>
    );
  }

  const facts: [string, string][] = [
    ["Сектор", project.sector], ["Что сделали", project.what], ["Формат", project.format], ["Город", project.city], ["Объём", project.volume],
  ];

  return (
    <>
      <PageHero title={project.title} lead={project.result} image={`/images/${project.photos[0]}`} imageAlt={project.title} />

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

      {/* Фото */}
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-4" style={{ maxWidth: 1440 }}>
          {project.photos.map((p) => (
            <div key={p} className="relative overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
              <Image src={`/images/${p}`} alt={project.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
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
