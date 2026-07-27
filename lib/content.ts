import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export type Contact = {
  github: string;
  email: string;
};

export function getContact(): Contact {
  const filePath = path.join(contentDir, "contact.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return data as Contact;
}
