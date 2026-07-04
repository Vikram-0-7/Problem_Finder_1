import { useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Bookmark, User, Menu, X } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';

/* ============================================
   NAVBAR COMPONENT
   Sticky glass navigation with mobile hamburger
   ============================================ */

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Discover', path: '/discover' },
  { label: 'Live Search', path: '/live-search' },
  { label: 'Reports', path: '/reports' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Assistant', path: '/ai-chat' },
];

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: { x: '-100%', transition: { duration: 0.25 } },
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav
        className="
          sticky top-0 z-50
          glass-dark border-b border-border
        "
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <Flame className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-white hidden sm:inline">
                Government Problem Finder
              </span>
              <span className="text-lg font-bold text-white sm:hidden">
                GPF
              </span>
            </Link>

            {/* Center: Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    relative px-4 py-2 text-sm font-medium rounded-xl
                    transition-colors duration-200
                    ${isActive ? 'text-primary' : 'text-text-secondary hover:text-white'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                          transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-2">
              <Link
                to="/bookmarks"
                className="relative p-2.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors duration-200"
                aria-label="Bookmarks"
              >
                <Bookmark className="w-5 h-5" />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">
                    {bookmarks.length}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="p-2.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors duration-200"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Hamburger (Mobile) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />

            {/* Sidebar */}
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-surface border-r border-border p-6 md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={closeMobile} className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold text-white">GPF</span>
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={closeMobile}
                    className={({ isActive }) => `
                      px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
