import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Download,
  Sparkles,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Shield,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProblemCard from '../components/cards/ProblemCard';
import BarChart from '../components/charts/BarChart';
import { dummyProblems } from '../data/dummyData';
import { getSeverityColor, formatDate, getPainScore, getCategoryColor } from '../utils';
import { useBookmarks } from '../context/BookmarkContext';
import { problemsApi } from '../services/api';
import type { Problem } from '../types';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function ProblemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProblems, setRelatedProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const numId = Number(id);
        if (!isNaN(numId)) {
          // Fetch problem from database
          const res = await problemsApi.getProblem(numId);
          setProblem(res);
          
          // Fetch related problems from database
          try {
            const relRes = await problemsApi.getProblems({ category: res.category, pageSize: 4 });
            const filtered = relRes.problems.filter((p) => p.id !== res.id).slice(0, 3);
            setRelatedProblems(filtered);
          } catch (e) {
            console.error('Failed to fetch related backend problems', e);
            // Fallback for related
            const relFallback = dummyProblems
              .filter((p) => p.category === res.category && p.id !== res.id)
              .slice(0, 3);
            setRelatedProblems(relFallback);
          }
        } else {
          // If ID is not a number, find in dummyProblems (fallback)
          const fallback = dummyProblems.find((p) => String(p.id) === id);
          if (fallback) {
            setProblem(fallback);
            const relFallback = dummyProblems
              .filter((p) => p.category === fallback.category && p.id !== fallback.id)
              .slice(0, 3);
            setRelatedProblems(relFallback);
          } else {
            setProblem(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch problem from backend, trying fallback', err);
        // Fallback to dummyProblems
        const fallback = dummyProblems.find((p) => String(p.id) === id || p.id === Number(id));
        if (fallback) {
          setProblem(fallback);
          const relFallback = dummyProblems
              .filter((p) => p.category === fallback.category && p.id !== fallback.id)
              .slice(0, 3);
          setRelatedProblems(relFallback);
        } else {
          setProblem(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id]);

  useEffect(() => {
    document.title = problem ? `${problem.title} — GPF` : 'Problem Details';
    window.scrollTo(0, 0);
  }, [problem]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-primary/20 animate-spin mb-4"></div>
          <p className="text-text-secondary font-medium">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Problem Not Found</h1>
          <p className="text-text-secondary mb-6">The problem you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/discover')}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const painScore = getPainScore(problem.severity);
  const bookmarked = isBookmarked(problem.id, 'problem');

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(`problem-${problem.id}`);
    } else {
      addBookmark('problem', problem);
    }
  };

  const downloadReportFile = () => {
    if (!problem) return;
    const reportContent = `
# Government Problem Report: ${problem.title}

## Overview
- **Category**: ${problem.category}
- **State / Region**: ${problem.state.toLowerCase() === 'india' ? 'National (India)' : problem.state}
- **Severity**: ${problem.severity}
- **Published Year**: ${problem.published_year || 'N/A'}
- **Report Name**: ${problem.report_name || 'Official Government Source'}
- **Original Source URL**: ${problem.source}

## Problem Description
${problem.description}

## Key Statistics
${problem.statistics || 'No specific statistics recorded.'}

## AI Summary
This problem highlights a critical systemic issue in the ${problem.category.toLowerCase()} sector affecting ${problem.affected_population.toLowerCase()}. Based on data from ${problem.report_name || 'official government sources'}, the situation requires immediate policy intervention and resource allocation.

## Possible Innovation Areas
${innovations.map((item, index) => `${index + 1}. ${item}`).join('\n')}

---
Report compiled by Government Problem Finder on ${new Date().toLocaleDateString()}.
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `problem_report_${problem.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // Mock comparison chart data
  const comparisonData = [
    { name: '2020', value: Math.floor(Math.random() * 5000) + 2000 },
    { name: '2021', value: Math.floor(Math.random() * 5000) + 2000 },
    { name: '2022', value: Math.floor(Math.random() * 5000) + 3000 },
    { name: '2023', value: Math.floor(Math.random() * 5000) + 3500 },
    { name: '2024', value: Math.floor(Math.random() * 5000) + 4000 },
  ];

  // Innovation areas
  const innovations = (problem.innovation_areas && problem.innovation_areas.length > 0)
    ? problem.innovation_areas
    : [
        'AI-driven monitoring and early warning systems',
        'Mobile-first digital platforms for citizen engagement',
        'Data analytics dashboards for policy makers',
        'Public-private partnership models',
        'Community-driven grassroots solutions',
      ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button + Breadcrumb */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-border hover:border-border-light hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <nav className="flex items-center gap-1 text-sm text-text-muted">
              <Link to="/" className="hover:text-text transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/discover" className="hover:text-text transition-colors">Discover</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-text-secondary truncate max-w-[200px]">{problem.title}</span>
            </nav>
          </div>
          <Button
            variant={bookmarked ? 'primary' : 'secondary'}
            size="sm"
            icon={bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            onClick={toggleBookmark}
          >
            {bookmarked ? 'Saved' : 'Save'}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div className="mb-10" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="default"
              className="text-sm"
              style={{ backgroundColor: `${getCategoryColor(problem.category)}15`, color: getCategoryColor(problem.category), borderColor: `${getCategoryColor(problem.category)}30` } as React.CSSProperties}
            >
              {problem.category}
            </Badge>
            <Badge variant="default" className={`text-sm ${getSeverityColor(problem.severity)}`}>
              {problem.severity}
            </Badge>
            {problem.published_year && (
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                {problem.published_year}
              </span>
            )}
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {problem.title}
          </motion.h1>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {problem.state}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {problem.affected_population}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(problem.created_at)}
            </span>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card padding="lg">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-text-secondary leading-relaxed">{problem.description}</p>
              </Card>
            </motion.div>

            {/* AI Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative rounded-xl border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-accent/5" />
                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">AI Summary</h2>
                    <Badge variant="default" size="sm" className="bg-primary/10 text-primary border-primary/25">
                      Beta
                    </Badge>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    This problem highlights a critical systemic issue in {problem.category.toLowerCase()} sector affecting {problem.affected_population.toLowerCase()}.
                    Based on data from {problem.report_name || 'official government sources'}, the situation has shown concerning trends
                    requiring immediate policy intervention and resource allocation. The {problem.severity.toLowerCase()}-severity classification
                    indicates {problem.severity === 'Critical' ? 'urgent need for emergency measures' : 'significant attention from policy makers'}.
                    {problem.statistics && ` Key statistics show: ${problem.statistics}.`}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Statistics */}
            {problem.statistics && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card padding="lg">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Key Statistics</h2>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border border-border">
                    <p className="text-text-secondary leading-relaxed">{problem.statistics}</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Innovation Areas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-semibold">Possible Innovation Areas</h2>
                </div>
                <ul className="space-y-3">
                  {innovations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Comparison Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card padding="lg">
                <BarChart data={comparisonData} title="Year-over-Year Trend" height={280} />
              </Card>
            </motion.div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card padding="lg">
                <h3 className="text-lg font-semibold mb-4">Report Information</h3>
                <dl className="space-y-4">
                  {problem.report_name && (
                    <div>
                      <dt className="text-xs text-text-muted uppercase tracking-wider mb-1">Report</dt>
                      <dd className="text-sm text-text-secondary">{problem.report_name}</dd>
                    </div>
                  )}
                  {problem.published_year && (
                    <div>
                      <dt className="text-xs text-text-muted uppercase tracking-wider mb-1">Published</dt>
                      <dd className="text-sm text-text-secondary">{problem.published_year}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-text-muted uppercase tracking-wider mb-1">State / Region</dt>
                    <dd className="text-sm text-text-secondary">
                      {problem.state.toLowerCase() === 'india' ? 'National (India)' : problem.state}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted uppercase tracking-wider mb-1">Category</dt>
                    <dd className="text-sm text-text-secondary">{problem.category}</dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2 mt-6">
                  <a href={problem.source} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" fullWidth icon={<ExternalLink className="w-4 h-4" />}>
                      View Source
                    </Button>
                  </a>
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    icon={<Download className="w-4 h-4" />}
                    onClick={downloadReportFile}
                  >
                    Download Report
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Pain Score */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card padding="lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Pain Score
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${(painScore / 10) * 314} 314`}
                        strokeLinecap="round"
                        className={painScore >= 8 ? 'text-red-500' : painScore >= 6 ? 'text-amber-500' : 'text-blue-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{painScore}</span>
                      <span className="text-text-muted text-sm">/10</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-text-muted">
                  {painScore >= 8 ? 'Very High Impact' : painScore >= 6 ? 'High Impact' : 'Moderate Impact'}
                </p>
              </Card>
            </motion.div>

            {/* Affected Population */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
              <Card padding="lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Affected Population
                </h3>
                <p className="text-2xl font-bold text-primary mb-2">{problem.affected_population}</p>
                <p className="text-sm text-text-muted">People directly impacted by this issue</p>
              </Card>
            </motion.div>

            {/* Social Impact */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card padding="lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Social Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Economic Impact</span>
                    <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${painScore * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Social Impact</span>
                    <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(painScore * 12, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Policy Urgency</span>
                    <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${painScore * 10 + 5}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Problems */}
        {relatedProblems.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              Related <span className="text-gradient">Problems</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProblems.map((rp) => (
                <ProblemCard key={rp.id} problem={rp} viewMode="grid" />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
