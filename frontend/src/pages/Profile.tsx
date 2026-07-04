import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bookmark,
  FileText,
  Search,
  Settings,
  Moon,
  Bell,
  Globe,
  Info,
  ChevronRight,
  Shield,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useBookmarks } from '../context/BookmarkContext';
import { useSearch } from '../context/SearchContext';
import { dummySearchHistory } from '../data/dummyData';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function Profile() {
  const { getBookmarksByType } = useBookmarks();
  const { searchHistory } = useSearch();
  const [darkTheme, setDarkTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    document.title = 'Profile — Government Problem Finder';
  }, []);

  const savedProblems = getBookmarksByType('problem');
  const savedReports = getBookmarksByType('report');
  const displayHistory = searchHistory.length > 0 ? searchHistory.slice(0, 10) : dummySearchHistory;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4 flex items-center justify-center shadow-glow">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Profile</h1>
          <p className="text-text-secondary">Manage your preferences and view activity</p>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {/* Bookmarks Summary */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Bookmarks Summary</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/bookmarks" className="group">
                  <div className="bg-surface rounded-xl p-4 border border-border group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-bold">{savedProblems.length}</p>
                    <p className="text-sm text-text-muted">Saved Problems</p>
                  </div>
                </Link>
                <Link to="/bookmarks" className="group">
                  <div className="bg-surface rounded-xl p-4 border border-border group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-bold">{savedReports.length}</p>
                    <p className="text-sm text-text-muted">Saved Reports</p>
                  </div>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Search History */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Search History</h2>
                </div>
                <Link to="/bookmarks" className="text-sm text-primary hover:text-primary-light transition-colors">
                  View all →
                </Link>
              </div>

              {displayHistory.length > 0 ? (
                <div className="space-y-2">
                  {displayHistory.slice(0, 10).map((item) => (
                    <Link
                      key={item.id}
                      to={`/discover?q=${encodeURIComponent(item.query)}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface transition-colors group"
                    >
                      <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                      <span className="text-sm text-text-secondary group-hover:text-text transition-colors flex-1 truncate">
                        {item.query}
                      </span>
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {item.resultsCount} results
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted py-4 text-center">No recent searches</p>
              )}
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Dark Theme Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                      <Moon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dark Theme</p>
                      <p className="text-xs text-text-muted">Always on for optimal experience</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkTheme(!darkTheme)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      darkTheme ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: darkTheme ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                      <Bell className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-text-muted">Get updates on new problems</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: notifications ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Language Selector */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                      <Globe className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-xs text-text-muted">Interface language</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी</option>
                    <option value="Tamil">தமிழ்</option>
                    <option value="Telugu">తెలుగు</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">About</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Application</span>
                  <span className="text-sm font-medium">Government Problem Finder</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Version</span>
                  <Badge variant="default" size="sm" className="bg-primary/10 text-primary border-primary/25">
                    v1.0.0-beta
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Data Sources</span>
                  <span className="text-sm text-text-secondary">28+ Government APIs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Last Updated</span>
                  <span className="text-sm text-text-secondary">July 2026</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
                <p className="text-xs text-text-muted leading-relaxed">
                  Government Problem Finder uses AI to analyze data from official government reports,
                  surveys, and datasets to identify and categorize real problems faced by citizens.
                  All data is sourced from publicly available government publications.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
