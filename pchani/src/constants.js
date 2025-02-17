import {
  Computer,
  Laptop,
  Memory,
  Keyboard,
  Monitor,
  Mouse,
  Storage,
  Headphones,
  DeveloperBoard,
} from '@mui/icons-material';

// Kategori başlangıç numaraları
export const categoryNumbers = {
  1: '111', // Masaüstü Bilgisayarlar
  2: '112', // Dizüstü Bilgisayarlar
  3: '113', // Ekran Kartları
  4: '114', // İşlemciler
  5: '115', // Anakartlar
  6: '116', // RAM
  7: '117', // Depolama
  8: '118', // Monitörler
  9: '119', // Klavye & Mouse
  10: '120', // Kulaklık & Ses Sistemleri
};

// Marka numaraları (A-Z sıralı)
export const brandNumbers = {
  // Masaüstü Bilgisayar Markaları (111)
  'asus': '001',
  'casper': '002',
  'dell': '003',
  'hp': '004',
  'lenovo': '005',
  'monster': '006',
  'msi': '007',

  // Dizüstü Bilgisayar Markaları (112)
  'acer': '001',
  'apple': '002',
  'asus_laptop': '003',
  'dell_laptop': '004',
  'hp_laptop': '005',
  'huawei': '006',
  'lenovo_laptop': '007',
  'monster_laptop': '008',
  'msi_laptop': '009',

  // Ekran Kartı Markaları (113)
  'amd': '001',
  'asus_gpu': '002',
  'gigabyte': '003',
  'msi_gpu': '004',
  'nvidia': '005',
  'powercolor': '006',
  'sapphire': '007',
  'zotac': '008',

  // İşlemci Markaları (114)
  'amd_cpu': '001',
  'intel': '002',

  // Diğer kategoriler için markalar eklenecek...
};

// Kategoriler
export const categories = [
  {
    id: 1,
    name: 'Masaüstü Bilgisayarlar',
    icon: Computer,
  },
  {
    id: 2,
    name: 'Dizüstü Bilgisayarlar',
    icon: Laptop,
  },
  {
    id: 3,
    name: 'Ekran Kartları',
    icon: Memory,
  },
  {
    id: 4,
    name: 'İşlemciler',
    icon: Memory,
  },
  {
    id: 5,
    name: 'Anakartlar',
    icon: DeveloperBoard,
  },
  {
    id: 6,
    name: 'RAM',
    icon: Memory,
  },
  {
    id: 7,
    name: 'Depolama',
    icon: Storage,
  },
  {
    id: 8,
    name: 'Monitörler',
    icon: Monitor,
  },
  {
    id: 9,
    name: 'Klavye & Mouse',
    icon: Keyboard,
  },
  {
    id: 10,
    name: 'Kulaklık & Ses Sistemleri',
    icon: Headphones,
  },
];

// Ürün durumları
export const conditions = {
  'new': 'Sıfır',
  'like_new': 'Az Kullanılmış',
  'good': 'İyi',
  'fair': 'Normal',
  'poor': 'Kötü',
};

// Teslimat türleri
export const deliveryTypes = {
  'shipping': 'Kargo',
  'pickup': 'Elden Teslim',
  'both': 'Kargo veya Elden Teslim',
};

// Sıralama seçenekleri
export const sortOptions = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'price_asc', label: 'Fiyat (Artan)' },
  { value: 'price_desc', label: 'Fiyat (Azalan)' },
  { value: 'views', label: 'En Çok Görüntülenen' },
];

// Türkiye şehirleri
export const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt',
  'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük',
  'Kilis', 'Osmaniye', 'Düzce'
]; 