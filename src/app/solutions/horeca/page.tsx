import { redirect } from "next/navigation";

// Отдельной страницы «Мебель для HoReCa» нет — коллекция живёт на «Готовых решениях».
export default function HorecaIndexRedirect() {
  redirect("/solutions");
}
