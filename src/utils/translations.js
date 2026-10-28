/**
 * Uzbek Latin & Cyrillic Translation and Transliteration System
 */

// Full Dictionary of static UI keys
export const DICTIONARY = {
  // App brand & navigation
  'app.name': { latn: 'Choyxona POS', cyrl: 'Чойхона POS' },
  'app.tagline': { latn: 'Elektron buyurtma va hisob-kitob', cyrl: 'Электрон буюртма ва ҳисоб-китоб' },
  'nav.dashboard': { latn: 'Dashboard', cyrl: 'Дашборд' },
  'nav.places': { latn: 'Xona va Stollar', cyrl: 'Хона ва Столлар' },
  'nav.menu': { latn: 'Menyu', cyrl: 'Меню' },
  'nav.reports': { latn: 'Hisobotlar', cyrl: 'Ҳисоботлар' },
  'nav.settings': { latn: 'Sozlamalar', cyrl: 'Созламалар' },
  'nav.logout': { latn: 'Tizimdan chiqish', cyrl: 'Тизимдан чиқиш' },
  'nav.active_band': { latn: 'band', cyrl: 'банд' },

  // Currency & units
  'currency.som': { latn: 'so‘m', cyrl: 'сўм' },
  'unit.people': { latn: 'kishi', cyrl: 'киши' },
  'unit.items': { latn: 'ta', cyrl: 'та' },
  'unit.portion': { latn: 'dona', cyrl: 'дона' },

  // Time & relative
  'time.just_now': { latn: 'Hozirgina', cyrl: 'Ҳозиргина' },
  'time.mins_ago': { latn: 'daqiqa oldin', cyrl: 'дақиқа олдин' },
  'time.hours_ago': { latn: 'soat oldin', cyrl: 'соат олдин' },
  'time.days_ago': { latn: 'kun oldin', cyrl: 'кун олдин' },

  // Login / PIN
  'login.title': { latn: 'Choyxona POS', cyrl: 'Чойхона POS' },
  'login.subtitle': { latn: '4 xonali PIN-kod orqali tizimga kiring', cyrl: '4 хонали PIN-код орқали тизимга киринг' },
  'login.enter_pin': { latn: 'PIN-kodni tering', cyrl: 'PIN-кодни теринг' },
  'login.verifying': { latn: 'Tekshirilmoqda...', cyrl: 'Текширилмоқда...' },
  'login.clear': { latn: 'Tozalash', cyrl: 'Тозалаш' },
  'login.delete': { latn: 'O‘chirish', cyrl: 'Ўчириш' },
  'login.quick_demo': { latn: 'Demo PIN:', cyrl: 'Демо PIN:' },
  'login.fill': { latn: '(Kiritish)', cyrl: '(Киритиш)' },
  'login.secure': { latn: 'Kassir / Xodim PIN-kod orqali himoyalangan', cyrl: 'Кассир / Ходим PIN-код орқали ҳимояланган' },

  // Header
  'header.quick_order': { latn: 'Yangi buyurtma', cyrl: 'Янги буюртма' },
  'header.reset_tooltip': { latn: 'Demo ma’lumotlarni qayta tiklash', cyrl: 'Демо маълумотларни қайта тиклаш' },
  'header.band_count': { latn: 'ta band', cyrl: 'та банд' },

  // Dashboard
  'dashboard.welcome': { latn: 'Xush kelibsiz, Kassir!', cyrl: 'Хуш келибсиз, Кассир!' },
  'dashboard.active_status': { latn: 'Tizim faol ishlamoqda', cyrl: 'Тизим фаол ишламоқда' },
  'dashboard.desc': {
    latn: 'Choyxona buyurtmalarini boshqarish va to‘lovlarni qabul qilish paneli.',
    cyrl: 'Чойхона буюртмаларини бошқариш ва тўловларни қабул қилиш панели.',
  },
  'dashboard.view_places': { latn: 'Joylar ro‘yxati', cyrl: 'Жойлар рўйхати' },
  'dashboard.manage_menu': { latn: 'Menyuni boshqarish', cyrl: 'Менюни бошқариш' },
  'dashboard.stat_total': { latn: 'Jami joylar', cyrl: 'Жами жойлар' },
  'dashboard.stat_occupied': { latn: 'Band joylar', cyrl: 'Банд жойлар' },
  'dashboard.stat_active_bills': { latn: 'Ochiq hisoblar', cyrl: 'Очиқ ҳисоблар' },
  'dashboard.stat_revenue': { latn: 'Bugungi tushum', cyrl: 'Бугунги тушум' },
  'dashboard.occupied_title': { latn: 'Hozir band bo‘lgan joylar', cyrl: 'Ҳозир банд бўлган жойлар' },
  'dashboard.occupied_desc': {
    latn: 'Mijozlar ovqatlanayotgan xonalar, stollar va so‘rilar',
    cyrl: 'Мижозлар овқатланаётган хоналар, столлар ва сўрилар',
  },
  'dashboard.recent_orders': { latn: 'Oxirgi buyurtmalar', cyrl: 'Охирги буюртмалар' },
  'dashboard.recent_desc': { latn: 'Muvaffaqiyatli yopilgan hisoblar', cyrl: 'Муваффақиятли ёпилган ҳисоблар' },
  'dashboard.summary_title': { latn: 'Bugungi faoliyat qisqacha', cyrl: 'Бугунги фаолият қисқача' },
  'dashboard.summary_desc': { latn: 'To‘lov turlari va asosiy ko‘rsatkichlar', cyrl: 'Тўлов турлари ва асосий кўрсаткичлар' },
  'dashboard.cash_revenue': { latn: 'Naqd tushum', cyrl: 'Нақд тушум' },
  'dashboard.card_revenue': { latn: 'Karta / Terminal', cyrl: 'Карта / Терминал' },
  'dashboard.avg_check': { latn: 'O‘rtacha chek', cyrl: 'Ўртача чек' },
  'dashboard.all': { latn: 'Barchasi', cyrl: 'Барчаси' },
  'dashboard.history': { latn: 'Tarix', cyrl: 'Тарих' },
  'dashboard.empty_occupied': { latn: 'Hozirda band joy yo‘q', cyrl: 'Ҳозирда банд жой йўқ' },
  'dashboard.empty_occupied_desc': {
    latn: 'Barcha xona, stol va so‘rilar bo‘sh. Yangi buyurtma boshlash uchun tanlang.',
    cyrl: 'Барча хона, стол ва сўрилар бўш. Янги буюртма бошлаш учун танланг.',
  },

  // Places / Rooms Page
  'places.title': { latn: 'Xonalar, Stollar va So‘rilar', cyrl: 'Хоналар, Столлар ва Сўрилар' },
  'places.add_new': { latn: 'Yangi joy qo‘shish', cyrl: 'Янги жой қўшиш' },
  'places.search_placeholder': { latn: 'Qidirish (stol, so‘ri, xona)...', cyrl: 'Қидириш (стол, сўри, хона)...' },
  'places.all': { latn: 'Barchasi', cyrl: 'Барчаси' },
  'places.rooms': { latn: 'Xonalar', cyrl: 'Хоналар' },
  'places.tables': { latn: 'Stollar', cyrl: 'Столлар' },
  'places.soris': { latn: 'So‘rilar', cyrl: 'Сўрилар' },
  'places.status': { latn: 'Holat:', cyrl: 'Ҳолат:' },
  'places.bosh': { latn: 'Bo‘sh', cyrl: 'Бўш' },
  'places.band': { latn: 'Band', cyrl: 'Банд' },
  'places.open_order': { latn: 'Buyurtmani ochish', cyrl: 'Буюртмани очиш' },
  'places.start_order': { latn: 'Buyurtma boshlash', cyrl: 'Буюртма бошлаш' },
  'places.current_bill': { latn: 'Joriy hisob:', cyrl: 'Жорий ҳисоб:' },
  'places.items_count': { latn: 'Mahsulotlar:', cyrl: 'Маҳсулотлар:' },
  'places.time': { latn: 'Vaqti:', cyrl: 'Вақти:' },
  'places.empty_text': { latn: 'Hozirda bo‘sh', cyrl: 'Ҳозирда бўш' },
  'places.empty_hint': { latn: 'Buyurtma kiritish uchun bosing', cyrl: 'Буюртма киритиш учун босинг' },
  'places.not_found': { latn: 'Hech qanday joy topilmadi', cyrl: 'Ҳеч қандай жой топилмади' },

  // Place Modal
  'place_modal.add_title': { latn: 'Yangi joy qo‘shish', cyrl: 'Янги жой қўшиш' },
  'place_modal.edit_title': { latn: 'Joy ma’lumotlarini tahrirlash', cyrl: 'Жой маълумотларини таҳрирлаш' },
  'place_modal.subtitle': {
    latn: 'Oshxona kengayganda yangi xona, stol yoki so‘ri qo‘shing',
    cyrl: 'Ошхона кенгайганда янги хона, стол ёки сўри қўшинг',
  },
  'place_modal.type_label': { latn: 'Joy turi', cyrl: 'Жой тури' },
  'place_modal.type_xona': { latn: 'Xona', cyrl: 'Хона' },
  'place_modal.type_xona_sub': { latn: 'Alohida kabina', cyrl: 'Алоҳида кабина' },
  'place_modal.type_stol': { latn: 'Stol', cyrl: 'Стол' },
  'place_modal.type_stol_sub': { latn: 'Zaldagi stol', cyrl: 'Залдаги стол' },
  'place_modal.type_sori': { latn: 'So‘ri', cyrl: 'Сўри' },
  'place_modal.type_sori_sub': { latn: 'Tapchan / Chorpoya', cyrl: 'Тапчан / Чорпоя' },
  'place_modal.name_label': { latn: 'Nomi yoki raqami', cyrl: 'Номи ёки рақами' },
  'place_modal.capacity_label': { latn: 'Sig‘imi', cyrl: 'Сиғими' },

  // Order Page
  'order.back_to_places': { latn: 'Joylar', cyrl: 'Жойлар' },
  'order.search_dish': {
    latn: 'Mahsulot nomi yoki toifasi bo‘yicha qidirish...',
    cyrl: 'Маҳсулот номи ёки тоифаси бўйича қидириш...',
  },
  'order.current_order': { latn: 'Joriy buyurtma', cyrl: 'Жорий буюртма' },
  'order.menu_tab': { latn: 'Taomlar menyusi', cyrl: 'Таомлар менюси' },
  'order.cart_tab': { latn: 'Buyurtma', cyrl: 'Буюртма' },
  'order.subtotal': { latn: 'Mahsulotlar jami:', cyrl: 'Маҳсулотлар жами:' },
  'order.discount': { latn: 'Chegirma:', cyrl: 'Чегирма:' },
  'order.add_discount': { latn: '+ Qo‘shish', cyrl: '+ Қўшиш' },
  'order.change_discount': { latn: 'O‘zgartirish', cyrl: 'Ўзгартириш' },
  'order.apply': { latn: 'Qo‘llash', cyrl: 'Қўллаш' },
  'order.final_total': { latn: 'Yakuniy summa:', cyrl: 'Якуний сумма:' },
  'order.save_order': { latn: 'Buyurtmani saqlash', cyrl: 'Буюртмани сақлаш' },
  'order.close_bill': { latn: 'Hisobni yopish', cyrl: 'Ҳисобни ёпиш' },
  'order.empty_cart': { latn: 'Buyurtma bo‘sh', cyrl: 'Буюртма бўш' },
  'order.empty_cart_desc': {
    latn: 'Chap tarafdagi menyudan mahsulotlarni tanlab qo‘shing.',
    cyrl: 'Чап тарафдаги менюдан маҳсулотларни танлаб қўшинг.',
  },
  'order.out_of_stock': { latn: 'Tugagan', cyrl: 'Тугаган' },
  'order.started': { latn: 'Boshlangan:', cyrl: 'Бошланган:' },

  // Payment Modal
  'payment.modal_title': { latn: 'Hisobni yopish va To‘lov', cyrl: 'Ҳисобни ёпиш ва Тўлов' },
  'payment.modal_sub': {
    latn: 'To‘lov turini tanlang va yakuniy summani tasdiqlang',
    cyrl: 'Тўлов турини танланг ва якуний суммани тасдиқланг',
  },
  'payment.total_to_pay': { latn: 'To‘lanadigan yakuniy summa', cyrl: 'Тўланадиган якуний сумма' },
  'payment.method': { latn: 'To‘lov usuli', cyrl: 'Тўлов усули' },
  'payment.cash': { latn: 'Naqd pul', cyrl: 'Нақд пул' },
  'payment.card': { latn: 'Karta / Humo / Uzcard', cyrl: 'Карта / Humo / Uzcard' },
  'payment.cash_given': { latn: 'Mijoz bergan summa (so‘m)', cyrl: 'Мижоз берган сумма (сўм)' },
  'payment.change': { latn: 'Qaytim:', cyrl: 'Қайтим:' },
  'payment.confirm': { latn: 'To‘lovni tasdiqlash', cyrl: 'Тўловни тасдиқлаш' },
  'payment.cancel': { latn: 'Bekor qilish', cyrl: 'Бекор қилиш' },

  // Receipt Modal
  'receipt.title': { latn: 'Chek ma’lumotlari', cyrl: 'Чек маълумотлари' },
  'receipt.sub': { latn: 'Hisob muvaffaqiyatli yopildi', cyrl: 'Ҳисоб муваффақиятли ёпилди' },
  'receipt.room': { latn: 'Joy / Xona:', cyrl: 'Жой / Хона:' },
  'receipt.number': { latn: 'Chek raqami:', cyrl: 'Чек рақами:' },
  'receipt.datetime': { latn: 'Sana va vaqt:', cyrl: 'Сана ва вақт:' },
  'receipt.cashier': { latn: 'Kassir:', cyrl: 'Кассир:' },
  'receipt.payment_type': { latn: 'To‘lov turi:', cyrl: 'Тўлов тури:' },
  'receipt.product': { latn: 'Mahsulot', cyrl: 'Маҳсулот' },
  'receipt.total': { latn: 'Jami', cyrl: 'Жами' },
  'receipt.print': { latn: 'Chekni chop etish', cyrl: 'Чекни чоп этиш' },
  'receipt.close': { latn: 'Yopish', cyrl: 'Ёпиш' },

  // Menu Page
  'menu.title': { latn: 'Menyu boshqaruvi', cyrl: 'Меню бошқаруви' },
  'menu.add_new': { latn: 'Yangi mahsulot qo‘shish', cyrl: 'Янги маҳсулот қўшиш' },
  'menu.col_name': { latn: 'Mahsulot nomi', cyrl: 'Маҳсулот номи' },
  'menu.col_category': { latn: 'Kategoriya', cyrl: 'Категория' },
  'menu.col_price': { latn: 'Narxi', cyrl: 'Нархи' },
  'menu.col_status': { latn: 'Holati', cyrl: 'Ҳолати' },
  'menu.col_actions': { latn: 'Amallar', cyrl: 'Амаллар' },
  'menu.available': { latn: 'Mavjud', cyrl: 'Мавжуд' },
  'menu.unavailable': { latn: 'Tugagan', cyrl: 'Тугаган' },
  'menu.edit': { latn: 'Tahrirlash', cyrl: 'Таҳрирлаш' },
  'menu.delete': { latn: 'O‘chirish', cyrl: 'Ўчириш' },

  // Reports Page
  'reports.title': { latn: 'Hisobotlar va Tahlil', cyrl: 'Ҳисоботлар ва Таҳлил' },
  'reports.total_rev': { latn: 'Jami tushum', cyrl: 'Жами тушум' },
  'reports.closed_bills': { latn: 'Yopilgan hisoblar', cyrl: 'Ёпилган ҳисоблар' },
  'reports.cash_payments': { latn: 'Naqd to‘lovlar', cyrl: 'Нақд тўловлар' },
  'reports.card_payments': { latn: 'Karta to‘lovlari', cyrl: 'Карта тўловлари' },
  'reports.top_dishes': { latn: 'Eng ko‘p sotilgan mahsulotlar', cyrl: 'Энг кўп сотилган маҳсулотлар' },
  'reports.top_dishes_sub': { latn: 'Buyurtmalar soni bo‘yicha TOP taomlar', cyrl: 'Буюртмалар сони бўйича ТОП таомлар' },
  'reports.payment_split': { latn: 'To‘lov turlari taqsimoti', cyrl: 'Тўлов турлари тақсимоти' },
  'reports.history_title': { latn: 'Xonalar bo‘yicha to‘lovlar tarixi', cyrl: 'Хоналар бўйича тўловлар тарихи' },
  'reports.history_sub': { latn: 'Yopilgan barcha hisoblar va cheklar arxivi', cyrl: 'Ёпилган барча ҳисоблар ва чеклар архиви' },
  'reports.search_history': { latn: 'Qidiruv (xona yoki taom)...', cyrl: 'Қидириш (хона ёки таом)...' },
  'reports.all_rooms': { latn: 'Barcha joylar', cyrl: 'Барча жойлар' },
  'reports.all_payments': { latn: 'Barcha to‘lovlar', cyrl: 'Барча тўловлар' },
  'reports.col_date': { latn: 'Sana va vaqt', cyrl: 'Сана ва вақт' },
  'reports.col_room': { latn: 'Xona / Joy', cyrl: 'Хона / Жой' },
  'reports.col_items': { latn: 'Buyurtma tarkibi', cyrl: 'Буюртма таркиби' },
  'reports.col_pay_type': { latn: 'To‘lov turi', cyrl: 'Тўлов тури' },
  'reports.col_final': { latn: 'Yakuniy summa', cyrl: 'Якуний сумма' },
  'reports.col_receipt': { latn: 'Chek', cyrl: 'Чек' },
  'reports.view': { latn: 'Ko‘rish', cyrl: 'Кўриш' },

  // Settings
  'settings.title': { latn: 'Tizim sozlamalari', cyrl: 'Тизим созламалари' },
  'settings.sub': {
    latn: 'Choyxona ma’lumotlari, kirish PIN-kodi va chek parametrlarini sozlash',
    cyrl: 'Чойхона маълумотлари, кириш PIN-коди ва чек параметрларини созлаш',
  },
  'settings.theme_title': { latn: 'Tizim mavzusi va tili', cyrl: 'Тизим мавзуси ва тили' },
  'settings.light_mode': { latn: 'Kunduzgi rejim (Light)', cyrl: 'Кундузги режим (Light)' },
  'settings.dark_mode': { latn: 'Tungi rejim (Dark)', cyrl: 'Тунги режим (Dark)' },
  'settings.lang_lotin': { latn: 'O‘zbekcha (Lotin)', cyrl: 'Ўзбекча (Лотин)' },
  'settings.lang_cyrl': { latn: 'Ўзбекча (Кирилл)', cyrl: 'Ўзбекча (Кирилл)' },
  'settings.save': { latn: 'Sozlamalarni saqlash', cyrl: 'Созламаларни сақлаш' },
  'settings.reset': { latn: 'Dastlabki demo ma’lumotlarga qaytarish', cyrl: 'Дастлабки демо маълумотларга қайтариш' },

  // Categories
  'cat.all': { latn: 'Barchasi', cyrl: 'Барчаси' },
  'cat.shashlik': { latn: 'Shashlik', cyrl: 'Шашлик' },
  'cat.taomlar': { latn: 'Taomlar', cyrl: 'Таомлар' },
  'cat.non': { latn: 'Non', cyrl: 'Нон' },
  'cat.ichimliklar': { latn: 'Ichimliklar', cyrl: 'Ичимликлар' },
  'cat.choy': { latn: 'Choy', cyrl: 'Чой' },
  'cat.boshqa': { latn: 'Boshqa', cyrl: 'Бошқа' },

  // Actions
  'btn.save': { latn: 'Saqlash', cyrl: 'Сақлаш' },
  'btn.cancel': { latn: 'Bekor qilish', cyrl: 'Бекор қилиш' },
  'btn.add': { latn: 'Qo‘shish', cyrl: 'Қўшиш' },
  'btn.delete': { latn: 'O‘chirish', cyrl: 'Ўчириш' },
  'btn.edit': { latn: 'Tahrirlash', cyrl: 'Таҳрирлаш' },

  // Transfer Place (Joyni ko'chirish)
  'transfer.btn': { latn: 'Joyni ko‘chirish', cyrl: 'Жойни кўчириш' },
  'transfer.title': { latn: 'Joyni ko‘chirish (Stol / Xona almashtirish)', cyrl: 'Жойни кўчириш (Стол / Хона алмаштириш)' },
  'transfer.sub': {
    latn: 'Joriy buyurtmani boshqa bo‘sh xona, stol yoki so‘riga o‘tkazish',
    cyrl: 'Жорий буюртмани бошқа бўш хона, стол ёки сўрига ўтказиш',
  },
  'transfer.current': { latn: 'Hozirgi joy', cyrl: 'Ҳозирги жой' },
  'transfer.target': { latn: 'Ko‘chiriladigan joyni tanlang', cyrl: 'Кўчириладиган жойни танланг' },
  'transfer.confirm': { latn: 'Ko‘chirishni tasdiqlash', cyrl: 'Кўчиришни тасдиқлаш' },
  'transfer.no_empty': { latn: 'Barcha joylar band, bo‘sh joy topilmadi!', cyrl: 'Барча жойлар банд, бўш жой топилмади!' },
  'transfer.success': { latn: 'Buyurtma muvaffaqiyatli ko‘chirildi!', cyrl: 'Буюртма муваффақиятли кўчирилди!' },

  // Pre-check
  'precheck.btn': { latn: 'Pre-chek (Hisob)', cyrl: 'Пре-чек (Ҳисоб)' },
  'precheck.title': { latn: 'Oraliq hisob varaqasi (Pre-chek)', cyrl: 'Оралиқ ҳисоб варақаси (Пре-чек)' },
  'precheck.sub': { latn: 'To‘lovdan oldingi hisob-kitob varaqasi', cyrl: 'Тўловдан олдинги ҳисоб-китоб варақаси' },
  'precheck.banner': { latn: '*** ORALIQ HISOB VARAQASI (PRE-CHEK) ***', cyrl: '*** ОРАЛИҚ ҲИСОБ ВАРАҚАСИ (ПРЕ-ЧЕК) ***' },
  'precheck.note': {
    latn: 'Diqqat: Ushbu chek to‘lov hujjati emas, mijoz bilan oraliq hisob-kitob qilish uchundir.',
    cyrl: 'Диққат: Ушбу чек тўлов ҳужжати эмас, мижоз билан оралиқ ҳисоб-китоб қилиш учундир.',
  },

  // Payment Cash & Change
  'payment.received_amount': { latn: 'Mijoz bergan summa', cyrl: 'Мижоз берган сумма' },
  'payment.change_amount': { latn: 'Qaytim (Сдача)', cyrl: 'Қайтим (Сдача)' },
  'payment.exact_amount': { latn: 'Aniq summa', cyrl: 'Аниқ сумма' },
  'payment.short_by': { latn: 'Yetmayapti:', cyrl: 'Етмаяпти:' },
  'payment.quick_bills': { latn: 'Tezkor naqd kupyuralar:', cyrl: 'Тезкор нақд купюралар:' },
  'receipt.given': { latn: 'Mijoz berdi:', cyrl: 'Мижоз берди:' },
  'receipt.change': { latn: 'Qaytim:', cyrl: 'Қайтим:' },
};

