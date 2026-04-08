import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";

const projectsData: Record<
  string,
  {
    title: string;
    result: string;
    sector: string;
    what: string;
    format: string;
    city: string;
    volume: string;
    task: string;
    solution: string;
    material: string;
    outcome: string;
    photos: string[];
  }
> = {
  samolet: {
    title: "САМОЛЕТ — 40 000 органайзеров",
    result: "Тиражное производство предмета из переработанного пластика",
    sector: "Девелопмент",
    what: "Органайзеры",
    format: "Тиражное производство",
    city: "Москва",
    volume: "40 000 шт",
    task: "Девелоперу нужен был функциональный, тиражируемый предмет из переработанного материала для передачи жильцам при заселении. Важно было, чтобы предмет не выглядел дёшево и имел реальную функцию.",
    solution: "Мы разработали конструкцию органайзера, подобрали цветовое решение и запустили серийное производство. Каждый предмет — из переработанного пластика, произведённого на нашем производстве.",
    material: "RePanel позволил выдержать тираж в 40 000 единиц с предсказуемым качеством и визуалом. Материал выдерживает ежедневное использование и при этом имеет выразительную фактуру.",
    outcome: "40 000 органайзеров произведены и переданы. Предмет стал частью программы sustainability девелопера.",
    photos: ["07.jpg", "04.jpg", "05.jpg"],
  },
  drinkit: {
    title: "Drinkit — панели и стены-перегородки",
    result: "Интерьерное решение для сети кофеен",
    sector: "HoReCa",
    what: "Панели, перегородки",
    format: "Поставка материала + монтаж",
    city: "Москва",
    volume: "Несколько точек",
    task: "Сети кофеен нужен был выразительный материал для зонирования пространства, который отличается от типовых интерьерных решений и масштабируется на несколько точек.",
    solution: "Мы подобрали цветовое решение, изготовили панели нужного формата и обеспечили поставку для нескольких локаций.",
    material: "Материал RePanel создаёт в интерьере кофейни визуальный акцент, при этом легко повторяется для новых точек сети.",
    outcome: "Панели и перегородки установлены в нескольких точках. Материал работает как элемент айдентики бренда.",
    photos: ["DSC09441.jpg", "DSC09389.jpg", "DSC09429.jpg"],
  },
  "ripple-chopchop": {
    title: "RIPPle × Chop-Chop",
    result: "Комплексное интерьерное решение: ресепшен, мебель, детали",
    sector: "HoReCa",
    what: "Ресепшен, меню, столы, полки, столешницы",
    format: "Комплексный проект",
    city: "Москва",
    volume: "Полный интерьер",
    task: "Для гастропространства нужно было создать целостную систему мебели и интерьерных элементов, объединённых одним материалом и визуальным языком.",
    solution: "Мы разработали и произвели полный комплект: ресепшен, столы, полки, столешницы, меню-борды — всё из RePanel, адаптированное под концепцию заведения.",
    material: "RePanel стал основой визуальной идентичности пространства. Единый материал во всех элементах создаёт ощущение продуманного дизайна.",
    outcome: "Все элементы произведены и установлены. Пространство получило узнаваемый характер благодаря единому материалу.",
    photos: ["photo_2025-09-09 10.10.09.jpeg", "photo_2025-09-09 10.10.08.jpeg", "photo_2025-09-09 10.10.10.jpeg"],
  },
  lucky: {
    title: "ЖК Lucky — элементы детской площадки",
    result: "Игровые элементы из переработанного пластика для жилого комплекса",
    sector: "Public / Девелопмент",
    what: "Игровые элементы",
    format: "Спецпроект",
    city: "Москва",
    volume: "Детская зона",
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
  return {
    title: project ? `${project.title} — кейс RePanel` : "Кейс RePanel",
    description: project?.result || "",
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return (
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto max-w-[1440px] text-center">
          <h1 className="text-[28px] font-bold mb-4" style={{ fontFamily: D }}>Кейс не найден</h1>
          <Link href="/projects" className="text-[15px] font-bold" style={{ fontFamily: D, textDecoration: "underline" }}>
            Все кейсы
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "60px 20px 40px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl pt-8">
            <h1
              className="font-bold mb-4"
              style={{ fontFamily: D, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-1.5px", lineHeight: 0.95 }}
            >
              {project.title}
            </h1>
            <p className="text-[17px] md:text-[20px] leading-[1.55]" style={{ opacity: 0.6 }}>
              {project.result}
            </p>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section style={{ borderTop: "1px solid #171513", borderBottom: "1px solid rgba(23,21,19,0.15)" }}>
        <div className="mx-auto max-w-[1440px]" style={{ padding: "16px 20px" }}>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
            {[
              ["Сектор", project.sector],
              ["Что сделали", project.what],
              ["Формат", project.format],
              ["Город", project.city],
              ["Объём", project.volume],
            ].map(([label, val]) => (
              <div key={label}>
                <span style={{ opacity: 0.4 }}>{label}:</span>{" "}
                <span style={{ opacity: 0.75 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section style={{ padding: "40px 20px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-3 gap-4 mb-12">
            {project.photos.map((p) => (
              <div key={p} className="relative aspect-[3/2]">
                <Image
                  src={`/images/${p}`}
                  alt={project.title}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) calc((100vw - 56px) / 3), 469px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <h2 className="text-[22px] font-bold mb-3" style={{ fontFamily: D }}>Задача</h2>
              <p className="text-[16px] leading-[1.6]" style={{ opacity: 0.6 }}>{project.task}</p>
            </div>
            <div>
              <h2 className="text-[22px] font-bold mb-3" style={{ fontFamily: D }}>Решение</h2>
              <p className="text-[16px] leading-[1.6]" style={{ opacity: 0.6 }}>{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Material & Result */}
      <section style={{ padding: "60px 20px", background: "#F5F5F5" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <h2 className="text-[22px] font-bold mb-3" style={{ fontFamily: D }}>Как материал отработал</h2>
              <p className="text-[16px] leading-[1.6]" style={{ opacity: 0.6 }}>{project.material}</p>
            </div>
            <div>
              <h2 className="text-[22px] font-bold mb-3" style={{ fontFamily: D }}>Результат</h2>
              <p className="text-[16px] leading-[1.6]" style={{ opacity: 0.6 }}>{project.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", background: "#171513" }}>
        <div className="mx-auto max-w-[1440px] text-center">
          <h2
            className="font-bold mb-4"
            style={{ fontFamily: D, fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-1px", color: "#fff" }}
          >
            Хочу похожий проект
          </h2>
          <p className="text-[16px] mb-8 max-w-lg mx-auto" style={{ opacity: 0.5, color: "#fff" }}>
            Расскажите о задаче — предложим решение на основе нашего опыта.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contacts"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{ background: "#fff", color: "#171513", fontFamily: D }}
            >
              Обсудить подобный кейс
            </Link>
            <Link
              href="/projects"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontFamily: D }}
            >
              Все кейсы
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
