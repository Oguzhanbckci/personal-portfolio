import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type About = {
  name: string;
  title: string;
  bio: string;
};

export type Project = {
  title: string;
  tech: string;
};

export async function getAbout(): Promise<About> {
  const snap = await getDoc(doc(db, "content", "about"));
  return snap.data() as About;
}

export async function getSkills(): Promise<string[]> {
  const snap = await getDoc(doc(db, "content", "skills"));
  return (snap.data()?.skills as string[]) ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const snap = await getDoc(doc(db, "content", "projects"));
  return (snap.data()?.projects as Project[]) ?? [];
}

export async function saveAbout(about: About) {
  await setDoc(doc(db, "content", "about"), about);
}

export async function saveSkills(skills: string[]) {
  await setDoc(doc(db, "content", "skills"), { skills });
}

export async function saveProjects(projects: Project[]) {
  await setDoc(doc(db, "content", "projects"), { projects });
}
