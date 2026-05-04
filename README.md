# Home Inventory

Hangi kutuda ne var? Evde, dükkanда veya depoda sakladığın eşyaları kutu bazında takip eden PWA.

## Gereksinimler

Node.js bu makinede yüklü değil. Bunun yerine **Bun** kullanılıyor.

Bun kurulu değilse önce kur:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Uygulamayı Çalıştırma

**Sadece bilgisayarda açmak için:**

```bash
~/.bun/bin/bun run dev
```

Tarayıcıda `http://localhost:5173` adresine git.

**Telefonda (Safari) test etmek için:**

```bash
~/.bun/bin/bun run dev -- --host
```

Terminalde çıkan `Network:` satırındaki adresi (örn. `http://192.168.1.103:5174`) iPhone Safari'ye yaz. Bilgisayar ve telefon aynı Wi-Fi'da olmalı.

## Diğer Komutlar

```bash
~/.bun/bin/bun run build   # production build
~/.bun/bin/bun run lint    # ESLint
```
