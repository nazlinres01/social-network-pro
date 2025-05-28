# SocialFlow - Gelişmiş Sosyal Medya Platformu

Modern ve kullanıcı dostu bir sosyal medya platformu. React, Express ve PostgreSQL kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 📝 İçerik Yönetimi
- **Gönderi Paylaşımı**: Metin ve görsel içerik paylaşımı
- **Yorum Sistemi**: Gönderilere yorum yapma ve etkileşim
- **Beğeni Sistemi**: Gönderileri beğenme/beğenmeme
- **İçerik Keşfi**: Trend konular ve popüler gönderiler

### 👥 Sosyal Etkileşim
- **Kullanıcı Profilleri**: Kişiselleştirilebilir profil sayfaları
- **Takip Sistemi**: Diğer kullanıcıları takip etme
- **Mesajlaşma**: Gerçek zamanlı özel mesajlaşma
- **Bildirimler**: Anlık etkileşim bildirimleri

### 🏢 Topluluk Özellikleri
- **Gruplar**: Topluluk oluşturma ve yönetimi
- **Etkinlikler**: Grup etkinlikleri organizasyonu
- **Tartışma Alanları**: Konularına göre düzenlenmiş tartışmalar

### 🎯 Kişisel Özellikler
- **Kaydedilenler**: Favori gönderileri kaydetme
- **Kategorik Düzenleme**: İçerikleri kategorilere ayırma
- **Arama ve Filtreleme**: Gelişmiş arama özellikleri

### ⚙️ Kullanıcı Deneyimi
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Karanlık Mod**: Göz dostu tema seçenekleri
- **Çoklu Dil Desteği**: Türkçe ve İngilizce
- **Özelleştirilebilir Ayarlar**: Kişisel tercih yönetimi

## 🛠 Teknoloji Stack'i

### Frontend
- **React 18** - Modern UI framework'ü
- **TypeScript** - Tip güvenli geliştirme
- **Tailwind CSS** - Utility-first CSS framework'ü
- **Shadcn/ui** - Modern UI komponentleri
- **Wouter** - Hafif routing çözümü
- **TanStack Query** - Server state yönetimi
- **React Hook Form** - Form yönetimi
- **Lucide React** - İkon kütüphanesi

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework'ü
- **TypeScript** - Tip güvenli backend geliştirme
- **Drizzle ORM** - Modern TypeScript ORM
- **PostgreSQL** - İlişkisel veritabanı
- **Zod** - Schema validation

### Altyapı
- **Vite** - Hızlı geliştirme sunucusu
- **ESBuild** - Hızlı bundling
- **PostCSS** - CSS işleme
- **Drizzle Kit** - Veritabanı migration tool'u

## 📋 Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd socialflow
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env` dosyası oluşturun:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/socialflow
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=socialflow
NODE_ENV=development
```

