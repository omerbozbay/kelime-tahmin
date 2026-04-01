import { categories } from '../src/data/words.js';

const expectedCategories = [
  'Hayvanlar',
  'Yiyecekler',
  'Nesneler',
  'Film/Dizi',
  'Mekanlar',
  'Sporlar',
  'Meslekler',
  'Markalar',
  'Araçlar',
  'Süper Güçler',
  'Korkular',
  'Ünlüler',
  'Oyunlar',
  'Hobiler',
  'Ülkeler',
  'Şehirler'
];

const errors = [];

for (const cat of expectedCategories) {
  const list = categories[cat];
  if (!Array.isArray(list)) {
    errors.push(`[${cat}] kategori bulunamadı veya dizi değil.`);
    continue;
  }

  if (list.length !== 100) {
    errors.push(`[${cat}] adet ${list.length} (beklenen: 100).`);
  }

  list.forEach((item, idx) => {
    const entry = Array.isArray(item) ? item : [item?.word, item?.hint];
    const [word, hint] = entry;

    if (typeof word !== 'string' || word.trim() === '') {
      errors.push(`[${cat} #${idx}] word geçersiz.`);
      return;
    }

    if (typeof hint !== 'string' || hint.trim() === '') {
      errors.push(`[${cat} #${idx}] hint geçersiz.`);
      return;
    }

    if (word !== word.trim()) {
      errors.push(`[${cat} #${idx}] word baş/son boşluk içeriyor.`);
    }

    if (hint !== hint.trim()) {
      errors.push(`[${cat} #${idx}] hint baş/son boşluk içeriyor.`);
    }

    if (/\s/.test(hint)) {
      errors.push(`[${cat} #${idx}] hint tek kelime olmalı: "${hint}".`);
    }
  });
}

if (errors.length) {
  console.error(`Kelime verisi hataları (${errors.length}):`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Kelime verisi doğrulandı: 16 kategori x 100 kelime, ipuçları tek kelime.');

