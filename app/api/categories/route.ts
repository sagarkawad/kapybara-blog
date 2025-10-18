import { fetchCategories } from "@/lib/functions";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await fetchCategories();
  return NextResponse.json(categories);
}
