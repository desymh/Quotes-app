import React, { createContext, useContext, useState, ReactNode } from 'react';

type Quote = {
  quote: string;
  author: string;
};

type FavoriteContextType = {
  favorites: Quote[];
  addToFavorites: (quote: Quote) => void;
  removeFromFavorites: (quote: Quote) => void;
  clearFavorites: () => void; // 
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

  const removeFromFavorites = (quote: Quote) => {
    setFavorites(favorites.filter((item) => item.quote !== quote.quote));
  };

  const clearFavorites = () => {
    setFavorites([]); //  Kosongkan semua favorit
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites }}>
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
