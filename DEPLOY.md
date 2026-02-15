# Si ta hostoni online — miku hap linkun dhe e instalon si PWA

Hostoni aplikacionin në internet; miku thjesht hap linkun në Chrome/Edge dhe klikon **Install** (si PWA). Nuk nevojitet Node.js te laptopi i tij/ të saj.

---

## Opsioni 1: Vercel (falas, shumë i thjeshtë)

1. **Bëni llogari** në https://vercel.com (mund me GitHub).

2. **Ngarkoni projektin:**
   - Ose shtoni repon në GitHub, pastaj në Vercel klikoni **Add New** → **Project** dhe zgjidhni repon; Vercel e sheh automatikisht Vite dhe e build-on.
   - Ose: në projekt ekzekutoni `npm run build`, pastaj në Vercel **Add New** → **Project** → **Import** dhe tërhiqni dosjen **dist** (ose zgjidhni "deploy from local" dhe zgjidhni `dist`).

3. Pas deploy-it merrni një URL, p.sh. `https://inventoryagro.vercel.app`.

4. **Miku:** Hap këtë URL në Chrome ose Edge → klikon ikonën **Install** / "Install Menaxhimi i Inventarit" → aplikacioni instalohet si PWA në laptop.

---

## Opsioni 2: Netlify (falas)

1. **Llogari** në https://netlify.com.

2. **Deploy:**
   - Opsioni A: Shtoni kodin në GitHub, pastaj në Netlify **Add new site** → **Import from Git** → zgjidhni repon. Netlify e build-on me `npm run build` dhe përdor `dist` (konfigurimi është në `netlify.toml`).
   - Opsioni B: Ekzekutoni `npm run build`, pastaj në Netlify **Sites** → **Add new site** → **Deploy manually** dhe tërhiqni dosjen **dist**.

3. Merrni URL, p.sh. `https://something.netlify.app`.

4. **Miku:** Hap URL-in → Install si PWA (njësoj si më sipër).

---

## Opsioni 3: GitHub Pages (falas)

1. Projekti në GitHub. Në repo: **Settings** → **Pages** → **Source**: "GitHub Actions" (ose zgjidhni "Deploy from a branch" dhe branch `gh-pages` me `dist`).

2. Për "GitHub Actions": shtoni workflow që bën `npm run build` dhe push-on `dist` në `gh-pages`. URL bëhet `https://username.github.io/repo-name/`.

3. **Shënim:** Në Vite duhet të vendosni `base: '/repo-name/'` në `vite.config.js` që asset-et të ngarkohen. Pastaj miku hap këtë URL dhe instalon PWA.

---

## Përmbledhje

| Ku hostoni | Si e bën miku |
|------------|-----------------|
| Vercel / Netlify / çdo URL https | Hap linkun → Chrome/Edge → Install (⊕ ose "Install app") → PWA e instaluar në laptop |

Të dhënat (produktet, transaksionet) mbahen **vetëm në shfletuesin e mikut** (IndexedDB), jo në server. Çdo përdorues ka inventarin e vet lokal.
