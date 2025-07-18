# Quiz Uygulaması API
github linki:https://github.com/raziyekavurgaci/quiz.git

Bu proje, öğretmen ve öğrenciler için tasarlanmış bir quiz/sınav sistemi API'sidir. NestJS framework'ü kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 👨‍🏫 Kullanıcı Yönetimi
- **Kayıt ve Giriş**: Kullanıcılar sisteme kayıt olabilir ve giriş yapabilir
- **Rol Tabanlı Yetkilendirme**: TEACHER (Öğretmen) ve STUDENT (Öğrenci) rolleri
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Çoklu Oturum Yönetimi**: Token yenileme, logout ve tüm cihazlardan çıkış

### 📝 Soru Yönetimi
- **Soru Oluşturma**: Öğretmenler çoktan seçmeli sorular oluşturabilir
- **Soru Görüntüleme**: Tüm kullanıcılar soruları görüntüleyebilir
- **Soru Güncelleme**: Öğretmenler mevcut soruları düzenleyebilir
- **Soru Silme**: Öğretmenler soruları silebilir
- **Çoktan Seçmeli Seçenekler**: A, B, C, D, E seçenekleri ile soru oluşturma

### 🔐 Güvenlik
- **Şifre Hashleme**: bcrypt ile güvenli şifre saklama
- **JWT Token Yönetimi**: Access token ve refresh token sistemi
- **Role-based Access Control**: Endpoint seviyesinde rol kontrolü
- **Request Validation**: DTO'lar ile veri doğrulama

## 🛠️ Teknolojiler

- **Backend Framework**: NestJS
- **Veritabanı**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **TypeScript**: Full TypeScript desteği

## 📁 Proje Yapısı

```
src/
├── auth/           # Kimlik doğrulama modülü
├── user/           # Kullanıcı yönetimi modülü
├── question/       # Soru yönetimi modülü
├── prisma/         # Veritabanı bağlantı modülü
├── jwt/            # JWT servis modülü
├── dto/            # Data Transfer Objects
├── shared/         # Paylaşılan bileşenler
│   ├── decorators/ # Custom decorators
│   └── guards/     # Authentication guards
└── types/          # TypeScript tip tanımları
```

## 🗄️ Veritabanı Şeması

### User (Kullanıcı)
- `id`: UUID (Primary Key)
- `name`: Kullanıcı adı
- `username`: Benzersiz kullanıcı adı
- `password`: Hash'lenmiş şifre
- `role`: TEACHER veya STUDENT

### Question (Soru)
- `id`: UUID (Primary Key)
- `questionText`: Soru metni
- `options`: İlişkili seçenekler

### Option (Seçenek)
- `id`: UUID (Primary Key)
- `optionText`: Seçenek metni
- `optionType`: A, B, C, D, E
- `isCorrect`: Doğru cevap kontrolü

### Answer (Cevap)
- `id`: UUID (Primary Key)
- `userId`: Cevap veren kullanıcı
- `questionId`: İlgili soru
- `optionId`: Seçilen seçenek
- `isCorrect`: Cevabın doğruluğu

## 🔌 API Endpoints

### Authentication (/api/auth)
- `POST /register` - Kullanıcı kaydı
- `POST /login` - Giriş yapma
- `POST /logout` - Çıkış yapma
- `POST /refresh` - Token yenileme
- `POST /logout-all` - Tüm cihazlardan çıkış

### Users (/api/users)
- `GET /me` - Mevcut kullanıcı bilgileri
- `PATCH /` - Kullanıcı bilgilerini güncelleme

### Questions (/api/questions)
- `POST /` - Soru oluşturma (Sadece öğretmenler)
- `GET /` - Tüm soruları listeleme
- `GET /:id` - Belirli bir soruyu görüntüleme
- `PATCH /:id` - Soru güncelleme (Sadece öğretmenler)
- `DELETE /:id` - Soru silme (Sadece öğretmenler)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v16+)
- PostgreSQL
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Çevre değişkenlerini ayarlayın:**
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

3. **Veritabanını hazırlayın:**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Uygulamayı başlatın:**

**Development modunda:**
```bash
npm run start:dev
```

**Production modunda:**
```bash
npm run build
npm run start:prod
```

## 📝 Kullanım Örnekleri

### Kayıt Olma
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yılmaz",
    "username": "ahmet.yilmaz",
    "password": "123456"
  }'
```

### Giriş Yapma
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmet.yilmaz",
    "password": "123456"
  }'
```

### Soru Oluşturma (Öğretmen)
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "questionText": "Türkiye'nin başkenti neresidir?",
    "options": [
      {
        "optionText": "İstanbul",
        "optionType": "A",
        "isCorrect": false
      },
      {
        "optionText": "Ankara",
        "optionType": "B",
        "isCorrect": true
      }
    ]
  }'
```

## 🧪 Test

```bash
# Unit testler
npm run test

# Test kapsamı
npm run test:cov

# E2E testler
npm run test:e2e
```

## 📦 Build

```bash
npm run build
```

## 🔧 Geliştirme Notları

- Tüm endpoint'ler `/api` prefix'i ile başlar
- JWT token'lar Authorization header'ında `Bearer` formatında gönderilmelidir
- Rol tabanlı yetkilendirme `@Roles()` decorator'ı ile yapılır
- Tüm DTO'lar validation pipe'ı ile doğrulanır
- Soft delete kullanılır (deletedAt alanı)

## 📄 Lisans

Bu proje özel lisans altındadır.
