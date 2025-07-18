import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

/*
Merhaba herkese! Ben Raziye ve bugün sizlere  geliştirdiğim
 Quiz Uygulaması API'sini detaylıca sunacağım. Bu projeyi geliştirirken eğitim sektöründeki 
 gerçek ihtiyaçları karşılamayı hedefledim ve modern teknolojileri kullanarak hem öğretmenlerin 
 hem de öğrencilerin hayatını kolaylaştıracak bir sistem oluşturmaya odaklandım.


  Sistemimde genel yapısı itibariyle öğretmenler kolayca sorular oluşturabiliyor, 
  öğrencilerin performanslarını gerçek zamanlı olarak takip edebiliyorlar. Öğrenciler ise 
 soru cevaplayabiliyor, anında sonuçlarını görebiliyor ve hangi 
  sorularda hata yaptıklarını detaylı şekilde inceleyebiliyorlar.

  kullanıcı yönetim ve güvenlik sistemi
  Projemin temelinde bir kullanıcı yönetimi sistemi kurdum ve bu sistemde 
  az önce bahsettiğim gibi öğretmen ve öğrenci rolleri bulunuyor. Her rolün kendine özel yetkileri bulunuyor. 
  JWT (JSON Web Token) tabanlı bir authentication sistemi implement ettim çünkü bu 
  sistem hem güvenli hem de ölçeklenebilir.Şifreleri bcrypt algoritması ile hashliyorum, 
  bu da kullanıcı şifrelerinin veritabanında açık metin olarak saklanmamasını ve 
  güvenlik açıklarına karşı sistemi korumasını sağlıyor.

  soru yönetim modulu
  Öğretmenler çoktan seçmeli sorular oluşturabiliyor, bu sorulara A'dan E'ye kadar seçenekler 
  ekleyebiliyor ve hangi seçeneğin doğru cevap olduğunu belirleyebiliyorlar.
   Rol tabanlı yetkilendirme sistemi sayesinde sadece öğretmenler soru oluşturabiliyor, güncelleyebiliyor
    ve silebiliyorken, öğrenciler sadece soruları görüntüleyebiliyor ve cevaplayabiliyor.

  api endpointleri
  Authentication endpoint'lerimde bahsedeceğim öncelikle
  register endpoint'i ile kullanıcılar sisteme kolayca kayıt olabiliyor, 
  login ile güvenli giriş yapabiliyor, logout ile oturumlarını sonlandırabiliyor ve 
  refresh endpoint'i sayesinde token'larını yenileyebiliyorlar. Ayrıca logout-all 
  endpoint'i ile tüm cihazlardan çıkış yapabilme özelliği ekledim, bu  güvenlik açısından önemli.

  User endpoint'lerini kısa  çünkü kullanıcı işlemlerinin 
  çoğu authentication modülünde halledilebiliyor. /me endpoint'i ile kullanıcılar 
  kendi profil bilgilerini görebiliyor ve PATCH ile de bu bilgileri güncelleyebiliyorlar.

  Question endpoint'lerinde  GET /questions 
  ile tüm soruları listeleyebilirsiniz, GET /questions/:id ile spesifik bir soruyu alabilirsiniz, 
  POST ile yeni soru oluşturabilirsiniz (sadece öğretmenler), PATCH ile güncelleyebilirsiniz ve 
  DELETE ile silebilirsiniz.

  bu projeyi ileride geliştirme amaçlı olarak eklemeyi düşündüğüm birkaç özellikten bahsedeceğim 

  Sistemime üç kademeli bir hiyerarşi ekleyeceğim: Süper Admin, Öğretmen ve Öğrenci. 
  Süper Admin rolü, eğitim kurumunun yöneticileri için tasarlanacak ve sadece onlar öğretmen 
  hesapları oluşturabilecek, düzenleyebilecek ve silebilecek. Bu sayede sistemin kontrolü tamamen 
  kurumun elinde olacak ve yetkisiz öğretmen hesapları oluşturulmasının önüne geçilecek. 

  Soru havuzu kavramını genişleterek, öğretmenlerin kolayca quiz oluşturabileceği 
  gelişmiş bir sistem kurulabilir. Bu sistemde:
  Rastgele Quiz Oluşturma: seviyesinde göre veya konulara göre quizler oluşturulabilir

   AI destekli olarak, öğrencinin önceki performansına göre quiz zorluğu otomatik olarak ayarlanacak. 
   Başarılı öğrencilere daha zor sorular, zorlananlara ise seviyelerine uygun sorular gelecek.

 */
