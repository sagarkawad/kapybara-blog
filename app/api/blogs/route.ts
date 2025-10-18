import { fetchBlogs } from "@/lib/functions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { category } = await request.json();
  const blogs = await fetchBlogs(category);
  return NextResponse.json(blogs);
}
