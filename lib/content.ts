import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

function readContentFile(fileName: string) {
  const filePath = path.join(contentDir, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export type About = {
  name: string;
  title: string;
  bio: string;
};

export type Project = {
  title: string;
  tech: string;
};

export type Contact = {
  github: string;
  email: string;
};

export function getAbout(): About {
  const { data, content } = readContentFile("about.md");
  return {
    name: data.name,
    title: data.title,
    bio: content.trim(),
  };
}

export function getSkills(): string[] {
  const { data } = readContentFile("skills.md");
  return data.skills as string[];
}

export function getProjects(): Project[] {
  const { data } = readContentFile("projects.md");
  return data.projects as Project[];
}

export function getContact(): Contact {
  const { data } = readContentFile("contact.md");
  return data as Contact;
}