/**
 * Universal Latin to Cyrillic transliterator for Uzbek language
 */
export function toCyrillic(text) {
  if (!text || typeof text !== 'string') return text;

  const replaceMap = [
    // Two-character combinations
    { l: /sh/gi, c: 'ш' },
    { l: /ch/gi, c: 'ч' },
    { l: /yo/gi, c: 'ё' },
    { l: /yu/gi, c: 'ю' },
    { l: /ya/gi, c: 'я' },
    { l: /ye/gi, c: 'е' },
    { l: /o‘|o'|o`|ö/gi, c: 'ў' },
    { l: /g‘|g'|g`|ğ/gi, c: 'ғ' },

    // Single characters
    { l: /a/gi, c: 'а' },
    { l: /b/gi, c: 'б' },
    { l: /d/gi, c: 'д' },
    { l: /e/gi, c: 'е' },
    { l: /f/gi, c: 'ф' },
    { l: /g/gi, c: 'г' },
    { l: /h/gi, c: 'ҳ' },
    { l: /i/gi, c: 'и' },
    { l: /j/gi, c: 'ж' },
    { l: /k/gi, c: 'к' },
    { l: /l/gi, c: 'л' },
    { l: /m/gi, c: 'м' },
    { l: /n/gi, c: 'н' },
    { l: /o/gi, c: 'о' },
    { l: /p/gi, c: 'п' },
    { l: /q/gi, c: 'қ' },
    { l: /r/gi, c: 'р' },
    { l: /s/gi, c: 'с' },
    { l: /t/gi, c: 'т' },
    { l: /u/gi, c: 'у' },
    { l: /v/gi, c: 'в' },
    { l: /x/gi, c: 'х' },
    { l: /y/gi, c: 'й' },
    { l: /z/gi, c: 'з' },
    { l: /'/g, c: 'ъ' },
    { l: /’/g, c: 'ъ' },
  ];

  let result = text;

  // Preserve case by matching uppercase
  replaceMap.forEach(({ l, c }) => {
    result = result.replace(l, (match) => {
      if (match === match.toUpperCase()) {
        return c.toUpperCase();
      } else if (match[0] === match[0].toUpperCase()) {
        return c.charAt(0).toUpperCase() + c.slice(1);
      }
      return c;
    });
  });

  return result;
}

/**
 * Universal Cyrillic to Latin transliterator for Uzbek language
 */
export function toLatin(text) {
  if (!text || typeof text !== 'string') return text;

  const cyrlMap = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sh', ъ: '’', ь: '', э: 'e', ю: 'yu', я: 'ya',
    ў: 'o‘', ғ: 'g‘', қ: 'q', ҳ: 'h',
    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo', Ж: 'J',
    З: 'Z', И: 'I', Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O',
    П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'X', Ц: 'Ts',
    Ч: 'Ch', Ш: 'Sh', Щ: 'Sh', Ъ: '’', Ь: '', Э: 'E', Ю: 'Yu', Я: 'Ya',
    Ў: 'O‘', Ғ: 'G‘', Қ: 'Q', Ҳ: 'H',
  };

  return text
    .split('')
    .map((char) => cyrlMap[char] || char)
    .join('');
}
