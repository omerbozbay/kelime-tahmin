# İmposter Kim?

Türkiye Türkçesine özel tasarlanmış “imposter’ı bul” tarzı mobil uyumlu kelime oyunu.

- 1–20 oyuncu ekleme
- Birden fazla kategori seçimi (16 kategori)
- Kategori başına 100 kelime + sahtekara tek kelimelik ipucu
- Web (Netlify) + Mobil (Capacitor ile Android APK)

## Geliştirme

```bash
npm install
npm run dev
```

## Veri doğrulama

```bash
node scripts/validate-words.mjs
```

## Build (Web)

```bash
npm run build
```

Çıktı klasörü: `dist/`

## Netlify ile yayınlama

Repo kökünde `netlify.toml` hazır:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `/* -> /index.html`

## Android APK (Capacitor)

Ön şartlar:
- Android Studio + Android SDK kurulu olmalı

Adımlar:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio açılınca:
- Build > Build Bundle(s) / APK(s) > Build APK(s)
