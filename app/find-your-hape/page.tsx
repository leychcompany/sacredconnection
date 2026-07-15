import { FindYourHapeQuiz } from "@/components/quiz/FindYourHapeQuiz";
import { getProducts } from "@/lib/woo/products";

export const revalidate = 300;

export const metadata = {
  title: "Find Your Hapé",
  description:
    "Answer a few gentle questions and we'll match you with the ceremonial hapé blend meant for your path.",
};

export default async function FindYourHapePage() {
  const products = await getProducts({ perPage: 40 }).catch(() => []);
  return <FindYourHapeQuiz products={products} />;
}
