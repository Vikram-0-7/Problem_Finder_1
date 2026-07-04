import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SearchHistoryItem } from '../types';

interface SearchContextType {
  searchHistory: SearchHistoryItem[];
  addSearch: (query: string, resultsCount: number) => void;
  clearHistory: () => void;
  recentSearches: string[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gpf_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((query: string, resultsCount: number) => {
    setSearchHistory((prev) => {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        resultsCount,
      };
      const updated = [newItem, ...prev.filter((s) => s.query !== query)].slice(0, 50);
      localStorage.setItem('gpf_search_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('gpf_search_history');
  }, []);

  const recentSearches = searchHistory.slice(0, 5).map((s) => s.query);

  return (
    <SearchContext.Provider value={{ searchHistory, addSearch, clearHistory, recentSearches }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};
