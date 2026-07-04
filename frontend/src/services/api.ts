import axios, { type AxiosInstance } from 'axios';
import type {
  Problem,
  ProblemListResponse,
  LiveSearchRequest,
  LiveSearchResponse,
  Report,
  DashboardStats,
  ChatRequest,
  ChatResponse,
  FilterOptions,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// PROBLEMS API
// ============================================

export const problemsApi = {
  /** Get paginated list of problems with optional filters */
  getProblems: async (filters?: FilterOptions): Promise<ProblemListResponse> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sort_by', filters.sortBy);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('page_size', String(filters.pageSize));

    const { data } = await apiClient.get<ProblemListResponse>(`/problems?${params}`);
    return data;
  },

  /** Get a single problem by ID */
  getProblem: async (id: number): Promise<Problem> => {
    const { data } = await apiClient.get<Problem>(`/problems/${id}`);
    return data;
  },

  /** Live search - scrapes government sites and extracts problems */
  liveSearch: async (query: string, bypassDb: boolean = false): Promise<LiveSearchResponse> => {
    const body: LiveSearchRequest = { query, bypass_db: bypassDb };
    const { data } = await apiClient.post<LiveSearchResponse>('/problems/live-search', body);
    return data;
  },
};

// ============================================
// REPORTS API
// ============================================

export const reportsApi = {
  /** Get all government report sources */
  getReports: async (): Promise<Report[]> => {
    const { data } = await apiClient.get<Report[]>('/reports');
    return data;
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  /** Get dashboard statistics */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>('/dashboard');
    return data;
  },
};

// ============================================
// CHAT API
// ============================================

export const chatApi = {
  /** Send a message to the AI assistant */
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const body: ChatRequest = { message };
    const { data } = await apiClient.post<ChatResponse>('/chat', body);
    return data;
  },
};

export default apiClient;
