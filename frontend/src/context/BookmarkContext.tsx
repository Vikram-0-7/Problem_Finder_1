import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Problem, Report, BookmarkItem } from '../types';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (type: 'problem' | 'report', item: Problem | Report) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string | number, type: 'problem' | 'report') => boolean;
  getBookmarksByType: (type: 'problem' | 'report') => BookmarkItem[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('gpf_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = (items: BookmarkItem[]) => {
    localStorage.setItem('gpf_bookmarks', JSON.stringify(items));
  };

  const addBookmark = useCallback((type: 'problem' | 'report', item: Problem | Report) => {
    const bookmarkId = `${type}-${'id' in item ? item.id : ''}`;
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmarkId)) return prev;
      const updated = [...prev, { id: bookmarkId, type, item, savedAt: new Date() }];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string | number, type: 'problem' | 'report') => {
      return bookmarks.some((b) => b.id === `${type}-${id}`);
    },
    [bookmarks]
  );

  const getBookmarksByType = useCallback(
    (type: 'problem' | 'report') => {
      return bookmarks.filter((b) => b.type === type);
    },
    [bookmarks]
  );

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarksByType }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within a BookmarkProvider');
  return context;
};
