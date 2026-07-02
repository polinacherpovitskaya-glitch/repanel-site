import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { Group } from "@/components/blocks";
import { UnderlineLink } from "@/components/UnderlineLink";

const BODY = "'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Контакты — RePanel",
  description: "Расскажите о вашем проекте — предложим лучший формат работы. Телефон, email, Telegram, адрес производства.",
};

const details = [
  { label: "Телефон", value: "+7 903 210 1199", href: "tel:+79032101199" },
  { label: "Email", value: "panels@recycleobject.com", href: "mailto:panels@recycleobject.com" },
  { label: "Telegram", value: "@panelpanelre", href: "https://t.me/panelpanelre", ext: true },
  { label: "Адрес", value: "Дмитров, ул. Промышленная, 10" },
];

const quickLinks = [
  { label: "Каталог изделий", href: "/catalog" },
  { label: "Для архитекторов", href: "/for-architects" },
  { label: "Кейсы", href: "/projects" },
];

export default function ContactsPage() {
  return (
    <>
      <PageHero
        title="Контакты"
        image="/images/DSC02232.jpg"
        imageAlt="Производство RePanel"
        lead="Пришлите задачу, размеры, сроки и референсы — предложим лучший формат работы и посчитаем смету."
      />

      <Group title="Напишите нам">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-start-9 lg:col-span-4">
            {details.map((d) => (
              <div key={d.label} className="border-t border-[#171513] pt-3 pb-4">
                <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.5 }}>{d.label}</p>
                {d.href ? (
                  <a href={d.href} {...(d.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-[#171513] hover:opacity-60 transition-opacity" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "18px" }}>{d.value}</a>
                ) : (
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "18px" }}>{d.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Group>

      <Group title="Смотрите также">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((l) => (
            <div key={l.href} className="border-t border-[#171513] pt-4">
              <UnderlineLink href={l.href} fontSize={18}>{l.label} →</UnderlineLink>
            </div>
          ))}
        </div>
      </Group>

      <div className="pb-20 lg:pb-32" />
    </>
  );
}
