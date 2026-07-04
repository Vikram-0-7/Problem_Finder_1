import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  Clock,
} from 'lucide-react';
import StatsCard from '../components/cards/StatsCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import BarChartComponent from '../components/charts/BarChart';
import PieChartComponent from '../components/charts/PieChart';
import LineChartComponent from '../components/charts/LineChart';
import { dummyDashboardStats } from '../data/dummyData';
import { getSeverityColor, formatNumber } from '../utils';
import { useInView, useCountUp } from '../hooks';
import { dashboardApi, reportsApi } from '../services/api';
import type { DashboardStats } from '../types';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Mock monthly trend data
const monthlyTrend = [
  { name: 'Jan', value: 820 },
  { name: 'Feb', value: 960 },
  { name: 'Mar', value: 1120 },
  { name: 'Apr', value: 1050 },
  { name: 'May', value: 1280 },
  { name: 'Jun', value: 1450 },
  { name: 'Jul', value: 1380 },
  { name: 'Aug', value: 1520 },
  { name: 'Sep', value: 1670 },
  { name: 'Oct', value: 1890 },
  { name: 'Nov', value: 2050 },
  { name: 'Dec', value: 2240 },
];



function StatWithCountUp({ label, end, suffix, icon, color }: { label: string; end: number; suffix: string; icon: string; color: string }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(end, 2000, inView);
  return (
    <div ref={ref}>
      <StatsCard label={label} value={`${count.toLocaleString()}${suffix}`} icon={icon} color={color} />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [topMinistries, setTopMinistries] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    document.title = 'Dashboard — Government Problem Finder';
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardApi.getStats();
        setStats(res);
        try {
          const reports = await reportsApi.getReports();
          const sorted = reports
            .map((r) => ({ name: r.name, count: r.problems_count }))
            .sort((a, b) => b.count - a.count);
          setTopMinistries(sorted);
        } catch (e) {
          console.error('Failed to load reports for top ministries', e);
          setTopMinistries([
            { name: 'Ministry of Health', count: 1 },
            { name: 'Ministry of Education', count: 1 },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats, using mock fallback', err);
        setStats(dummyDashboardStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const [statsRef, statsInView] = useInView(0.1);

  if (loading || !stats) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-primary/20 animate-spin mb-4"></div>
          <p className="text-text-secondary font-medium">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-text-secondary">
            Real-time analytics and insights from government problem data across India.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
          variants={stagger}
          initial="initial"
          animate={statsInView ? 'animate' : 'initial'}
        >
          <motion.div variants={fadeUp}>
            <StatWithCountUp label="Total Problems" end={stats.total_problems} suffix="" icon="AlertTriangle" color="#EF4444" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatWithCountUp label="Reports" end={stats.total_reports} suffix="" icon="FileText" color="#3B82F6" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatWithCountUp label="Sources" end={stats.total_sources} suffix="" icon="Globe" color="#22C55E" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatWithCountUp label="States" end={stats.states_covered} suffix="" icon="MapPin" color="#F59E0B" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatWithCountUp label="Categories" end={stats.categories} suffix="" icon="Layers" color="#8B5CF6" />
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <BarChartComponent data={stats.problems_by_category} title="Problems by Category" height={300} />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <PieChartComponent data={stats.problems_by_severity} title="Problems by Severity" height={300} />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <BarChartComponent data={stats.problems_by_state} title="Problems by State" height={300} />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <LineChartComponent data={monthlyTrend} title="Monthly Trend (2024)" height={300} />
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Problems
                </h3>
                <Link to="/discover" className="text-sm text-primary hover:text-primary-light transition-colors">
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {stats.recent_problems.slice(0, 5).map((problem, i) => (
                  <Link
                    key={problem.id}
                    to={`/problems/${problem.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center flex-shrink-0 text-sm font-bold text-text-muted border border-border">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {problem.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" size="sm" className={getSeverityColor(problem.severity)}>
                          {problem.severity}
                        </Badge>
                        <span className="text-xs text-text-muted">{problem.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Ministries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Top Ministries</h3>
              </div>

              <div className="space-y-4">
                {topMinistries.map((ministry, i) => {
                  const maxCount = topMinistries[0]?.count || 1;
                  const percentage = maxCount > 0 ? (ministry.count / maxCount) * 100 : 0;

                  return (
                    <div key={ministry.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary truncate max-w-[70%]">{ministry.name}</span>
                        <span className="text-sm font-semibold text-text-secondary">{formatNumber(ministry.count)}</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
