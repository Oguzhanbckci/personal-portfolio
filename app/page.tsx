import Link from "next/link";
import { getContact } from "@/lib/content";
import { getAbout, getProjects, getSkills } from "@/lib/firestore-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [about, skills, projects] = await Promise.all([
    getAbout(),
    getSkills(),
    getProjects(),
  ]);
  const contact = getContact();
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#hero" className="font-semibold tracking-tight">
            {about.name}
          </a>
          <nav className="flex gap-6 text-sm text-muted">
            <a
              href="#hakkimda"
              className="transition-colors hover:text-foreground"
            >
              Hakkımda
            </a>
            <a
              href="#yetenekler"
              className="transition-colors hover:text-foreground"
            >
              Yetenekler
            </a>
            <a
              href="#projeler"
              className="transition-colors hover:text-foreground"
            >
              Projeler
            </a>
            <a
              href="#iletisim"
              className="transition-colors hover:text-foreground"
            >
              İletişim
            </a>
            <Link
              href="/giris"
              className="transition-colors hover:text-foreground"
            >
              Giriş
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section
          id="hero"
          className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6 text-center"
        >
          <p className="text-sm font-medium text-accent">Merhaba, Ben</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {about.name}
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">{about.title}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#projeler"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Projelerimi Gör
            </a>
            <a
              href="#iletisim"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              İletişime Geç
            </a>
          </div>
        </section>

        <section id="hakkimda" className="mx-auto w-full max-w-3xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight">Hakkımda</h2>
          <p className="mt-6 leading-8 text-muted">{about.bio}</p>
        </section>

        <section
          id="yetenekler"
          className="mx-auto w-full max-w-5xl px-6 py-24"
        >
          <h2 className="text-2xl font-semibold tracking-tight">Yetenekler</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="projeler" className="mx-auto w-full max-w-5xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight">Projeler</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div
                key={index}
                className="rounded-xl border border-border p-6 transition-colors hover:border-accent/60"
              >
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-accent">{project.tech}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="iletisim"
          className="mx-auto w-full max-w-3xl px-6 py-24 text-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight">İletişim</h2>
          <p className="mt-4 text-muted">
            Benimle çalışmak veya sohbet etmek isterseniz aşağıdan
            ulaşabilirsiniz.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              GitHub
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {contact.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-8 text-center text-sm text-muted">
        © {year} {about.name}
      </footer>
    </div>
  );
}
