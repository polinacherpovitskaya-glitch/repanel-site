import { redirect } from "next/navigation";

// Публичная столешница убрана — расчёты приватные (/calc). Старые ссылки ведём на контакты.
export default function CountertopPublicRedirect() {
  redirect("/contacts");
}
