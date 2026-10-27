/**
 * Initial Demo Data for Choyxona POS
 */

export const INITIAL_ROOMS = [
  // Xonalar (VIP / Alohida kabinalar)
  { id: 'x_1', name: '1-xona', type: 'xona', capacity: '6-8 kishi', status: 'bosh', activeOrderId: null },
  { id: 'x_2', name: '2-xona', type: 'xona', capacity: '8-10 kishi', status: 'band', activeOrderId: 'ord_demo_2' },
  { id: 'x_3', name: '3-xona', type: 'xona', capacity: '4-6 kishi', status: 'bosh', activeOrderId: null },
  { id: 'x_4', name: '4-xona', type: 'xona', capacity: '10-12 kishi', status: 'bosh', activeOrderId: null },

  // Stollar (Zaldagi stollar)
  { id: 's_1', name: '1-stol', type: 'stol', capacity: '4 kishi', status: 'bosh', activeOrderId: null },
  { id: 's_2', name: '2-stol', type: 'stol', capacity: '4 kishi', status: 'band', activeOrderId: 'ord_demo_5' },
  { id: 's_3', name: '3-stol', type: 'stol', capacity: '6 kishi', status: 'bosh', activeOrderId: null },
  { id: 's_4', name: '4-stol', type: 'stol', capacity: '2-4 kishi', status: 'bosh', activeOrderId: null },

  // So'rilar (Tapchanlar / Chorpoyalar)
  { id: 't_1', name: '1-so‘ri', type: 'sori', capacity: '8-10 kishi', status: 'band', activeOrderId: 'ord_demo_7' },
  { id: 't_2', name: '2-so‘ri', type: 'sori', capacity: '6-8 kishi', status: 'bosh', activeOrderId: null },
  { id: 't_3', name: '3-so‘ri', type: 'sori', capacity: '8-10 kishi', status: 'bosh', activeOrderId: null },
  { id: 't_4', name: '4-so‘ri', type: 'sori', capacity: '10-12 kishi', status: 'bosh', activeOrderId: null },
];

export const INITIAL_CATEGORIES = [
  'Barchasi',
  'Shashlik',
  'Taomlar',
  'Non',
  'Ichimliklar',
  'Choy',
  'Boshqa',
];

export const INITIAL_MENU = [
  {
    id: 'm_1',
    name: 'Mol go‘shtli shashlik',
    category: 'Shashlik',
    price: 30000,
    isAvailable: true,
    description: 'Yumshoq mol go‘shti, maxsus ziravorlar bilan',
  },
  {
    id: 'm_2',
    name: 'Qiyma shashlik',
    category: 'Shashlik',
    price: 25000,
    isAvailable: true,
    description: 'Mayin qiyma, dumba yog‘i va piyoz bilan',
  },
  {
    id: 'm_3',
    name: 'Tovuq shashlik',
    category: 'Shashlik',
    price: 22000,
    isAvailable: true,
    description: 'Marinadlangan tovuq filesi',
  },
  {
    id: 'm_4',
    name: 'Non',
    category: 'Non',
    price: 4000,
    isAvailable: true,
    description: 'Issiq tandir non',
  },
  {
    id: 'm_5',
    name: 'Choy',
    category: 'Choy',
    price: 10000,
    isAvailable: true,
    description: 'Qora choy, choynakda',
  },
  {
    id: 'm_6',
    name: 'Ko‘k choy',
    category: 'Choy',
    price: 8000,
    isAvailable: true,
    description: 'Ko‘k choy №95, choynakda',
  },
  {
    id: 'm_7',
    name: 'Suv',
    category: 'Ichimliklar',
    price: 5000,
    isAvailable: true,
    description: 'Gazsiz toza ichimlik suvi 0.5L',
  },
  {
    id: 'm_8',
    name: 'Coca-Cola',
    category: 'Ichimliklar',
    price: 12000,
    isAvailable: true,
    description: 'Salqin Coca-Cola 1.0L',
  },
  {
    id: 'm_9',
    name: 'Salat',
    category: 'Taomlar',
    price: 15000,
    isAvailable: true,
    description: 'Bodring, pomidor, ko‘katlar',
  },
  {
    id: 'm_10',
    name: 'Jiz (Qovurma go‘sht)',
    category: 'Taomlar',
    price: 65000,
    isAvailable: true,
    description: 'Qo‘y go‘shti kartoshka va piyoz bilan',
  },
  {
    id: 'm_11',
    name: 'Tandir somsa',
    category: 'Taomlar',
    price: 14000,
    isAvailable: true,
    description: 'Go‘shtli shirali tandir somsa',
  },
  {
    id: 'm_12',
    name: 'Limonli choy',
    category: 'Choy',
    price: 14000,
    isAvailable: true,
    description: 'Limon va asal qo‘shilgan maxsus choy',
  },
  {
    id: 'm_13',
    name: 'Suzma',
    category: 'Boshqa',
    price: 8000,
    isAvailable: true,
    description: 'Ko‘katli yangi suzma',
  },
];

