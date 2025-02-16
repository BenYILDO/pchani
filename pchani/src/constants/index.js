import {
  Computer,
  Laptop,
  Memory,
  DeveloperBoard,
  Storage,
  Monitor,
  Keyboard,
  Mouse
} from '@mui/icons-material';

export const categories = [
  { id: 1, name: 'Masaüstü Bilgisayarlar', icon: Computer },
  { id: 2, name: 'Dizüstü Bilgisayarlar', icon: Laptop },
  { id: 3, name: 'İşlemciler', icon: Memory },
  { id: 4, name: 'Ekran Kartları', icon: DeveloperBoard },
  { id: 5, name: 'Anakartlar', icon: DeveloperBoard },
  { id: 6, name: 'RAM', icon: Memory },
  { id: 7, name: 'Depolama', icon: Storage },
  { id: 8, name: 'Monitörler', icon: Monitor },
  { id: 9, name: 'Klavye & Mouse', icon: Keyboard },
];

export const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
];

export const deliveryTypes = {
  shipping: 'Sadece Kargo',
  pickup: 'Sadece Elden Teslim',
  both: 'Kargo veya Elden Teslim',
};

export const conditions = {
  new: 'Yeni',
  used: 'Kullanılmış',
};

export const sortOptions = [
  { value: 'price_asc', label: 'Fiyat (Artan)' },
  { value: 'price_desc', label: 'Fiyat (Azalan)' },
  { value: 'date_desc', label: 'En Yeni' },
  { value: 'date_asc', label: 'En Eski' },
  { value: 'popular', label: 'En Çok İlgi Gören' },
]; 