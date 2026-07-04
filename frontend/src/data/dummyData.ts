/* ============================================
   DUMMY DATA
   Government Problem Finder
   Realistic mock data for development
   ============================================ */

import type { Problem, Report, DashboardStats, Category, SearchHistoryItem } from '../types';

// ============================================
// PROBLEMS
// ============================================

export const dummyProblems: Problem[] = [
  {
    id: 1,
    title: 'Severe Teacher Shortage in Rural Government Schools',
    description: 'Over 1 million teaching positions remain vacant across government schools in rural India. States like Uttar Pradesh, Bihar, and Jharkhand face the worst shortages, with single-teacher schools being common in remote areas. This has led to declining learning outcomes and increased dropout rates.',
    category: 'Education',
    state: 'India',
    affected_population: 'Rural Students (150 Million)',
    severity: 'Critical',
    statistics: '1.06 million teacher vacancies; 11.4% single-teacher schools in rural areas',
    report_name: 'UDISE+ Report 2023-24',
    published_year: '2024',
    source: 'https://education.gov.in/udise',
    created_at: '2024-12-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Inadequate Primary Healthcare Infrastructure',
    description: 'India faces a significant shortage of primary health centers, community health centers, and sub-centers, especially in tribal and rural areas. Many existing facilities lack essential infrastructure including running water, electricity, and basic medical equipment.',
    category: 'Healthcare',
    state: 'India',
    affected_population: 'Rural Population (900 Million)',
    severity: 'Critical',
    statistics: '22% PHCs without a doctor; 30% CHCs without specialists',
    report_name: 'Rural Health Statistics 2023-24',
    published_year: '2024',
    source: 'https://mohfw.gov.in/statistics',
    created_at: '2024-11-20T08:15:00Z',
  },
  {
    id: 3,
    title: 'Rising Air Pollution in Urban Centers',
    description: 'Air quality in major Indian cities consistently exceeds WHO safe limits. Delhi, Mumbai, Kolkata, and other metros experience hazardous AQI levels during winter months, leading to respiratory diseases, reduced life expectancy, and economic losses.',
    category: 'Environment',
    state: 'Delhi',
    affected_population: 'Urban Population (500 Million)',
    severity: 'High',
    statistics: 'Delhi AQI exceeds 400+ during winters; 1.67 million deaths annually from air pollution',
    report_name: 'CPCB Air Quality Report 2024',
    published_year: '2024',
    source: 'https://cpcb.nic.in/air-quality',
    created_at: '2024-10-05T14:00:00Z',
  },
  {
    id: 4,
    title: 'Digital Divide in Agricultural Information Access',
    description: 'Farmers in remote areas lack access to critical agricultural information including weather forecasts, market prices, and modern farming techniques. Limited internet connectivity and digital literacy hinder the adoption of agri-tech solutions.',
    category: 'Agriculture',
    state: 'India',
    affected_population: 'Small & Marginal Farmers (126 Million)',
    severity: 'High',
    statistics: 'Only 8.7% farmers access digital agricultural services; 47% rely on traditional methods',
    report_name: 'Agriculture Census 2023',
    published_year: '2023',
    source: 'https://agcensus.dacnet.nic.in',
    created_at: '2024-09-12T09:45:00Z',
  },
  {
    id: 5,
    title: 'Road Safety Crisis and Traffic Fatalities',
    description: 'India accounts for approximately 11% of global road accident deaths despite having only 1% of the worlds vehicles. Poor road infrastructure, inadequate enforcement of traffic laws, and lack of emergency response systems contribute to the crisis.',
    category: 'Transport',
    state: 'India',
    affected_population: 'All Road Users',
    severity: 'Critical',
    statistics: '1.68 lakh deaths in 2023; 4.61 lakh injuries; pedestrians and two-wheelers most affected',
    report_name: 'Road Accidents in India 2023',
    published_year: '2024',
    source: 'https://morth.nic.in/road-accident-data',
    created_at: '2024-08-28T11:00:00Z',
  },
  {
    id: 6,
    title: 'Rising NPA Crisis in Public Sector Banks',
    description: 'Non-performing assets in public sector banks remain a significant concern despite recent improvements. Agricultural loans and MSME sector loans have the highest default rates, threatening financial stability and credit availability.',
    category: 'Finance',
    state: 'India',
    affected_population: 'Banking System & MSMEs',
    severity: 'High',
    statistics: 'NPA ratio at 3.2% for PSBs; ₹5.71 lakh crore in gross NPAs',
    report_name: 'RBI Financial Stability Report 2024',
    published_year: '2024',
    source: 'https://rbi.org.in/financial-stability',
    created_at: '2024-07-15T16:30:00Z',
  },
  {
    id: 7,
    title: 'Increasing Cybercrime and Digital Fraud',
    description: 'India has witnessed a sharp rise in cybercrimes including online fraud, identity theft, and phishing attacks. The number of cases has increased by 24% year-over-year, with financial fraud being the most prevalent category.',
    category: 'Technology',
    state: 'India',
    affected_population: 'Internet Users (800 Million)',
    severity: 'High',
    statistics: '11.28 lakh cyber complaints in 2023; ₹10,319 crore lost to cyber fraud',
    report_name: 'NCRB Crime in India 2023',
    published_year: '2024',
    source: 'https://ncrb.gov.in/crime-in-india',
    created_at: '2024-06-20T13:00:00Z',
  },
  {
    id: 8,
    title: 'Malnutrition Among Children Under Five',
    description: 'Despite national nutrition programs, a significant percentage of Indian children under five years suffer from stunting, wasting, and underweight conditions. The problem is particularly acute in tribal areas and urban slums.',
    category: 'Healthcare',
    state: 'India',
    affected_population: 'Children Under 5 (120 Million)',
    severity: 'Critical',
    statistics: '35.5% stunted; 19.3% wasted; 32.1% underweight among children under 5',
    report_name: 'NFHS-5 Report',
    published_year: '2023',
    source: 'https://mohfw.gov.in/nfhs',
    created_at: '2024-05-10T07:45:00Z',
  },
  {
    id: 9,
    title: 'Groundwater Depletion in Agricultural States',
    description: 'Excessive groundwater extraction for irrigation has led to critically low water tables in major agricultural states. Punjab, Haryana, Rajasthan, and Tamil Nadu face the most severe groundwater depletion, threatening future agricultural viability.',
    category: 'Environment',
    state: 'Punjab',
    affected_population: 'Farming Communities (50 Million)',
    severity: 'Critical',
    statistics: '1,186 blocks classified as over-exploited; groundwater table dropping 1-3 meters per year',
    report_name: 'CGWB Annual Report 2023-24',
    published_year: '2024',
    source: 'https://cgwb.gov.in/annual-report',
    created_at: '2024-04-18T10:00:00Z',
  },
  {
    id: 10,
    title: 'Urban Housing Shortage for EWS Categories',
    description: 'India faces a severe shortage of affordable housing in urban areas, particularly for Economically Weaker Sections (EWS) and Lower Income Groups (LIG). High land costs and construction prices make homeownership unattainable for millions.',
    category: 'Infrastructure',
    state: 'India',
    affected_population: 'Urban EWS/LIG Families (18.78 Million)',
    severity: 'High',
    statistics: '18.78 million urban housing shortage; 95% in EWS category',
    report_name: 'PMAY-Urban Progress Report',
    published_year: '2024',
    source: 'https://pmaymis.gov.in',
    created_at: '2024-03-25T12:30:00Z',
  },
  {
    id: 11,
    title: 'Dropout Rate in Secondary Education',
    description: 'Significant number of students drop out at the secondary school level due to economic pressures, lack of accessible schools, and socio-cultural factors. Girls from marginalized communities are disproportionately affected.',
    category: 'Education',
    state: 'India',
    affected_population: 'Secondary School Students',
    severity: 'High',
    statistics: '12.6% dropout rate at secondary level; higher for SC/ST students at 17.3%',
    report_name: 'UDISE+ Dashboard 2023-24',
    published_year: '2024',
    source: 'https://dashboard.udiseplus.gov.in',
    created_at: '2024-02-14T09:00:00Z',
  },
  {
    id: 12,
    title: 'Inadequate Waste Management in Tier-2 Cities',
    description: 'Most tier-2 and tier-3 cities lack proper solid waste management infrastructure. Open dumping, inadequate recycling facilities, and poor waste segregation at source lead to environmental and health hazards.',
    category: 'Environment',
    state: 'India',
    affected_population: 'Urban Population in Tier-2/3 Cities (200 Million)',
    severity: 'Medium',
    statistics: 'Only 22% waste processed scientifically; 62,000 tonnes/day dumped in landfills',
    report_name: 'SBM-Urban 2.0 Report',
    published_year: '2023',
    source: 'https://sbm.gov.in/sbm-dashboard',
    created_at: '2024-01-08T15:00:00Z',
  },
];

