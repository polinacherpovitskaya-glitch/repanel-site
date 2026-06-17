import { FAQ } from "./FAQ";
import { PageHero } from "./PageHero";
import { FinalCTA } from "./FinalCTA";
import { Group, Statement } from "./blocks";

const BODY = "'Gramatika', sans-serif";

interface IndustryPageLayoutProps {
  title: string;
  subtitle: string;
  problem: string;
  whatWeDo: string[];
  benefits: string[];
  ctaText: string;
  ctaHref?: string;
  audiences?: string[];
  faq?: { question: string; answer: string }[];
  image?: string;
}

export function IndustryPageLayout({
  title,
  subtitle,
  problem,
  whatWeDo,
  benefits,
  audiences,
  faq,
  image = "/images/DSC09441.jpg",
}: IndustryPageLayoutProps) {
  return (
    <>
      <PageHero title={title} lead={subtitle} image={image} imageAlt={title} />

      <Statement>{problem}</Statement>

      <Group title="Что мы делаем">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-start-4 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5">
            {whatWeDo.map((item) => (
              <div key={item} className="border-t border-[#171513] pt-3 pb-4">
                <p className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "16px", lineHeight: 1.3, letterSpacing: "-0.2px" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Group>

      <Group title="Почему удобно">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-start-4 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-5">
            {benefits.map((item) => (
              <div key={item} className="border-t border-[#171513] pt-3 pb-4">
                <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Group>

      {audiences && audiences.length > 0 && (
        <Group title="Для кого">
          <div className="flex flex-wrap gap-3">
            {audiences.map((a) => (
              <span key={a} className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14px", border: "1px solid #171513", padding: "10px 20px" }}>{a}</span>
            ))}
          </div>
        </Group>
      )}

      {faq && faq.length > 0 && (
        <Group title="Частые вопросы">
          <FAQ items={faq} title="" />
        </Group>
      )}

      <FinalCTA />
    </>
  );
}
