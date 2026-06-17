import { redirect } from "next/navigation";

// Общая страница «Решения» расформирована — её роль выполняет галерея «Где применяют».
export default function SolutionsPage() {
  redirect("/applications");
}
