# Choyxona POS — Elektron buyurtma va hisob-kitob tizimi

Choyxona va milliy taomlar oshxonalari uchun maxsus ishlab chiqilgan zamonaviy, tez va qulay frontend POS tizimi.

---

## 📌 Asosiy muammo va yechim

- **Muammo:** Xodimlar buyurtmalarni qog‘ozga yozadi yoki og‘zaki eslab qoladi. Mijoz ketayotganda kassir nima yeyilganini qayta surishtirib, hisoblashda vaqt yo‘qotadi va xatoliklar yuz beradi.
- **Yechim:** Xodim mijozning xonasiga (masalan: `2-xona`) tegishli taom va ichimliklarni tizimga o‘z vaqtida kiritib boradi. Mijoz ketayotganida kassir xonani ochadi va barcha buyurtmalar hamda yakuniy to‘lov summasini tayyor ko‘radi, to‘lovni qabul qilib hisobni yopadi.

---

## 🛠 Texnologiyalar

- **React 19** + **Vite** — zamonaviy va chaqqon frontend asosi.
- **Tailwind CSS** — toza, minimal va professional emerald/yashil dizayn.
- **React Router DOM v7** — sahifalararo marshrutlash va xona parametrlari.
- **Lucide React** — sifatli va tushunarli ikonlar.
- **Zustand** — yengil va reaktiv global holat boshqaruvi.
- **Sonner** — zamonaviy toast bildirishnomalar.
- **localStorage** — sahifa yangilanganda ham ma’lumotlarni xotirada saqlash.

---

## 🔑 Demo hisob ma’lumotlari

- **Login:** `admin`
- **Parol:** `123456`
- *(Login sahifasida bir marta bosish orqali to‘ldirish tugmasi ham mavjud)*

---

## 🚀 Tizim modullari va imkoniyatlari

### 1. Asosiy Dashboard
- 4 ta asosiy statistik karta: **Jami xonalar**, **Band xonalar**, **Ochiq hisoblar** va **Bugungi tushum**.
- Hozir band bo‘lgan xonalar ro‘yxati va joriy summasi.
- Oxirgi yopilgan buyurtmalar tarixi.
- Naqd va karta orqali tushumlar hamda o‘rtacha chek ko‘rsatkichi.

### 2. Xonalar moduli (Asosiy modul)
- 8 ta xona (`1-xona` dan `8-xona` gacha).
- Holat ko‘rsatkichi: **Bo‘sh** (yashil) yoki **Band** (sariq).
- Mahsulotlar soni, oxirgi buyurtma berilgan vaqt va joriy summa.
- Filtrlash: *Barchasi*, *Bo‘sh*, *Band*.
- Qidiruv tizimi.

### 3. Xona buyurtmalari sahifasi
- **Chap qism — Mahsulotlar:**
  - Kategoriyalar: *Shashlik, Taomlar, Non, Ichimliklar, Choy, Boshqa*.
  - Tezkor qidiruv.
  - Mahsulot bosilganda miqdori oshadi.
- **O‘ng qism — Joriy buyurtma:**
  - Mahsulot nomi, narxi, miqdorni oshirish/kamaytirish (`+` / `-`).
  - Nolga tushganda yoki savatcha tugmasi bosilganda avtomatik o‘chirish.
  - Chegirma (so‘mda) qo‘llash imkoniyati.
  - Buyurtmani saqlash va vaqt tamg‘asi.
  - Keyinroq yangi taomlar qo‘shilganda eski buyurtmalar saqlanib qoladi.

### 4. Kassir hisob-kitob va to‘lov
- Barcha mahsulotlar va summalarni to‘liq ko‘rish.
- **Hisobni yopish** modal oynasi.
- To‘lov turi: **Naqd pul** yoki **Karta / Terminal**.
- Naqd to‘lovda berilgan summa va qaytimni avtomatik hisoblash.
- Takroriy bosish orqali ikki marta to‘lov hisoblanishining oldi olingan (Double-charge protection).
- Muvaffaqiyatli to‘lovdan keyin **Chekni ko‘rish va chop etish (Print)**.

### 5. Menyu boshqaruvi
- Yangi taom yoki ichimlik qo‘shish.
- Tahrirlash va o‘chirish.
- Kategoriya va narxni boshqarish.
- Mahsulot mavjudligini o‘zgartirish (Mavjud / Tugagan).
- Boshlang‘ich demo taomlar ro‘yxati mavjud.

### 6. Hisobotlar va Tahlil
- Umumiy tushum va yopilgan hisoblar soni.
- To‘lov turlari bo‘yicha ulushlar (Naqd vs Karta).
- Eng ko‘p sotilgan TOP-5 mahsulotlar reytingi.
- Xonalar bo‘yicha to‘liq cheklar arxivi, qidiruv va filtrlar.

### 7. Sozlamalar
- Choyxona nomi, manzili, telefon raqami.
- Chek sarlavhasi va osti yozuvini moslashtirish.
- Istalgan vaqtda demo ma’lumotlarni dastlabki holatga qaytarish (**Reset Demo Data**).

---

## 📂 Loyiha tuzilishi

```text
src/
├── components/
│   ├── layout/        # Sidebar, Header, Asosiy Layout
│   └── ui/            # Button, Card, Badge, Input, Select, Modal, StatCard, EmptyState
├── features/
│   ├── rooms/         # RoomCard
│   ├── orders/        # PaymentModal, ReceiptModal
│   └── menu/          # MenuItemModal
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── RoomsPage.jsx
│   ├── RoomOrderPage.jsx
│   ├── MenuPage.jsx
│   ├── ReportsPage.jsx
│   └── SettingsPage.jsx
├── store/
│   ├── useAuthStore.js # Autentifikatsiya holati
│   └── usePOSStore.js  # Xonalar, menyu, buyurtmalar, to‘lovlar
├── services/
│   └── storageService.js # LocalStorage bilan integratsiya
├── utils/
│   └── formatters.js   # Valyuta (so'm) va sana formatlash
└── data/
    └── initialData.js  # 8 ta xona va dastlabki menyu
```

---

## 💻 Loyihani ishga tushirish

1. Bog‘liqliklarni o‘rnatish:
   ```bash
   npm install
   ```

2. Loyihani ishlab chiqish rejimida ishga tushirish:
   ```bash
   npm run dev
   ```

3. Production uchun build qilish:
   ```bash
   npm run build
   ```

---

## 🔌 Kelgusida Node.js va PostgreSQL backendiga ulash

Loyiha arxitekturasi biznes logikani UI komponentlaridan to‘liq ajratgan holda tuzilgan:
1. `src/services/storageService.js` faylidagi funksiyalarni `fetch` yoki `axios` orqali Node.js REST API / GraphQL so‘rovlariga o‘zgartirish kifoya.
2. `src/store/usePOSStore.js` tayyor holatda bo‘lib, frontend va backend sinxronizatsiyasi oson kechadi.
