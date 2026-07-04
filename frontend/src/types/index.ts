/* ============================================
   TYPE DEFINITIONS
   Government Problem Finder
   ============================================ */

export interface Problem {
  id: number;
  title: string;
  description: string;
  category: string;
  state: string;
  affected_population: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  statistics: string | null;
  report_name: string | null;
  published_year: string | null;
  source: string;
  innovation_areas?: string[];
  already_in_db?: boolean;
  created_at: string;
}

export interface ProblemListResponse {
  problems: Problem[];
  total: number;
  page: number;
  page_size: number;
}

export interface LiveSearchRequest {
  query: string;
  bypass_db?: boolean;
}

export interface LiveSearchResponse {
  problems: Problem[];
  total: number;
  source: 'database' | 'live_search';
  query: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  problems_count: number;
  icon: string;
  published_date?: string;
}

export interface DashboardStats {
  total_problems: number;
  total_reports: number;
  total_sources: number;
  states_covered: number;
  categories: number;
  problems_by_category: ChartDataItem[];
  problems_by_state: ChartDataItem[];
  problems_by_severity: ChartDataItem[];
  recent_problems: Problem[];
}

export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  sources: string[];
}

export interface FilterOptions {
  category?: string;
  state?: string;
  severity?: string;
  year?: string;
  ministry?: string;
  sortBy?: 'newest' | 'severity' | 'frequency' | 'impact';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
  color: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
}

export interface BookmarkItem {
  id: string;
  type: 'problem' | 'report';
  item: Problem | Report;
  savedAt: Date;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

export type ViewMode = 'grid' | 'list';

export type ThemeMode = 'dark' | 'light';
