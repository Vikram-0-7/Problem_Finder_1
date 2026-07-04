import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import StatsCard from '../components/cards/StatsCard';
import CategoryCard from '../components/cards/CategoryCard';
import ProblemCard from '../components/cards/ProblemCard';
import ReportCard from '../components/cards/ReportCard';
import Button from '../components/ui/Button';
import { useInView, useCountUp } from '../hooks';
import { dummyProblems, dummyReports, categories } from '../data/dummyData';
import { useState } from 'react';

/* ─── Animation Variants ─── */
const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Stat Item (with count-up) ─── */
function StatItem({ label, end, suffix, icon, color }: { label: string; end: number; suffix: string; icon: string; color: string }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(end, 2000, inView);

  return (
    <div ref={ref}>
      <StatsCard
        label={label}
        value={`${count.toLocaleString()}${suffix}`}
        icon={icon}
        color={color}
      />
    </div>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [sectionRef1, inView1] = useInView(0.1);
  const [sectionRef2, inView2] = useInView(0.1);
  const [sectionRef3, inView3] = useInView(0.1);
  const [sectionRef4, inView4] = useInView(0.1);

  useEffect(() => {
    document.title = 'Government Problem Finder — Discover Real Problems with AI';
  }, []);

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      navigate(`/discover?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary opacity-10 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent opacity-5 blur-3xl"
          animate={{ x: [0, -30, 25, 0], y: [0, 25, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-primary opacity-5 blur-3xl"
          animate={{ x: [0, 20, -40, 0], y: [0, -40, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-text-secondary backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Government Data Analysis
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Discover Real{' '}
            <span className="text-gradient">Government Problems</span>
            {' '}with AI
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Search verified problems from official government reports, datasets and ministries.
            Powered by AI to uncover insights that matter.
          </motion.p>

          <motion.div variants={fadeUp} className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={heroSearch}
              onChange={setHeroSearch}
              onSearch={handleHeroSearch}
              placeholder="Search government problems..."
              size="hero"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={handleHeroSearch}>
              Search Problems
            </Button>
            <Link to="/reports">
              <Button variant="secondary" size="lg">
                Explore Reports
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          STATISTICS SECTION
          ═══════════════════════════════════════════ */}
      <section ref={sectionRef1} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            variants={stagger}
            initial="initial"
            animate={inView1 ? 'animate' : 'initial'}
          >
            <motion.div variants={fadeUp}>
              <StatItem label="Problems Identified" end={15000} suffix="+" icon="AlertTriangle" color="#EF4444" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatItem label="Government Reports" end={3000} suffix="+" icon="FileText" color="#3B82F6" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatItem label="Government Sources" end={25} suffix="+" icon="Building2" color="#22C55E" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatItem label="Categories" end={18} suffix="" icon="Layers" color="#F59E0B" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRENDING CATEGORIES
          ═══════════════════════════════════════════ */}
      <section ref={sectionRef2} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="initial"
            animate={inView2 ? 'animate' : 'initial'}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trending <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Explore problems across key sectors identified from government data sources.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={stagger}
            initial="initial"
            animate={inView2 ? 'animate' : 'initial'}
          >
            {categories.slice(0, 8).map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <CategoryCard category={cat} onClick={() => navigate(`/discover?category=${cat.name}`)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED PROBLEMS
          ═══════════════════════════════════════════ */}
      <section ref={sectionRef3} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="initial"
            animate={inView3 ? 'animate' : 'initial'}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Problems</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Critical issues identified from verified government reports and data.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            animate={inView3 ? 'animate' : 'initial'}
          >
            {dummyProblems.slice(0, 6).map((problem) => (
              <motion.div key={problem.id} variants={fadeUp}>
                <ProblemCard problem={problem} viewMode="grid" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            variants={fadeUp}
            initial="initial"
            animate={inView3 ? 'animate' : 'initial'}
          >
            <Link to="/discover">
              <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                View All Problems
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST REPORTS
          ═══════════════════════════════════════════ */}
      <section ref={sectionRef4} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="initial"
            animate={inView4 ? 'animate' : 'initial'}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-gradient">Government Reports</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Comprehensive reports from official government agencies and institutions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            animate={inView4 ? 'animate' : 'initial'}
          >
            {dummyReports.slice(0, 4).map((report) => (
              <motion.div key={report.id} variants={fadeUp}>
                <ReportCard report={report} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            variants={fadeUp}
            initial="initial"
            animate={inView4 ? 'animate' : 'initial'}
          >
            <Link to="/reports">
              <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                View All Reports
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative rounded-2xl border border-primary/20 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-accent/5" />
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative z-10 py-16 px-6 md:px-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Discovering <span className="text-gradient">Problems</span>
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8">
                Use AI to find, analyze, and understand real government problems from official data sources.
              </p>

              <div className="max-w-xl mx-auto mb-6">
                <SearchBar
                  value={heroSearch}
                  onChange={setHeroSearch}
                  onSearch={handleHeroSearch}
                  placeholder="Search problems..."
                />
              </div>

              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={handleHeroSearch}>
                Explore Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
