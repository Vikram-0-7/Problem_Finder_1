import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Lazy-loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Discover = React.lazy(() => import('./pages/Discover'));
const ProblemDetails = React.lazy(() => import('./pages/ProblemDetails'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AIChat = React.lazy(() => import('./pages/AIChat'));
const Bookmarks = React.lazy(() => import('./pages/Bookmarks'));
const Profile = React.lazy(() => import('./pages/Profile'));
const LiveSearch = React.lazy(() => import('./pages/LiveSearch'));

/* ─── Page transition wrapper ─── */
const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

/* ─── Loading fallback ─── */
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}

/* ─── App ─── */
export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="/discover"
                element={
                  <PageWrapper>
                    <Discover />
                  </PageWrapper>
                }
              />
              <Route
                path="/live-search"
                element={
                  <PageWrapper>
                    <LiveSearch />
                  </PageWrapper>
                }
              />
              <Route
                path="/problems/:id"
                element={
                  <PageWrapper>
                    <ProblemDetails />
                  </PageWrapper>
                }
              />
              <Route
                path="/reports"
                element={
                  <PageWrapper>
                    <Reports />
                  </PageWrapper>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <PageWrapper>
                    <AIChat />
                  </PageWrapper>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <PageWrapper>
                    <Bookmarks />
                  </PageWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