// ============================================
// CATEGORIES
// ============================================

export const categories: Category[] = [
  { name: 'Healthcare', icon: 'Heart', count: 3420, color: '#EF4444' },
  { name: 'Education', icon: 'GraduationCap', count: 2890, color: '#3B82F6' },
  { name: 'Agriculture', icon: 'Sprout', count: 1750, color: '#22C55E' },
  { name: 'Transport', icon: 'Car', count: 1420, color: '#F59E0B' },
  { name: 'Finance', icon: 'IndianRupee', count: 1180, color: '#8B5CF6' },
  { name: 'Environment', icon: 'Leaf', count: 2340, color: '#10B981' },
  { name: 'Technology', icon: 'Cpu', count: 890, color: '#06B6D4' },
  { name: 'Infrastructure', icon: 'Building2', count: 1560, color: '#F97316' },
];

// ============================================
// REPORTS
// ============================================

export const dummyReports: Report[] = [
  {
    id: 'niti-aayog',
    name: 'NITI Aayog',
    description: 'National Institution for Transforming India — policy think tank providing strategic guidance on matters of national importance.',
    url: 'https://niti.gov.in',
    category: 'Policy',
    problems_count: 342,
    icon: 'Landmark',
    published_date: '2024',
  },
  {
    id: 'who-india',
    name: 'WHO India',
    description: 'World Health Organization India country office — health data, disease surveillance, and public health policy guidance.',
    url: 'https://www.who.int/india',
    category: 'Healthcare',
    problems_count: 289,
    icon: 'HeartPulse',
    published_date: '2024',
  },
  {
    id: 'world-bank',
    name: 'World Bank',
    description: 'World Bank India data and development reports covering poverty, education, infrastructure, and economic indicators.',
    url: 'https://data.worldbank.org/country/india',
    category: 'Development',
    problems_count: 456,
    icon: 'Globe',
    published_date: '2024',
  },
  {
    id: 'education-ministry',
    name: 'Ministry of Education',
    description: 'Government of India Ministry of Education — UDISE+, AISHE data, education policies, and institutional statistics.',
    url: 'https://education.gov.in',
    category: 'Education',
    problems_count: 198,
    icon: 'GraduationCap',
    published_date: '2024',
  },
  {
    id: 'health-ministry',
    name: 'Ministry of Health',
    description: 'Ministry of Health and Family Welfare — public health data, NFHS, disease surveillance, and healthcare infrastructure reports.',
    url: 'https://mohfw.gov.in',
    category: 'Healthcare',
    problems_count: 367,
    icon: 'Stethoscope',
    published_date: '2024',
  },
  {
    id: 'rbi',
    name: 'Reserve Bank of India',
    description: 'Central banking institution — financial stability reports, monetary policy data, banking statistics, and economic surveys.',
    url: 'https://rbi.org.in',
    category: 'Finance',
    problems_count: 145,
    icon: 'Banknote',
    published_date: '2024',
  },
  {
    id: 'ncrb',
    name: 'NCRB',
    description: 'National Crime Records Bureau — comprehensive crime statistics, cyber crime data, and law enforcement reports for India.',
    url: 'https://ncrb.gov.in',
    category: 'Safety',
    problems_count: 234,
    icon: 'Shield',
    published_date: '2024',
  },
  {
    id: 'census-india',
    name: 'Census of India',
    description: 'Registrar General and Census Commissioner — population data, demographic statistics, and socio-economic indicators.',
    url: 'https://censusindia.gov.in',
    category: 'Demographics',
    problems_count: 178,
    icon: 'Users',
    published_date: '2024',
  },
];

