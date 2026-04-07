import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кейсы RePanel — реализованные проекты",
  description:
    "От перегородок и торгового оборудования до мебели, МАФов и тиражных предметов. Реальные проекты с RePanel.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
