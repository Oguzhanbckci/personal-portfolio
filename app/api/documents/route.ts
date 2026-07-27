import fs from "fs";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const contentDir = path.join(process.cwd(), "content");
  const fileNames = fs.readdirSync(contentDir).filter((name) => name.endsWith(".md"));

  const documents = fileNames.map((fileName) => {
    const raw = fs.readFileSync(path.join(contentDir, fileName), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: fileName.replace(/\.md$/, ""),
      data,
      body: content.trim(),
    };
  });

  return NextResponse.json(documents);
}
