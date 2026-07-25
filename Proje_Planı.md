# Kişisel Portfolyo Projesi — Plan Dökümanı

## Genel Özet

Bu proje, staj kapsamında Next.js, GitHub, Vercel ve Firebase araçlarını uçtan uca öğrenmek amacıyla geliştirilen kişisel bir portfolyo sitesidir. Proje üç fazda ilerleyecektir:

- **Faz 3**: Tek sayfalık portfolyo sitesi — GitHub'a yükleme ve Vercel'de ücretsiz yayınlama
- **Faz 2**: Kayıt/giriş sistemi (Firebase Authentication) ve içerik dökümanlarını görüntüleme sayfası
- **Faz 3**: İçerik yönetimi için admin paneli

---

## Faz 1 — Tek Sayfalık Portfolyo Sitesi

### Amaç

Ziyaretçinin tek bir sayfada kaydırarak (scroll) gezinebileceği, kişisel bilgileri, yetenekleri, projeleri ve iletişim bilgilerini gösteren bir site.

### Teknoloji Seçimi

- **Next.js** (App Router) — React tabanlı, Vercel ile birebir uyumlu
- **TypeScript** — tip güvenliği için
- **Tailwind CSS** — hızlı ve tutarlı stil yazımı için
- **Vercel** — ücretsiz katmanda barındırma ve otomatik deploy

### Sayfa Yapısı (bölümler)

1. **Hero / Giriş** — isim, unvan, kısa tanıtım
2. **Hakkımda** — eğitim, ilgi alanları, kısa biyografi
3. **Yetenekler** — teknik beceriler
4. **Projeler** — proje kartları (başlık, açıklama, teknoloji etiketleri, link)
5. **İletişim** — e-posta, GitHub, LinkedIn bağlantıları

### Tasarım Kuralları

- Sade ve okunabilir tipografi, bol boşluk kullanımı
- Tam responsive (mobil, tablet, masaüstü)
- Tek bir vurgu rengi + nötr arka plan/metin renkleri
- Karanlık/aydınlık tema desteği
- Gereksiz animasyon/karmaşıklıktan kaçınılacak; sadelik önceliklidir

### İçerik Yaklaşımı

Site içeriği (hakkımda metni, proje listesi, yetenek listesi) doğrudan koda gömülmek yerine `content/` klasörü altında ayrı `.md` dosyalarında tutulacak (örn. `content/about.md`, `content/projects.md`, `content/skills.md`). Next.js tarafında bu dosyalar okunup sayfada render edilecek. Bu sayede:

- İçerik güncellemesi için kod değiştirmek gerekmez, sadece ilgili `.md` dosyası düzenlenir
- Faz 2'deki "döküman görüntüleme" özelliği için zemin hazırlanmış olur

### Dağıtım Adımları (özet)

1. Next.js projesi oluşturulur, yerelde test edilir
2. GitHub deposuna ilk commit ile yüklenir
3. Vercel hesabı GitHub ile bağlanır, proje import edilir
4. Vercel ücretsiz (Hobby) katmanında otomatik deploy yapılır — her `main` branch push'unda otomatik güncellenir

---

## Faz 2 — Kayıt/Giriş Sistemi ve Döküman Görüntüleme

### Amaç

Siteye giriş yapan (kayıtlı) kullanıcıların, `content/` altındaki md dosyalarını bir liste/ağaç yapısında görebileceği korumalı bir sayfa eklemek.

### Değerlendirilen Alternatifler

Kimlik doğrulama (authentication) için değerlendirilen seçenekler:

| Seçenek                          | Artı                                                                                                                                        | Eksi                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| NextAuth.js (Auth.js) + kendi DB | Tam kontrol, esnek                                                                                                                          | Kurulumu daha uzun, veritabanı yönetimi gerekir |
| Clerk                            | Çok hızlı kurulum, hazır UI                                                                                                                 | Ücretsiz katman kullanıcı sayısıyla sınırlı     |
| Supabase Auth                    | Auth + veritabanı bir arada                                                                                                                 | Ekstra bir servis daha öğrenmek gerekir         |
| **Firebase Authentication**      | Ücretsiz katman geniş, Next.js ile iyi dokümantasyon, e-posta/şifre ve Google girişi hazır, Google ekosistemiyle (Firestore) kolay genişler | Vendor lock-in (Google'a bağımlılık)            |

**Karar: Firebase Authentication** — patronun yönergesi gereği uygulama için bu seçildi. Ücretsiz (Spark) katman bu proje ölçeği için yeterli.

### Planlanan Özellikler

- E-posta/şifre ile kayıt ol / giriş yap
- Giriş yapmamış kullanıcı korumalı sayfaya yönlendirilmez, giriş sayfasına yönlendirilir
- Giriş yapan kullanıcı `/dokumanlar` (örnek route) sayfasında `content/*.md` dosyalarının listesini görür **(Varsayım: liste + tıklayınca içerik açılan basit bir yapı, karmaşık bir ağaç görünümü değil)**
- Firebase projesi ücretsiz katmanda açılacak, API anahtarları `.env.local` içinde tutulacak ve **GitHub'a asla commit edilmeyecek**

---

## Faz 3 — Admin Paneli

### Amaç

Portfolyo sahibinin site içeriğini kod değiştirmeden güncelleyebileceği korumalı bir yönetim arayüzü.

### Planlanan Özellikler

- Sadece admin rolüne sahip kullanıcı (Firebase üzerinde işaretlenecek) `/admin` sayfasına erişebilir
- Hakkımda, yetenekler ve projeler bölümlerindeki içerik bu panelden düzenlenebilir
- Düzenlemeler `content/*.md` dosyalarına yazılır

---

## Durum Takibi

- [x] Proje klasörü oluşturuldu
- [x] Bağımsız git deposu başlatıldı
- [x] GitHub deposu oluşturuldu ve remote bağlandı
- [x] Plan dökümanı yazıldı
- [ ] Next.js projesi oluşturuldu
- [ ] İlk commit GitHub'a push edildi
- [ ] Patron collaborator olarak eklendi
- [ ] Vercel'de yayınlandı
- [ ] Faz 2 kodlaması (Firebase Authentication + döküman sayfası)
- [ ] Faz 3 kodlaması (admin paneli)
