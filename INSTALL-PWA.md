# Si ta instaloni si PWA në laptop

Aplikacioni duhet të hapet **nga një adresë web** (http ose https), jo duke klikuar direkt një skedar. Këtu janë hapat.

---

## Në laptopin ku do të instalohet

### 1. Instaloni Node.js (nëse nuk e keni)

- Shkarkoni nga: https://nodejs.org (versioni LTS).
- Instaloni duke mbajtur të gjitha opsionet e parazgjedhura.
- Mbyllni dhe rihapni terminalin/Command Prompt pas instalimit.

### 2. Vendosni projektin në laptop

- Kopjoni të gjithë dosjen e projektit (InventoryAgro) në laptop, **ose**
- Nëse përdorni Git: `git clone <url-i-i-repos>`

### 3. Hapni terminalin në dosjen e projektit

- **Windows:** Hapni Command Prompt ose PowerShell, pastaj:  
  `cd rruga\tek\InventoryAgro`  
  (mund të tërhiqni dosjen e projektit mbi dritaren e terminalit për të marrë rrugën).
- **Mac/Linux:** Hapni Terminal, pastaj:  
  `cd /rruga/tek/InventoryAgro`

### 4. Instaloni varësitë dhe nisni aplikacionin

Në të njëjtin terminal:

```bash
npm install
npm start
```

- `npm start` bën build dhe nis një server lokal.
- Kur të mbarojë, do të shkruhet diçka si:  
  **Local: http://localhost:4173**

### 5. Hapni aplikacionin në shfletues

- Hapni **Chrome** ose **Edge**.
- Shkruani në adresë: **http://localhost:4173** dhe shtypni Enter.
- Duhet të shikoni “Menaxhimi i Inventarit”.

### 6. Instaloni si PWA (aplikacion në desktop)

- **Chrome:** Në shiritin e adresës, në të djathtë, klikoni ikonën **⊕** ose “Install Menaxhimi i Inventarit” / “Install app” → **Install**.
- **Edge:** Menu (•••) → **Apps** → **Install this site as an app** → **Install**.

Pas instalimit, aplikacioni hapet në dritaren e vet dhe mund të fiksohet në taskbar ose në menynë Start si çdo program tjetër.

---

## Për ta përdorur çdo herë

- **Pa PWA:** Çdo herë hapni terminalin, shkoni në dosjen e projektit dhe ekzekutoni `npm start`, pastaj hapni http://localhost:4173 në shfletues.
- **Me PWA:** Pas instalimit të PWA, hapni “Menaxhimi i Inventarit” nga desktop/Start. **Terminali duhet të jetë duke u ekzekutuar** (`npm start`) ndërsa përdorni aplikacionin—ndërprehet serveri nëse mbyllni terminalin.

---

## Shënim

- PWA instalon aplikacionin në shfletues; **serveri lokal** (`npm start`) duhet të jetë i ndezur në atë laptop që të funksionojë.
- Për përdorim pa terminal (p.sh. vetëm një klik), aplikacioni duhet të jetë të hostuar në internet (një server me HTTPS).
