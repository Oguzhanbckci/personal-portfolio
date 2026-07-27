@AGENTS.md

# Proje: personal-portfolio

Bu, bir bilgisayar mühendisliği öğrencisinin staj kapsamında, patronunun verdiği yönergeyle adım adım öğrenerek geliştirdiği kişisel portfolyo projesidir. Kullanıcı Claude Code'u yeni bir terminal oturumunda her açtığında, konuşma geçmişi sıfırlanır — bu dosya, projenin neresinde kaldığımızı hatırlamak için kalıcı referans kaynağıdır. Ayrıntılı faz planı ve tasarım kararları için proje kök dizinindeki `PROJE_PLANI.md` dosyasına bakılmalı; burası daha çok "şu an neredeyiz, nasıl çalışıyoruz" özeti.

## Mevcut Durum (hepsi tamamlandı ve canlıda çalışıyor)

- **Faz 1:** Next.js (App Router, TypeScript, Tailwind CSS v4) tek sayfalık portfolyo sitesi. GitHub'a yüklü (`github.com/Oguzhanbckci/personal-portfolio`), Vercel'de yayında.
- **Faz 2:** Firebase Authentication (e-posta/şifre) ile `/kayit` ve `/giris` sayfaları; giriş yapmış kullanıcının `content/*.md` dosyalarını görebildiği korumalı `/dokumanlar` sayfası.
- **Faz 3:** Firestore tabanlı `/admin` paneli — sadece admin e-postasıyla giriş yapan kullanıcı Hakkımda/Yetenekler/Projeler içeriğini düzenleyip kaydedebiliyor, değişiklik anında ana sayfaya yansıyor.

Şu an aktif/bekleyen bir "sıradaki adım" **yok** — üç faz da bitti ve doğrulandı. Yeni bir oturumda kullanıcı bir istekle gelmeden önce yeni bir iş varsayılmamalı; önce ne yapmak istediği sorulmalı.

## Mimari Kararlar ve Önemli Notlar

- **İçerik kaynağı ayrımı:** Hakkımda/Yetenekler/Projeler artık **Firestore**'dan okunuyor (`lib/firestore-content.ts`, `content` koleksiyonu, dokümanlar: `about`, `skills`, `projects`). `content/about.md`, `content/skills.md`, `content/projects.md` dosyaları artık sadece ilk/referans veri, kodda kullanılmıyor. `content/contact.md` ise hâlâ statik dosyadan okunuyor (`lib/content.ts`), admin panelinin kapsamı dışında.
  - **Neden:** Vercel gibi serverless platformlar dosya sistemine kalıcı yazamıyor; admin panelinin gerçekten çalışması için gerçek bir veritabanı (Firestore) gerekti.
- **Ana sayfa dinamik render'da** (`export const dynamic = "force-dynamic"` in `app/page.tsx`) — admin panelinden yapılan değişikliklerin yeni bir deploy gerekmeden anında görünmesi için.
- **Güvenlik:** `/admin` yazma işlemleri Firestore Security Rules ile korunuyor (sadece admin e-postası yazabilir, herkes okuyabilir). `/dokumanlar`'ın arkasındaki `/api/documents` route'u ise sadece client-side UI ile gizleniyor, sunucu tarafında gerçek bir auth kontrolü yok — içerik zaten herkese açık olduğu için kabul edilebilir bir basitleştirme, ama gerçekten gizli bir şey eklenirse bu route'un da Firebase ID token doğrulaması yapması gerekir.
- **Ortam değişkenleri iki ayrı yerde tutulmalı:** `.env.local` (yerel geliştirme) ve Vercel → Settings → Environment Variables (canlı site) — biri diğerini otomatik güncellemiyor, ikisi de manuel senkron tutulmalı. Değişkenler: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_ADMIN_EMAIL`.
- **Admin e-postası:** `oguzhanbckc@gmail.com` — hem Firestore Security Rules'ta hem `NEXT_PUBLIC_ADMIN_EMAIL` ortam değişkeninde tanımlı.
- **Vercel'de yeni bir env var eklendiğinde**, zaten yapılmış bir deployment'ı otomatik güncellemiyor — Deployments sekmesinden elle "Redeploy" tetiklenmesi gerekiyor.
- **İç sayfa geçişlerinde `<Link>` (next/link) kullanılmalı**, düz `<a>` değil (ESLint bunu zorunlu kılıyor) — sadece sayfa-içi çapa bağlantıları (`#hakkimda` gibi) ve dış linkler/`mailto:` için `<a>` kullanılıyor.

## Çalışma Şekli (bu kullanıcıyla nasıl ilerliyoruz)

Kullanıcı bu projeyi **öğrenmek** için yapıyor, hızlıca bitirmek için değil. Kritik kural: **terminal komutlarını (git, npm, hatta salt-okunur `git status`/`git log` dahil) her zaman kullanıcı kendi terminalinde çalıştırır** — Claude bunları kendi başına Bash/PowerShell aracıyla çalıştırmaz. Her adımda önce ne yapılacağı ve NEDEN yapıldığı açıklanır, sonra tam komut verilir, kullanıcı çalıştırıp çıktıyı yapıştırır, sonra bir sonraki adıma geçilir. Kod/içerik dosyalarının yazımı (Write/Edit) Claude tarafından yapılabilir, ama her değişiklik açıklanarak.

## Güncelleme Kuralı

Bu dosya statik değil — yeni bir faz tamamlandığında, önemli bir mimari karar alındığında veya büyük bir hata çözüldüğünde Claude bu dosyayı güncel tutmalı, böylece terminal kapatılıp yeniden açıldığında kaldığımız yer kaybolmaz.
