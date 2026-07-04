import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Report } from '../../types';
import Badge from '../ui/Badge';

/* ============================================
   REPORT CARD COMPONENT
   Card displaying a government report source
   ============================================ */

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report }: ReportCardProps) => {
  // Dynamically resolve lucide icon from string
  const IconComponent = (LucideIcons as any)[report.icon] || LucideIcons.FileText;

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
      {/* Icon + Category */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <Badge size="sm">{report.category}</Badge>
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-lg mb-2">{report.name}</h3>

      {/* Description */}
      <p className="text-sm text-text-muted line-clamp-3 mb-4 flex-1 leading-relaxed">
        {report.description}
      </p>

      {/* Stats + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-xs text-text-muted">Problems</p>
          <p className="text-lg font-bold text-white">
            {report.problems_count.toLocaleString()}
          </p>
        </div>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-1.5 px-4 py-2 rounded-xl
            border border-primary text-primary text-sm font-medium
            hover:bg-primary/10 transition-colors duration-200
          "
          aria-label={`View ${report.name} report`}
        >
          View Report <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};

export default ReportCard;
