"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/useAuthUser";

export default function KayitPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dokumanlar");
    }
  }, [loading, user, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dokumanlar");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-24">
      <a href="/" className="text-sm text-muted transition-colors hover:text-foreground">
        ← Anasayfa
      </a>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="E-posta"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Şifre (en az 6 karakter)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Zaten hesabın var mı?{" "}
        <a href="/giris" className="text-accent hover:underline">
          Giriş yap
        </a>
      </p>
    </div>
  );
}
