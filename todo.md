# Stashly — Yayın Öncesi Yapılacaklar

## Zorunlu (Store Yayını İçin Şart)

- [ ] **Privacy policy sayfası yayınla**
  - İçerik: veri toplanmıyor, paylaşılmıyor, sadece cihazda saklanıyor; kamera yalnızca fotoğraf için kullanılıyor; üçüncü taraf takip yok
  - GitHub Pages veya hosting provider üzerinden static HTML olarak yayınla
  - URL'yi App Store ve Play Store yayın formuna gir

- [ ] **Hosting platformunu seç ve deploy et**
  - Vercel, Netlify veya Cloudflare Pages (her üçü için config dosyaları hazır)
  - HTTPS otomatik sağlandığından emin ol (service worker HTTPS zorunlu)

- [ ] **Bağımlılık güvenlik taraması yap**
  ```bash
  ~/.bun/bin/bun audit
  ```

## Önerilen

- [ ] **Veri export/import özelliği ekle**
  - Kullanıcıların tüm verilerini JSON olarak dışa aktarıp geri yükleyebilmesi
  - GDPR veri taşınabilirliği hakkı kapsamında değerlendirilebilir
  - Etkilenecek dosyalar: `src/hooks/useBoxes.ts`, `src/hooks/useItems.ts`
  - Yeni dosya: `src/utils/exportImport.ts`

- [ ] **Uygulama içi PIN / biyometrik kilit**
  - IndexedDB verisi şu an şifresiz; ev envanteri hassas bilgi içerebilir
  - Web Crypto API veya WebAuthn ile implementasyon
  - Cloud sync eklenmeden önce zorunlu değil ama erken eklemek iyi UX

## Publish Yöntemi Seçimi

- [ ] **Yönteme karar ver**
  - **PWABuilder (önerilen başlangıç):** Play Store için TWA + iOS wrapper otomatik üretir
  - **Capacitor:** Hem iOS hem Android native store; daha fazla yapı gerektirir
  - Play Store için Digital Asset Links (`/.well-known/assetlinks.json`) domain doğrulaması gerekecek

## Cloud Sync Eklenirse (Gelecekte)

- [ ] Kimlik doğrulama sistemi (Supabase Auth veya Firebase Auth)
- [ ] API anahtarlarını `.env` dosyasında tut, koda gömme
- [ ] Supabase kullanılırsa Row-Level Security (RLS) politikaları tanımla
- [ ] Sunucu tarafında rate limiting ekle
- [ ] Veriler sunucuya gönderilmeden önce client-side şifreleme değerlendir (E2EE)
