# Menaxhimi i Inventarit

PWA për menaxhimin e inventarit — React, Vite, Tailwind CSS, Dexie (IndexedDB). Të gjitha etiketat në shqip.

## Teknologjitë

- **React** + **Vite** + **Tailwind CSS**
- **Dexie** (IndexedDB), **jsPDF**, **xlsx**, **lucide-react**, **date-fns**, **react-router-dom**

## Komandat

```bash
npm install
npm run dev    # Serveri i zhvillimit (http://localhost:5173)
npm run build  # Build për prodhim
npm run preview # Parashikimi i build-it
```

## Hosting online (miku hap linkun dhe e instalon si PWA)

Hostoni në **Vercel** ose **Netlify** (falas); miku hap URL-in në Chrome/Edge dhe klikon **Install** — pa Node.js te laptopi i tij. Hapat e plotë: **[DEPLOY.md](DEPLOY.md)**.

## Veçoritë

- **Paneli** — statistikat, transaksionet e fundit, alarmet e stokut të ulët
- **Produktet** — listë me kërkim, ndryshim/fshirje, theksim stok i ulët
- **Shto/Ndrysho produkt** — formular i plotë
- **Hyrje stoku** — regjistrimi i hyrjeve (rrit inventarin)
- **Dalje stoku** — regjistrimi i shitjeve (zvogëlon, parandalon shitjen mbi stok)
- **Historiku** — filtra (lloji, data), eksport Excel dhe PDF
- **Raportet** — raport mujor/vjetor me shkarkim PDF

## PWA

- `manifest.json` — emri "Menaxhimi i Inventarit", theme blu
- `service-worker.js` — service worker për cache dhe punë offline
- Instalues si aplikacion desktop nga shfletuesi
- Ikona blu në `public/icon.svg` (për ikona 192×192 / 512×512 mund të shtoni PNG në `public/` dhe t’i referoni në manifest)

## Baza e të dhënave (Dexie)

- **products**: id, name, unit, currentStock, minStock, price, timestamps
- **transactions**: id, productId, productName, type (IN/OUT), quantity, pricePerUnit, totalValue, note, date
- Stoku përditësohet automatikisht me transaksionet.
