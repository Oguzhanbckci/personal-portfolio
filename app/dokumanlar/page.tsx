"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/useAuthUser";

type Doc = {
  slug: string;
  data: Record<string, unknown>;
  body: string;
};

export default function DokumanlarPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/giris");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/documents")
        .then((res) => res.json())
        .then((data: Doc[]) => {
          setDocs(data);
          setActiveSlug((current) => current ?? data[0]?.slug ?? null);
        });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-muted">
        Yükleniyor...
      </div>
    );
  }

  const activeDoc = docs?.find((doc) => doc.slug === activeSlug);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Anasayfa
      </Link>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dökümanlar</h1>
          <p className="mt-1 text-sm text-muted">
            {user.email} olarak giriş yaptın.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-white/5"
            >
              Admin Paneli
            </Link>
          )}
          <button
            onClick={() => signOut(auth)}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-white/5"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-[200px_1fr]">
        <nav className="flex flex-col gap-2">
          {docs?.map((doc) => (
            <button
              key={doc.slug}
              onClick={() => setActiveSlug(doc.slug)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeSlug === doc.slug
                  ? "bg-accent text-white"
                  : "border border-border hover:bg-white/5"
              }`}
            >
              {doc.slug}.md
            </button>
          ))}
        </nav>

        <div className="rounded-xl border border-border p-6">
          {!activeDoc ? (
            <p className="text-muted">
              Görüntülemek için soldan bir döküman seç.
            </p>
          ) : (
            <div>
              <h2 className="font-semibold">{activeDoc.slug}.md</h2>
              {Object.keys(activeDoc.data).length > 0 && (
                <dl className="mt-4 space-y-1 text-sm">
                  {Object.entries(activeDoc.data).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="font-medium text-muted">{key}:</dt>
                      <dd>{JSON.stringify(value)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {activeDoc.body && (
                <p className="mt-4 whitespace-pre-wrap text-sm text-muted">
                  {activeDoc.body}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
