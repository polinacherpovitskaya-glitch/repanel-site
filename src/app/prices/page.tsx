import { redirect } from "next/navigation";

// Публичный прайс убран — расчёты приватные (/calc). Старые ссылки ведём на контакты.
export default function PricesРublicRedirect() {
  redirect("/contacts");
}
