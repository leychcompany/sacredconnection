import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-wc-webhook-secret") || 
    new URL(request.url).searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await request.json().catch(() => null);
  } catch {
    /* empty body ok */
  }

  revalidateTag("products");
  revalidateTag("categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