// ============================================
// DASHBOARD STATS
// ============================================

export const dummyDashboardStats: DashboardStats = {
  total_problems: 15420,
  total_reports: 3200,
  total_sources: 28,
  states_covered: 36,
  categories: 18,
  problems_by_category: [
    { name: 'Healthcare', value: 3420, color: '#EF4444' },
    { name: 'Education', value: 2890, color: '#3B82F6' },
    { name: 'Environment', value: 2340, color: '#10B981' },
    { name: 'Agriculture', value: 1750, color: '#22C55E' },
    { name: 'Infrastructure', value: 1560, color: '#F97316' },
    { name: 'Transport', value: 1420, color: '#F59E0B' },
    { name: 'Finance', value: 1180, color: '#8B5CF6' },
    { name: 'Technology', value: 890, color: '#06B6D4' },
  ],
  problems_by_state: [
    { name: 'Uttar Pradesh', value: 2340 },
    { name: 'Bihar', value: 1890 },
    { name: 'Maharashtra', value: 1560 },
    { name: 'Madhya Pradesh', value: 1420 },
    { name: 'Rajasthan', value: 1280 },
    { name: 'Tamil Nadu', value: 1150 },
    { name: 'Karnataka', value: 980 },
    { name: 'West Bengal', value: 870 },
    { name: 'Telangana', value: 760 },
    { name: 'Gujarat', value: 720 },
  ],
  problems_by_severity: [
    { name: 'Critical', value: 4200, color: '#EF4444' },
    { name: 'High', value: 5800, color: '#F59E0B' },
    { name: 'Medium', value: 3600, color: '#3B82F6' },
    { name: 'Low', value: 1820, color: '#22C55E' },
  ],
  recent_problems: [],
};