const now = new Date();
const minutesAgo = (mins) => new Date(now.getTime() - mins * 60000).toISOString();
const hoursAgo = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();

export const INITIAL_ACTIVE_ORDERS = [
  {
    id: 'ord_demo_2',
    roomId: 'x_2',
    roomName: '2-xona',
    status: 'active',
    createdAt: minutesAgo(42),
    updatedAt: minutesAgo(15),
    items: [
      { id: 'item_2_1', menuItemId: 'm_1', name: 'Mol go‘shtli shashlik', price: 30000, quantity: 4, addedAt: minutesAgo(42) },
      { id: 'item_2_2', menuItemId: 'm_2', name: 'Qiyma shashlik', price: 25000, quantity: 2, addedAt: minutesAgo(42) },
      { id: 'item_2_3', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 3, addedAt: minutesAgo(42) },
      { id: 'item_2_4', menuItemId: 'm_5', name: 'Choy', price: 10000, quantity: 2, addedAt: minutesAgo(42) },
      { id: 'item_2_5', menuItemId: 'm_8', name: 'Coca-Cola', price: 12000, quantity: 2, addedAt: minutesAgo(15) },
    ],
    discountAmount: 0,
    subtotal: 226000,
    finalTotal: 226000,
  },
  {
    id: 'ord_demo_5',
    roomId: 's_2',
    roomName: '2-stol',
    status: 'active',
    createdAt: minutesAgo(28),
    updatedAt: minutesAgo(10),
    items: [
      { id: 'item_5_1', menuItemId: 'm_2', name: 'Qiyma shashlik', price: 25000, quantity: 3, addedAt: minutesAgo(28) },
      { id: 'item_5_2', menuItemId: 'm_3', name: 'Tovuq shashlik', price: 22000, quantity: 2, addedAt: minutesAgo(28) },
      { id: 'item_5_3', menuItemId: 'm_9', name: 'Salat', price: 15000, quantity: 1, addedAt: minutesAgo(28) },
      { id: 'item_5_4', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 2, addedAt: minutesAgo(28) },
      { id: 'item_5_5', menuItemId: 'm_6', name: 'Ko‘k choy', price: 8000, quantity: 1, addedAt: minutesAgo(10) },
    ],
    discountAmount: 0,
    subtotal: 150000,
    finalTotal: 150000,
  },
  {
    id: 'ord_demo_7',
    roomId: 't_1',
    roomName: '1-so‘ri',
    status: 'active',
    createdAt: minutesAgo(12),
    updatedAt: minutesAgo(12),
    items: [
      { id: 'item_7_1', menuItemId: 'm_1', name: 'Mol go‘shtli shashlik', price: 30000, quantity: 5, addedAt: minutesAgo(12) },
      { id: 'item_7_2', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 4, addedAt: minutesAgo(12) },
      { id: 'item_7_3', menuItemId: 'm_5', name: 'Choy', price: 10000, quantity: 1, addedAt: minutesAgo(12) },
      { id: 'item_7_4', menuItemId: 'm_7', name: 'Suv', price: 5000, quantity: 2, addedAt: minutesAgo(12) },
    ],
    discountAmount: 0,
    subtotal: 186000,
    finalTotal: 186000,
  },
];

