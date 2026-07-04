import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  FileText,
  Clock,
  Search,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProblemCard from '../components/cards/ProblemCard';
import ReportCard from '../components/cards/ReportCard';
import EmptyState from '../components/feedback/EmptyState';
import { useBookmarks } from '../context/BookmarkContext';
import { useSearch } from '../context/SearchContext';
import { dummySearchHistory } from '../data/dummyData';
import type { Problem, Report } from '../types';

const tabs = [
  { id: 'problems', label: 'Saved Problems', icon: AlertTriangle },
  { id: 'reports', label: 'Saved Reports', icon: FileText },
  { id: 'searches', label: 'Recent Searches', icon: Clock },
] as const;

type TabId = (typeof tabs)[number]['id'];

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Bookmarks() {
  const [activeTab, setActiveTab] = useState<TabId>('problems');
  const { getBookmarksByType, removeBookmark } = useBookmarks();
  const { searchHistory, clearHistory } = useSearch();

  useEffect(() => {
    document.title = 'Bookmarks — Government Problem Finder';
  }, []);

  const savedProblems = getBookmarksByType('problem');
  const savedReports = getBookmarksByType('report');

  // Merge real search history with dummy if empty
  const displayHistory = searchHistory.length > 0 ? searchHistory : dummySearchHistory;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Bookmarks</h1>
          </div>
          <p className="text-text-secondary">
            Your saved problems, reports, and recent search history.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-8 overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === 'problems' ? savedProblems.length :
              tab.id === 'reports' ? savedReports.length :
              displayHistory.length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-primary/20 text-primary' : 'bg-border text-text-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ─── Saved Problems ─── */}
          {activeTab === 'problems' && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {savedProblems.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  {savedProblems.map((bookmark) => (
                    <motion.div key={bookmark.id} variants={fadeUp} className="relative group">
                      <ProblemCard problem={bookmark.item as Problem} viewMode="grid" />
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove bookmark"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  title="No saved problems"
                  description="Problems you bookmark will appear here. Start browsing and save the ones that interest you."
                  icon={<Bookmark className="w-12 h-12 text-text-muted" />}
                  action={
                    <Link to="/discover">
                      <Button variant="primary">Browse Problems</Button>
                    </Link>
                  }
                />
              )}
            </motion.div>
          )}

          {/* ─── Saved Reports ─── */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {savedReports.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  {savedReports.map((bookmark) => (
                    <motion.div key={bookmark.id} variants={fadeUp} className="relative group">
                      <ReportCard report={bookmark.item as Report} />
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove bookmark"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  title="No saved reports"
                  description="Reports you bookmark will appear here. Browse government reports and save the ones you need."
                  icon={<FileText className="w-12 h-12 text-text-muted" />}
                  action={
                    <Link to="/reports">
                      <Button variant="primary">Browse Reports</Button>
                    </Link>
                  }
                />
              )}
            </motion.div>
          )}

          {/* ─── Recent Searches ─── */}
          {activeTab === 'searches' && (
            <motion.div
              key="searches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {displayHistory.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-text-muted">{displayHistory.length} recent searches</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={clearHistory}
                    >
                      Clear All
                    </Button>
                  </div>

                  <motion.div
                    className="space-y-2"
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                  >
                    {displayHistory.map((item) => (
                      <motion.div key={item.id} variants={fadeUp}>
                        <Link to={`/discover?q=${encodeURIComponent(item.query)}`}>
                          <Card hover padding="md">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                <Search className="w-4 h-4 text-text-muted" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.query}</p>
                                <p className="text-xs text-text-muted">
                                  {item.resultsCount} results • {new Date(item.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <EmptyState
                  title="No search history"
                  description="Your recent searches will appear here."
                  icon={<Search className="w-12 h-12 text-text-muted" />}
                  action={
                    <Link to="/discover">
                      <Button variant="primary">Start Searching</Button>
                    </Link>
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
