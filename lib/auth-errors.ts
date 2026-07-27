export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Bu e-posta adresi zaten kayıtlı.";
    case "auth/invalid-email":
      return "Geçersiz e-posta adresi.";
    case "auth/weak-password":
      return "Şifre en az 6 karakter olmalı.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-posta veya şifre hatalı.";
    default:
      return "Bir hata oluştu, lütfen tekrar deneyin.";
  }
}