// Populate recent_problems with first 5
dummyDashboardStats.recent_problems = dummyProblems.slice(0, 5);

// ============================================
// SEARCH HISTORY
// ============================================

export const dummySearchHistory: SearchHistoryItem[] = [
  { id: '1', query: 'Education problems in India', timestamp: new Date('2024-12-14'), resultsCount: 24 },
  { id: '2', query: 'Healthcare issues rural areas', timestamp: new Date('2024-12-13'), resultsCount: 18 },
  { id: '3', query: 'Water scarcity problems', timestamp: new Date('2024-12-12'), resultsCount: 31 },
  { id: '4', query: 'Traffic accidents India 2024', timestamp: new Date('2024-12-11'), resultsCount: 12 },
  { id: '5', query: 'Agricultural distress farmers', timestamp: new Date('2024-12-10'), resultsCount: 27 },
];

// ============================================
// STATES LIST
// ============================================

export const indianStates = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// ============================================
// SEVERITY OPTIONS
// ============================================

export const severityOptions = ['Critical', 'High', 'Medium', 'Low'] as const;

// ============================================
// YEARS
// ============================================

export const yearOptions = ['2025', '2024', '2023', '2022', '2021', '2020'];

// ============================================
// SORT OPTIONS
// ============================================

export const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'severity', label: 'Most Severe' },
  { value: 'frequency', label: 'Most Frequent' },
  { value: 'impact', label: 'Most Impactful' },
];

// ============================================
// AI CHAT EXAMPLES
// ============================================

export const chatExamples = [
  'What are the biggest education problems in India?',
  'Healthcare issues in Telangana',
  'Traffic problems in Hyderabad',
  'Water scarcity statistics',
  'Environmental pollution in Delhi',
  'Agriculture crisis in Punjab',
];
