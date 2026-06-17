import { redirect } from "next/navigation";

// Публичный калькулятор убран — расчёты приватные (/calc). Старые ссылки ведём на контакты.
export default function CalculatorPublicRedirect() {
  redirect("/contacts");
}