### 4. Veritabanını Hazırlayın
```bash
# Veritabanı şemasını oluşturun
npm run db:push

# Örnek veri eklemek için (opsiyonel)
npm run db:seed
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## 📁 Proje Yapısı

```
socialflow/
├── client/                    # Frontend uygulaması
│   ├── src/
│   │   ├── components/       # React bileşenleri
│   │   │   ├── ui/          # Temel UI bileşenleri
│   │   │   ├── layout/      # Düzen bileşenleri
│   │   │   ├── feed/        # Akış bileşenleri
│   │   │   └── mobile/      # Mobil özel bileşenler
│   │   ├── pages/           # Sayfa bileşenleri
│   │   ├── hooks/           # Custom React hook'ları
│   │   ├── lib/             # Yardımcı kütüphaneler
│   │   └── App.tsx          # Ana uygulama bileşeni
│   └── index.html
├── server/                   # Backend uygulaması
│   ├── db.ts               # Veritabanı bağlantısı
│   ├── storage.ts          # Veri erişim katmanı
│   ├── routes.ts           # API rotaları
│   ├── index.ts            # Server entry point
│   └── vite.ts             # Vite entegrasyonu
├── shared/                  # Paylaşılan tipler ve şemalar
│   └── schema.ts           # Drizzle ORM şemaları
├── drizzle.config.ts       # Drizzle konfigürasyonu
├── package.json
└── README.md
```

## 🎯 API Endpoints

### Kullanıcı İşlemleri
```
GET    /api/auth/me              # Mevcut kullanıcı bilgisi
GET    /api/users/:id            # Kullanıcı profili
GET    /api/users/suggested      # Önerilen kullanıcılar
POST   /api/users/:id/follow     # Kullanıcı takip et
DELETE /api/users/:id/follow     # Takibi bırak
```

### Gönderi İşlemleri
```
GET    /api/feed                 # Ana akış
GET    /api/posts/:id            # Tekil gönderi
POST   /api/posts               # Yeni gönderi
DELETE /api/posts/:id           # Gönderi sil
GET    /api/users/:id/posts     # Kullanıcı gönderileri
```

### Etkileşim İşlemleri
```
POST   /api/posts/:id/like      # Gönderi beğen
DELETE /api/posts/:id/like      # Beğeniyi kaldır
GET    /api/posts/:id/comments  # Yorumları getir
POST   /api/posts/:id/comments  # Yorum yap
DELETE /api/comments/:id        # Yorum sil
```

## 🎨 UI Bileşenleri

### Temel Bileşenler
- **Button** - Çeşitli varyantlarda butonlar
- **Card** - İçerik kartları
- **Input** - Form giriş alanları
- **Dialog** - Modal pencereler
- **Toast** - Bildirim mesajları

### Düzen Bileşenleri
- **TopNavigation** - Üst navigasyon çubuğu
- **LeftSidebar** - Sol yan menü
- **RightSidebar** - Sağ yan panel
- **BottomNavigation** - Mobil alt navigasyon

### Özel Bileşenler
- **PostCard** - Gönderi kartı
- **PostCreator** - Gönderi oluşturma formu
- **CommentSection** - Yorum bölümü
- **UserProfile** - Kullanıcı profil kartı

## 📱 Responsive Tasarım

### Breakpoint'ler
- **sm**: 640px+ (Küçük ekranlar)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Laptop)
- **xl**: 1280px+ (Desktop)

### Mobil Optimizasyon
- Alt navigasyon çubuğu
- Touch-friendly butonlar
- Swipe gesture'ları
- Optimized scroll deneyimi

## 🔧 Geliştirme

### Kod Stili
- TypeScript strict mode
- ESLint kuralları
- Prettier formatlaması
- Consistent naming conventions

### Test Stratejisi
```bash
# Unit testler
npm run test

# Integration testler
npm run test:integration

# E2E testler
npm run test:e2e
```

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check
```

## 📊 Veritabanı Şeması

### Tablolar
- **users** - Kullanıcı bilgileri
- **posts** - Gönderi verileri
- **comments** - Yorum verileri
- **likes** - Beğeni verileri
- **follows** - Takip ilişkileri
- **conversations** - Mesaj konuşmaları
- **messages** - Mesaj verileri

### İlişkiler
- Kullanıcı ↔ Gönderiler (1:N)
- Gönderi ↔ Yorumlar (1:N)
- Kullanıcı ↔ Beğeniler (1:N)
- Kullanıcı ↔ Takipler (N:N)
- Kullanıcı ↔ Mesajlar (1:N)

## 🔐 Güvenlik

### Veri Koruma
- SQL injection koruması (Drizzle ORM)
- XSS koruması
- CSRF token'ları
- Rate limiting

### Kimlik Doğrulama
- Session-based auth
- Secure cookie ayarları
- Password hashing
- Account lockout

## 🚀 Deployment

### Production Hazırlığı
```bash
# Environment variables ayarları
export NODE_ENV=production
export DATABASE_URL=<production-db-url>

# Build oluşturma
npm run build

# Production server başlatma
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Email**: support@socialflow.com
- **Website**: https://socialflow.com
- **Documentation**: https://docs.socialflow.com

## 🙏 Teşekkürler

- [Shadcn/ui](https://ui.shadcn.com) - UI bileşenleri için
- [Lucide](https://lucide.dev) - İkonlar için
- [Unsplash](https://unsplash.com) - Görseller için
- [Drizzle](https://orm.drizzle.team) - ORM çözümü için

---

**SocialFlow** ile modern sosyal medya deneyimini yaşayın! 🚀