export const INITIAL_CLOSED_ORDERS = [
  {
    id: 'ord_hist_1',
    roomId: 'x_1',
    roomName: '1-xona',
    status: 'closed',
    createdAt: hoursAgo(4),
    closedAt: hoursAgo(2.5),
    items: [
      { id: 'h1_1', menuItemId: 'm_1', name: 'Mol go‘shtli shashlik', price: 30000, quantity: 6, addedAt: hoursAgo(4) },
      { id: 'h1_2', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 3, addedAt: hoursAgo(4) },
      { id: 'h1_3', menuItemId: 'm_5', name: 'Choy', price: 10000, quantity: 2, addedAt: hoursAgo(4) },
      { id: 'h1_4', menuItemId: 'm_9', name: 'Salat', price: 15000, quantity: 2, addedAt: hoursAgo(4) },
    ],
    discountAmount: 12000,
    subtotal: 242000,
    finalTotal: 230000,
    paymentMethod: 'karta',
    closedBy: 'admin',
  },
  {
    id: 'ord_hist_2',
    roomId: 's_3',
    roomName: '3-stol',
    status: 'closed',
    createdAt: hoursAgo(3),
    closedAt: hoursAgo(1.5),
    items: [
      { id: 'h2_1', menuItemId: 'm_2', name: 'Qiyma shashlik', price: 25000, quantity: 4, addedAt: hoursAgo(3) },
      { id: 'h2_2', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 2, addedAt: hoursAgo(3) },
      { id: 'h2_3', menuItemId: 'm_6', name: 'Ko‘k choy', price: 8000, quantity: 1, addedAt: hoursAgo(3) },
      { id: 'h2_4', menuItemId: 'm_8', name: 'Coca-Cola', price: 12000, quantity: 1, addedAt: hoursAgo(3) },
    ],
    discountAmount: 0,
    subtotal: 128000,
    finalTotal: 128000,
    paymentMethod: 'naqd',
    closedBy: 'admin',
  },
  {
    id: 'ord_hist_3',
    roomId: 't_4',
    roomName: '4-so‘ri',
    status: 'closed',
    createdAt: hoursAgo(2),
    closedAt: hoursAgo(0.8),
    items: [
      { id: 'h3_1', menuItemId: 'm_10', name: 'Jiz (Qovurma go‘sht)', price: 65000, quantity: 2, addedAt: hoursAgo(2) },
      { id: 'h3_2', menuItemId: 'm_4', name: 'Non', price: 4000, quantity: 4, addedAt: hoursAgo(2) },
      { id: 'h3_3', menuItemId: 'm_12', name: 'Limonli choy', price: 14000, quantity: 1, addedAt: hoursAgo(2) },
      { id: 'h3_4', menuItemId: 'm_9', name: 'Salat', price: 15000, quantity: 2, addedAt: hoursAgo(2) },
    ],
    discountAmount: 0,
    subtotal: 190000,
    finalTotal: 190000,
    paymentMethod: 'karta',
    closedBy: 'admin',
  },
];

export const INITIAL_SETTINGS = {
  choyxonaName: 'Choyxona POS',
  address: 'Toshkent shahri, Chilonzor tumani',
  phone: '+998 71 200 00 00',
  currency: 'so‘m',
  receiptHeader: 'Xush kelibsiz!',
  receiptFooter: 'Tashrifingiz uchun rahmat!',
};
