import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, Database, Loader2 } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import ProblemCard from '../components/cards/ProblemCard';
import Button from '../components/ui/Button';
import { problemsApi } from '../services/api';
import type { Problem } from '../types';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const steps = [
  { id: 1, label: 'Searching official government domains (.gov.in)...', desc: 'DuckDuckGo Search querying whitelisted portals.' },
  { id: 2, label: 'Crawling and cleaning top source pages...', desc: 'Concurrent async HTML fetch & content text parser.' },
  { id: 3, label: 'Extracting structured problems via Groq AI (Llama 3.3)...', desc: 'LLM analyzing datasets for verified pain-points.' },
  { id: 4, label: 'Deduplicating and storing to local Neon Database...', desc: 'Applying SequenceMatcher checks & PostgreSQL insert.' },
];

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [source, setSource] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.title = 'AI Live Search — Government Problem Finder';
  }, []);

  // Simulate progress steps for live search visual feedback
  useEffect(() => {
    let interval: any;
    if (loading) {
      setCurrentStep(1);
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 4) {
            clearInterval(interval);
            return 4;
          }
          return prev + 1;
        });
      }, 3000); // Progress to next step every 3 seconds
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (searchVal: string) => {
    const q = searchVal || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setProblems([]);
    setHasSearched(true);
    try {
      console.log(`[LiveSearch] Calling API search: ${q}`);
      const res = await problemsApi.liveSearch(q.trim(), true);
      setProblems(res.problems);
      setSource(res.source);
    } catch (err) {
      console.error('[LiveSearch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-4 animate-pulse-glow">
            <Sparkles className="w-4 h-4" />
            Real-Time AI Extraction Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI <span className="text-gradient">Live Search</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Type any topic or query. Our AI agent will crawl whitelisted government reports live, extract verified problems, deduplicate them, and save them directly to your database.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="Type e.g., 'water sanitation issue', 'education in bihar', 'unemployment'..."
            size="large"
          />
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-text-muted self-center mr-2">Try searching:</span>
            {[
              'Telangana agriculture index report',
              'Rural drinking water sanitation survey',
              'NITI Aayog state health index',
              'NFHS education dropouts statistics',
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuery(q);
                  handleSearch(q);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Search Query Structure Guide */}
          <div className="mt-6 p-4 rounded-2xl border border-border bg-card/20 text-center max-w-xl mx-auto">
            <p className="text-xs font-semibold text-text-secondary mb-2">Government Search Query Formula:</p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:text-xs">
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary font-mono font-semibold">[Topic/Sector]</span>
              <span className="text-text-muted font-bold">+</span>
              <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent font-mono font-semibold">[State/Region]</span>
              <span className="text-text-muted font-bold">+</span>
              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 font-mono font-semibold">[Document Type (report/pdf/survey)]</span>
              <span className="text-text-muted font-bold">+</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 font-mono font-semibold">site:gov.in</span>
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Note: The backend automatically appends the document type and <code className="text-emerald-400 font-mono">site:gov.in</code> to target official reports.
            </p>
          </div>
        </motion.div>

        {/* Dynamic Loading Step Indicator */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading-panel"
              className="max-w-xl mx-auto bg-card border border-primary/20 rounded-3xl p-8 shadow-glow mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <h3 className="text-lg font-semibold text-white">AI Scraper Pipeline Running...</h3>
              </div>

              <div className="space-y-6">
                {steps.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className={`flex gap-4 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : isCompleted ? 'opacity-50' : 'opacity-20'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                            isCompleted
                              ? 'bg-primary text-white'
                              : isActive
                              ? 'bg-primary/20 text-primary border border-primary/50'
                              : 'bg-border text-text-muted'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : step.id}
                        </div>
                        {step.id < 4 && (
                          <div
                            className={`w-0.5 h-10 border-l border-dashed my-1 ${
                              isCompleted ? 'border-primary' : 'border-border'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-white'}`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-text-secondary mt-1"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results section */}
        {!loading && hasSearched && (
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Extracted Problems ({problems.length})
              </h2>
              {source === 'live_search' && (
                <span className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live AI Scraped & Saved
                </span>
              )}
              {source === 'database' && (
                <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  <Database className="w-3.5 h-3.5" />
                  Loaded from Database
                </span>
              )}
            </div>

            {problems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem) => (
                  <motion.div key={problem.id} variants={fadeUp}>
                    <ProblemCard problem={problem} viewMode="grid" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-16">
                <Database className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No problems extracted</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  We scanned official sources for "{query}" but didn't find any explicit issues mentioned. Try a different query.
                </p>
                <Button variant="secondary" onClick={() => setHasSearched(false)}>
                  Try New Search
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
