import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import type { Problem } from '../../types';
import { getSeverityColor, getSeverityDotColor, getPainScore } from '../../utils';
import { useBookmarks } from '../../context/BookmarkContext';
import Badge from '../ui/Badge';

/* ============================================
   PROBLEM CARD COMPONENT
   Grid/List card for displaying a problem
   ============================================ */

interface ProblemCardProps {
  problem: Problem;
  viewMode?: 'grid' | 'list';
}

const severityVariantMap: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'success',
};

const ProblemCard = ({ problem, viewMode = 'grid' }: ProblemCardProps) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(problem.id, 'problem');
  const painScore = getPainScore(problem.severity);
  const sourceDomain = (() => {
    try {
      return new URL(problem.source).hostname.replace('www.', '');
    } catch {
      return problem.source;
    }
  })();

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(`problem-${problem.id}`);
    } else {
      addBookmark('problem', problem);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="
          bg-card border border-border rounded-2xl p-5
          hover:bg-card-hover hover:border-primary hover:shadow-glow
          transition-colors duration-300
          flex flex-col sm:flex-row gap-4 items-start
        "
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge size="sm">{problem.category}</Badge>
            <Badge
              size="sm"
              variant={severityVariantMap[problem.severity] || 'info'}
              icon={<span className={`w-1.5 h-1.5 rounded-full ${getSeverityDotColor(problem.severity)}`} />}
            >
              {problem.severity}
            </Badge>
            {problem.already_in_db && (
              <Badge size="sm" variant="success" className="bg-success/15 border-success/30 text-success">
                Already in Database
              </Badge>
            )}
          </div>

          <h3 className="text-white font-semibold text-base line-clamp-2 mb-2">
            {problem.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {problem.affected_population}
            </span>
            {problem.published_year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {problem.published_year}
              </span>
            )}
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              {sourceDomain}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-text-muted">Pain Score</p>
            <p className={`text-lg font-bold ${getSeverityColor(problem.severity).split(' ')[0]}`}>
              {painScore}/10
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className="p-2 rounded-xl border border-border hover:border-primary hover:bg-primary/10 transition-all duration-200"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 text-text-muted" />
              )}
            </button>
            <Link
              to={`/problems/${problem.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid mode
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="
        bg-card border border-border rounded-3xl p-6
        hover:bg-card-hover hover:border-primary hover:shadow-glow
        transition-colors duration-300
        flex flex-col h-full
      "
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge size="sm">{problem.category}</Badge>
          <Badge
            size="sm"
            variant={severityVariantMap[problem.severity] || 'info'}
            icon={<span className={`w-1.5 h-1.5 rounded-full ${getSeverityDotColor(problem.severity)}`} />}
          >
            {problem.severity}
          </Badge>
          {problem.already_in_db && (
            <Badge size="sm" variant="success" className="bg-success/15 border-success/30 text-success">
              Already in Database
            </Badge>
          )}
        </div>
        <button
          onClick={toggleBookmark}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors duration-200"
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4 text-text-muted" />
          )}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base line-clamp-2 mb-3">
        {problem.title}
      </h3>

      {/* Meta */}
      <div className="flex flex-col gap-2 mb-4 text-xs text-text-muted flex-1">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{problem.affected_population}</span>
        </span>
        <div className="flex items-center gap-3">
          {problem.published_year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {problem.published_year}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            {sourceDomain}
          </span>
        </div>
      </div>

      {/* Pain Score + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-xs text-text-muted">Pain Score</p>
          <p className={`text-lg font-bold ${getSeverityColor(problem.severity).split(' ')[0]}`}>
            {painScore}/10
          </p>
        </div>
        <Link
          to={`/problems/${problem.id}`}
          className="
            flex items-center gap-1.5 px-4 py-2 rounded-xl
            bg-gradient-to-r from-[#FF5A00] to-[#FF8C00]
            text-white text-sm font-medium
            hover:shadow-glow transition-shadow duration-200
          "
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProblemCard;
