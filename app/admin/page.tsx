"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAbout,
  getProjects,
  getSkills,
  saveAbout,
  saveProjects,
  saveSkills,
  type About,
  type Project,
} from "@/lib/firestore-content";
import { useAuthUser } from "@/lib/useAuthUser";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const isAdmin = !!user && user.email === ADMIN_EMAIL;

  const [dataLoading, setDataLoading] = useState(true);
  const [about, setAbout] = useState<About>({ name: "", title: "", bio: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutStatus, setAboutStatus] = useState<string | null>(null);
  const [skillsStatus, setSkillsStatus] = useState<string | null>(null);
  const [projectsStatus, setProjectsStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([getAbout(), getSkills(), getProjects()]).then(
        ([aboutData, skillsData, projectsData]) => {
          setAbout(aboutData);
          setSkills(skillsData);
          setProjects(projectsData);
          setDataLoading(false);
        },
      );
    }
  }, [isAdmin]);

  if (loading || !isAdmin || dataLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-muted">
        Yükleniyor...
      </div>
    );
  }

  async function handleSaveAbout() {
    setAboutStatus(null);
    await saveAbout(about);
    setAboutStatus("Kaydedildi.");
  }

  async function handleSaveSkills() {
    setSkillsStatus(null);
    await saveSkills(skills.filter((skill) => skill.trim() !== ""));
    setSkillsStatus("Kaydedildi.");
  }

  async function handleSaveProjects() {
    setProjectsStatus(null);
    await saveProjects(
      projects.filter((project) => project.title.trim() !== ""),
    );
    setProjectsStatus("Kaydedildi.");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
        ← Anasayfa
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Admin Paneli</h1>
      <p className="mt-2 text-sm text-muted">
        Buradan yaptığın değişiklikler kaydedildiği anda ana sayfaya yansır.
      </p>

      {/* Hakkımda */}
      <section className="mt-10 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Hakkımda</h2>
        <div className="mt-4 flex flex-col gap-3">
          <input
            value={about.name}
            onChange={(e) => setAbout({ ...about, name: e.target.value })}
            placeholder="Ad Soyad"
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            placeholder="Unvan"
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            value={about.bio}
            onChange={(e) => setAbout({ ...about, bio: e.target.value })}
            placeholder="Kısa tanıtım"
            rows={5}
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSaveAbout}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Kaydet
          </button>
          {aboutStatus && <span className="text-sm text-muted">{aboutStatus}</span>}
        </div>
      </section>

      {/* Yetenekler */}
      <section className="mt-6 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Yetenekler</h2>
        <div className="mt-4 flex flex-col gap-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={skill}
                onChange={(e) => {
                  const next = [...skills];
                  next[index] = e.target.value;
                  setSkills(next);
                }}
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                className="rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:bg-white/5"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setSkills([...skills, ""])}
            className="rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-white/5"
          >
            + Yetenek Ekle
          </button>
          <button
            onClick={handleSaveSkills}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Kaydet
          </button>
          {skillsStatus && <span className="text-sm text-muted">{skillsStatus}</span>}
        </div>
      </section>

      {/* Projeler */}
      <section className="mt-6 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Projeler</h2>
        <div className="mt-4 flex flex-col gap-3">
          {projects.map((project, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={project.title}
                onChange={(e) => {
                  const next = [...projects];
                  next[index] = { ...next[index], title: e.target.value };
                  setProjects(next);
                }}
                placeholder="Proje başlığı"
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                value={project.tech}
                onChange={(e) => {
                  const next = [...projects];
                  next[index] = { ...next[index], tech: e.target.value };
                  setProjects(next);
                }}
                placeholder="Teknoloji"
                className="w-48 rounded-lg border border-border bg-transparent px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                className="rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:bg-white/5"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setProjects([...projects, { title: "", tech: "" }])}
            className="rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-white/5"
          >
            + Proje Ekle
          </button>
          <button
            onClick={handleSaveProjects}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Kaydet
          </button>
          {projectsStatus && <span className="text-sm text-muted">{projectsStatus}</span>}
        </div>
      </section>
    </div>
  );
}
