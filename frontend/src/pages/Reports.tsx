import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Search } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import ReportCard from '../components/cards/ReportCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { dummyReports, dummyProblems } from '../data/dummyData';
import { useDebounce } from '../hooks';
import { reportsApi } from '../services/api';
import Skeleton from '../components/feedback/Skeleton';
import type { Report } from '../types';

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Reports() {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    document.title = 'Government Reports — Government Problem Finder';
  }, []);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await reportsApi.getReports();
        setReports(data);
      } catch (err) {
        console.warn("Backend reports API failed, using fallback dummy reports:", err);
        setReports(dummyReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (!debouncedSearch) return reports;
    const q = debouncedSearch.toLowerCase();
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [debouncedSearch, reports]);

  // Get related problems for selected report
  const relatedProblems = useMemo(() => {
    if (!selectedReport) return [];
    return dummyProblems
      .filter(
        (p) =>
          p.category.toLowerCase() === selectedReport.category.toLowerCase() ||
          p.report_name?.toLowerCase().includes(selectedReport.name.toLowerCase())
      )
      .slice(0, 4);
  }, [selectedReport]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Government <span className="text-gradient">Reports</span>
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl">
            Browse comprehensive reports from official government agencies, research institutions, and international organizations covering India's key sectors.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={() => {}}
            placeholder="Search reports by name, category..."
          />
        </motion.div>

        {/* Results count */}
        <div className="mb-6 text-sm text-text-muted">
          {filteredReports.length} reports found
        </div>

        {/* Report Cards Grid */}
        {loading ? (
          <div className="py-6">
            <Skeleton variant="card" count={8} />
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={stagger}
              initial="initial"
              animate="animate"
              key={debouncedSearch}
            >
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  variants={fadeUp}
                  onClick={() => setSelectedReport(report)}
                  className="cursor-pointer"
                >
                  <ReportCard report={report} />
                </motion.div>
              ))}
            </motion.div>

            {filteredReports.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-text-muted">Try a different search term.</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Report Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.name || ''}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Report header info */}
            <div className="space-y-4">
              <p className="text-text-secondary leading-relaxed">{selectedReport.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Problems Extracted</p>
                  <p className="text-2xl font-bold text-primary">{selectedReport.problems_count}</p>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Category</p>
                  <Badge variant="default" size="sm">{selectedReport.category}</Badge>
                </div>
              </div>

              {selectedReport.published_date && (
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Publication Year</p>
                  <p className="text-sm text-text-secondary">{selectedReport.published_date}</p>
                </div>
              )}

              <div className="flex gap-3">
                <a href={selectedReport.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="primary" fullWidth icon={<ExternalLink className="w-4 h-4" />}>
                    Visit Source
                  </Button>
                </a>
              </div>
            </div>

            {/* Related Problems */}
            {relatedProblems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Related Problems</h3>
                <div className="space-y-3">
                  {relatedProblems.map((problem) => (
                    <Card key={problem.id} padding="md" hover>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{problem.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          size="sm"
                          className={getSeverityClasses(problem.severity)}
                        >
                          {problem.severity}
                        </Badge>
                        <span className="text-xs text-text-muted">{problem.category}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function getSeverityClasses(severity: string): string {
  const classes: Record<string, string> = {
    Critical: 'bg-red-500/10 text-red-500 border-red-500/25',
    High: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    Medium: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
    Low: 'bg-green-500/10 text-green-500 border-green-500/25',
  };
  return classes[severity] || classes.Medium;
}
