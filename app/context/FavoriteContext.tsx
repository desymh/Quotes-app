import React, { createContext, useContext, useState, ReactNode } from 'react';

type Quote = {
  quote: string;
  author: string;
};

type FavoriteContextType = {
  favorites: Quote[];
  addToFavorites: (quote: Quote) => void;
  removeFromFavorites: (quote: Quote) => void; // 👈 Tambahkan ini
};

export const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Quote[]>([]);

  const addToFavorites = (quote: Quote) => {
    const exists = favorites.find((item) => item.quote === quote.quote);
    if (!exists) {
      setFavorites([...favorites, quote]);
    }
  };

  // 👇 Fungsi hapus favorit
  const removeFromFavorites = (quote: Quote) => {
    setFavorites(favorites.filter((item) => item.quote !== quote.quote));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites harus dipakai di dalam FavoriteProvider");
  }
  return context;
};
