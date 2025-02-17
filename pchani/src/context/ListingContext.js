import React, { createContext, useState, useContext, useEffect } from 'react';
import { categories as initialCategories, categoryNumbers, brandNumbers } from '../constants';

const ListingContext = createContext(null);

// Örnek ilanlar - sadece localStorage boş olduğunda kullanılacak
const initialListings = [
  {
    id: 1,
    title: 'Gaming PC RTX 4090',
    price: 125000,
    description: 'RTX 4090 ekran kartlı, i9 12900K işlemcili gaming bilgisayar.',
    image: 'https://source.unsplash.com/random?gaming-pc',
    images: ['https://source.unsplash.com/random?gaming-pc'],
    status: 'active',
    views: 245,
    createdAt: '2024-02-10',
    lastModified: '2024-02-10',
    category: 1,
    condition: 'used',
    city: 'İstanbul',
    district: 'Kadıköy',
    contactPhone: '0555 555 55 55',
    contactEmail: 'test@example.com',
    deliveryType: 'both',
    userId: 1
  },
  {
    id: 2,
    title: 'MacBook Pro M2 Max',
    price: 82500,
    description: 'M2 Max işlemcili, 32GB RAM, 1TB SSD MacBook Pro',
    image: 'https://source.unsplash.com/random?macbook',
    images: ['https://source.unsplash.com/random?macbook'],
    status: 'active',
    views: 189,
    createdAt: '2024-02-09',
    lastModified: '2024-02-09',
    category: 2,
    condition: 'used',
    city: 'Ankara',
    district: 'Çankaya',
    contactPhone: '0555 555 55 55',
    contactEmail: 'test@example.com',
    deliveryType: 'both',
    userId: 1
  }
];

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [favoriteLists, setFavoriteLists] = useState([]);

  // Favori ilanları localStorage'dan yükle
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Favorileri localStorage'a kaydet
  const updateFavorites = React.useCallback((newFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  // İlanı favorilere ekle/çıkar
  const toggleFavorite = (listingId) => {
    return new Promise((resolve) => {
      // Önce ana favorites state'ini güncelle
      const newFavorites = favorites.includes(listingId)
        ? favorites.filter(id => id !== listingId)
        : [...favorites, listingId];
      
      // Sonra tüm favori listelerini güncelle
      const updatedLists = favoriteLists.map(list => {
        if (list.id === 'default') {
          return { ...list, items: newFavorites };
        }
        // Eğer favoriden çıkarılıyorsa, diğer listelerden de çıkar
        if (!newFavorites.includes(listingId)) {
          return {
            ...list,
            items: list.items.filter(id => id !== listingId)
          };
        }
        return list;
      });

      setFavoriteLists(updatedLists);
      localStorage.setItem('favoriteLists', JSON.stringify(updatedLists));
      updateFavorites(newFavorites);
      
      resolve(newFavorites.includes(listingId));
    });
  };

  // İlanın favori olup olmadığını kontrol et
  const isFavorite = (listingId) => {
    return favorites.includes(listingId);
  };

  // Favori ilanları getir
  const getFavoriteListings = () => {
    return listings.filter(listing => favorites.includes(listing.id));
  };

  // Kategori istatistiklerini hesapla
  const calculateCategoryStats = (currentListings) => {
    const stats = {};
    initialCategories.forEach(cat => {
      stats[cat.id] = 0;
    });
    
    currentListings
      .filter(listing => listing.status === 'active')
      .forEach(listing => {
        const categoryId = Number(listing.category);
        if (!isNaN(categoryId) && stats[categoryId] !== undefined) {
          stats[categoryId]++;
        }
      });

    return stats;
  };

  // LocalStorage'ı güncelle ve istatistikleri yeniden hesapla
  const updateLocalStorageAndStats = React.useCallback((newListings) => {
    localStorage.setItem('listings', JSON.stringify(newListings));
    const stats = calculateCategoryStats(newListings);
    setCategoryStats(stats);
    return newListings;
  }, []);

  useEffect(() => {
    // LocalStorage'dan ilanları yükle
    const storedListings = localStorage.getItem('listings');
    const loadedListings = storedListings ? JSON.parse(storedListings) : initialListings;
    
    // Tüm ilanların category özelliğinin sayı olduğundan emin ol
    const normalizedListings = loadedListings.map(listing => ({
      ...listing,
      category: Number(listing.category)
    }));
    
    setListings(normalizedListings);
    updateLocalStorageAndStats(normalizedListings);
    setLoading(false);
  }, [updateLocalStorageAndStats]);

  // Benzersiz ilan numarası oluştur
  const generateUniqueListingNumber = (categoryId, brand) => {
    // Kategori numarasını al
    const categoryNumber = categoryNumbers[categoryId] || '999'; // Bilinmeyen kategori için 999
    
    // Marka numarasını al
    const brandNumber = brandNumbers[brand.toLowerCase()] || '999'; // Bilinmeyen marka için 999
    
    // Benzersiz 4 haneli numara oluştur
    let uniqueNumber;
    let isUnique = false;
    
    while (!isUnique) {
      // 4 haneli rastgele numara oluştur
      uniqueNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      // Oluşturulan numaranın benzersiz olduğunu kontrol et
      const fullNumber = `${categoryNumber}${brandNumber}${uniqueNumber}`;
      isUnique = !listings.some(listing => listing.listingNumber === fullNumber);
    }
    
    return `${categoryNumber}${brandNumber}${uniqueNumber}`;
  };

  // Yeni ilan ekleme
  const addListing = (listingData) => {
    return new Promise((resolve) => {
      const listingNumber = generateUniqueListingNumber(listingData.category, listingData.brand);

      const newListing = {
        ...listingData,
        id: Date.now(),
        listingNumber,
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        views: 0,
        status: 'active',
        category: Number(listingData.category)
      };

      setListings(prevListings => {
        const updatedListings = [...prevListings, newListing];
        return updateLocalStorageAndStats(updatedListings);
      });

      resolve(newListing);
    });
  };

  // İlan güncelleme
  const updateListing = (id, updateData) => {
    return new Promise((resolve, reject) => {
      setListings(prevListings => {
        const index = prevListings.findIndex(listing => listing.id === parseInt(id));
        if (index === -1) {
          reject(new Error('İlan bulunamadı'));
          return prevListings;
        }

        const updatedListings = [...prevListings];
        updatedListings[index] = {
          ...updatedListings[index],
          ...updateData,
          lastModified: new Date().toISOString().split('T')[0],
          category: Number(updateData.category || updatedListings[index].category)
        };

        resolve(updatedListings[index]);
        return updateLocalStorageAndStats(updatedListings);
      });
    });
  };

  // İlan silme
  const deleteListing = (id) => {
    return new Promise((resolve) => {
      setListings(prevListings => {
        const updatedListings = prevListings.filter(listing => listing.id !== id);
        return updateLocalStorageAndStats(updatedListings);
      });
      resolve(true);
    });
  };

  // İlan durumu güncelleme
  const updateListingStatus = (id, status) => {
    return updateListing(id, { status });
  };

  // İlan görüntüleme sayısını artırma
  const incrementViews = (id) => {
    return new Promise((resolve) => {
      setListings(prevListings => {
        const updatedListings = prevListings.map(listing =>
          listing.id === id
            ? { ...listing, views: (listing.views || 0) + 1 }
            : listing
        );
        return updateLocalStorageAndStats(updatedListings);
      });
      resolve(true);
    });
  };

  // İlan getirme
  const getListing = (id) => {
    return listings.find(listing => listing.id === parseInt(id));
  };

  // Kullanıcının ilanlarını getirme
  const getUserListings = (userId) => {
    return listings.filter(listing => listing.userId === userId);
  };

  // Listeye ürün ekle/çıkar
  const toggleListItem = (listId, listingId) => {
    return new Promise((resolve) => {
      // Önce seçilen listeyi güncelle
      const updatedLists = favoriteLists.map(list => {
        if (list.id === listId) {
          const hasItem = list.items.includes(listingId);
          const newItems = hasItem
            ? list.items.filter(id => id !== listingId)
            : [...list.items, listingId];
          
          return { ...list, items: newItems };
        }
        return list;
      });

      // Eğer ürün herhangi bir listede varsa, ana favoriler listesine de ekle
      const isInAnyList = updatedLists.some(list => 
        list.id !== 'default' && list.items.includes(listingId)
      );

      const defaultList = updatedLists.find(list => list.id === 'default');
      if (defaultList) {
        const hasInDefault = defaultList.items.includes(listingId);
        
        if (isInAnyList && !hasInDefault) {
          // Ürün bir listede var ama ana listede yok, ana listeye ekle
          defaultList.items = [...defaultList.items, listingId];
        } else if (!isInAnyList && hasInDefault && listId !== 'default') {
          // Ürün hiçbir listede yok ve ana listeden çıkarılıyor
          defaultList.items = defaultList.items.filter(id => id !== listingId);
        }
      }

      setFavoriteLists(updatedLists);
      localStorage.setItem('favoriteLists', JSON.stringify(updatedLists));

      // Favorites state'ini de güncelle
      const defaultItems = updatedLists.find(list => list.id === 'default')?.items || [];
      updateFavorites(defaultItems);

      resolve(true);
    });
  };

  // Favori listelerini localStorage'dan yükle
  useEffect(() => {
    const storedFavoriteLists = localStorage.getItem('favoriteLists');
    if (storedFavoriteLists) {
      const lists = JSON.parse(storedFavoriteLists);
      setFavoriteLists(lists);
      
      // Ana favori listesini favorites state'i ile senkronize et
      const defaultList = lists.find(list => list.id === 'default');
      if (defaultList) {
        updateFavorites(defaultList.items);
      }
    } else {
      // Varsayılan "Tüm Favoriler" listesi
      const defaultList = {
        id: 'default',
        name: 'Tüm Favoriler',
        items: favorites,
        createdAt: new Date().toISOString(),
      };
      setFavoriteLists([defaultList]);
      localStorage.setItem('favoriteLists', JSON.stringify([defaultList]));
    }
  }, []);

  // Liste sil
  const deleteFavoriteList = (listId) => {
    return new Promise((resolve) => {
      if (listId === 'default') {
        resolve(false); // Varsayılan liste silinemez
        return;
      }

      const updatedLists = favoriteLists.filter(list => list.id !== listId);
      setFavoriteLists(updatedLists);
      localStorage.setItem('favoriteLists', JSON.stringify(updatedLists));
      resolve(true);
    });
  };

  // Yeni favori listesi oluştur
  const createFavoriteList = (name) => {
    return new Promise((resolve) => {
      const newList = {
        id: Date.now().toString(),
        name,
        items: [],
        createdAt: new Date().toISOString(),
      };

      const updatedLists = [...favoriteLists, newList];
      setFavoriteLists(updatedLists);
      localStorage.setItem('favoriteLists', JSON.stringify(updatedLists));
      resolve(newList);
    });
  };

  // Liste adını güncelle
  const updateListName = (listId, newName) => {
    return new Promise((resolve) => {
      const updatedLists = favoriteLists.map(list =>
        list.id === listId ? { ...list, name: newName } : list
      );

      setFavoriteLists(updatedLists);
      localStorage.setItem('favoriteLists', JSON.stringify(updatedLists));
      resolve(true);
    });
  };

  // Listedeki ürünleri getir
  const getListItems = (listId) => {
    const list = favoriteLists.find(l => l.id === listId);
    if (!list) return [];
    return listings.filter(listing => list.items.includes(listing.id));
  };

  // İlan arama fonksiyonu
  const searchListings = (query) => {
    return listings.filter(listing => 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.listingNumber === query
    );
  };

  const value = {
    listings,
    loading,
    categoryStats,
    favorites,
    favoriteLists,
    addListing,
    updateListing,
    deleteListing,
    updateListingStatus,
    incrementViews,
    getListing,
    getUserListings,
    toggleFavorite,
    isFavorite,
    getFavoriteListings,
    createFavoriteList,
    toggleListItem,
    deleteFavoriteList,
    updateListName,
    getListItems,
    searchListings,
  };

  return (
    <ListingContext.Provider value={value}>
      {!loading && children}
    </ListingContext.Provider>
  );
};

export const useListing = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListing must be used within a ListingProvider');
  }
  return context;
}; 