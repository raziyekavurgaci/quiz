# Quiz Uygulaması API
GitHub: https://github.com/raziyekavurgaci/quiz.git

Öğretmen ve öğrenciler için tasarlanmış quiz/sınav sistemi API'si. NestJS ile geliştirilmiştir.

## 🚀 Özellikler

### 👤 Kullanıcı Sistemi
- Kayıt/Giriş sistemi (TEACHER/STUDENT rolleri)
- JWT Authentication
- Çoklu oturum yönetimi
- Profil güncelleme

### 📝 Soru Sistemi  
- Öğretmenler soru oluşturabilir/düzenleyebilir/silebilir
- Çoktan seçmeli sorular (A-E seçenekleri)
- Tüm kullanıcılar soruları görüntüleyebilir
- Rastgele soru seçimi

### 🎯 Cevap Sistemi
- Öğrenciler soru cevaplayabilir
- Anında doğru/yanlış geri bildirimi
- Cevap geçmişi
- Otomatik puanlama

### 🔐 Güvenlik
- bcrypt şifre hashleme
- JWT token yönetimi
- Rol tabanlı yetkilendirme
- Soft delete sistemi

## 🛠️ Teknolojiler
- **Backend**: NestJS ^11.0.1
- **Veritabanı**: PostgreSQL + Prisma ^6.10.1
- **Authentication**: JWT
- **Validation**: class-validator
- **TypeScript**: Full support

## 📁 Proje Yapısı
```
src/
├── auth/           # Kimlik doğrulama
├── user/           # Kullanıcı yönetimi
├── question/       # Soru yönetimi
│   ├── answer/     # Cevap sistemi
│   ├── option/     # Seçenek yönetimi
│   └── score/      # Puanlama sistemi
├── prisma/         # Veritabanı
├── jwt/            # JWT servisleri
├── dto/            # Data transfer objects
└── shared/         # Guards, decorators
```

## 🗄️ Veritabanı
- **User**: Kullanıcı bilgileri (id, name, username, password, role)
- **Question**: Soru bilgileri (id, questionText)
- **Option**: Seçenekler (id, optionText, optionType, isCorrect)
- **Answer**: Cevaplar (id, userId, questionId, optionId, isCorrect)
- **Token**: Oturum yönetimi (id, userId, expiresAt, revokedAt)

## 🔌 API Endpoints

### Health Check
- `GET /` - API durumu kontrolü (Health check)

### Authentication (/api/auth)
- `POST /register` - Kullanıcı kaydı
- `POST /login` - Giriş
- `POST /logout` - Çıkış
- `POST /refresh` - Token yenileme
- `POST /logout-all` - Tüm cihazlardan çıkış
denedik
### Users (/api/users)
- `GET /me` - Profil bilgileri
- `PATCH /` - Profil güncelleme

### Questions (/api/questions)
- `POST /` - Soru oluşturma (🔒 Öğretmen)
- `GET /` - Tüm soruları listeleme
- `GET /random` - Rastgele soru getirme
- `GET /:id` - Tek soru görüntüleme
- `PATCH /:id` - Soru güncelleme (🔒 Öğretmen)
- `DELETE /:id` - Soru silme (🔒 Öğretmen)
- `GET /score` - Kendi skorunu görme (🔒 Öğrenci)
- `GET /score/:userId` - Öğrenci skorunu görme (🔒 Öğretmen)

## 📋 API Response Formatı
Tüm API yanıtları standart formatta döner:
```json
{
  "message": "İşlem açıklaması",
  "data": { /* Veri objesi */ }
}
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16+)
- PostgreSQL
- npm/yarn

### Adımlar
```bash
# 1. Projeyi klonla
git clone https://github.com/raziyekavurgaci/quiz.git
cd quiz

# 2. Bağımlılıkları yükle
npm install

# 3. Çevre değişkenlerini ayarla (.env)
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_db"
JWT_SECRET="your-main-secret-key"
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
PORT=3000

# 4. Veritabanını hazırla
npx prisma migrate dev
npx prisma generate

# 5. Uygulamayı başlat
npm run start:dev
```

### Environment Variables Açıklaması
- `DATABASE_URL`: PostgreSQL bağlantı string'i
- `JWT_SECRET`: Ana JWT secret key
- `JWT_ACCESS_SECRET`: Access token için secret key
- `JWT_REFRESH_SECRET`: Refresh token için secret key
- `PORT`: Sunucu portu (varsayılan: 3000)

## 📝 Kullanım Örnekleri

### Health Check
```bash
curl http://localhost:3000/
# Response: "Hello World!"
```

### Kayıt
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "username": "test", "password": "123456"}'
```

### Giriş
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "123456"}'
```

### Rastgele Soru
```bash
curl http://localhost:3000/api/questions/random
```

### Puan Kontrolü (Öğrenci)
```bash
curl -X GET http://localhost:3000/api/questions/score \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Soru Oluşturma
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "questionText": "2+2 kaçtır?",
    "options": [
      {"optionText": "3", "optionType": "A", "isCorrect": false},
      {"optionText": "4", "optionType": "B", "isCorrect": true}
    ]
  }'
```

## 🧪 Test & Build
```bash
npm run test          # Unit testler
npm run test:e2e      # E2E testler  
npm run build         # Production build
npm run lint          # Code quality
```

## 🚧 Gelecek Planlar
- Answer/Option/Score endpoint'leri
- Quiz sistemi
- AI destekli soru önerisi
- Gerçek zamanlı sınavlar

## 🔧 Troubleshooting

### Sık Karşılaşılan Sorunlar

**Veritabanı Bağlantı Hatası:**
```bash
# PostgreSQL servisinin çalıştığından emin olun
sudo service postgresql start

# Veritabanını tekrar migrate edin
npx prisma migrate reset
```

**JWT Token Hatası:**
- Environment variable'ların doğru ayarlandığından emin olun
- Token'ın `Bearer` prefix'i ile gönderildiğini kontrol edin

**Port Zaten Kullanımda:**
```bash
# Farklı bir port kullanın
PORT=3001 npm run start:dev
```

**Prisma Generate Hatası:**
```bash
# Prisma client'ı yeniden generate edin
npx prisma generate --force
```

## 📄 Lisans
Özel lisans - Kullanım için izin gereklidir.

---
**Geliştirici**: Raziye Kavurgacı


