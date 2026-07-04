import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

/* ============================================
   LINE CHART COMPONENT
   Dark-themed Recharts line chart with gradient fill
   ============================================ */

interface LineChartDataItem {
  name: string;
  value: number;
}

interface LineChartProps {
  data: LineChartDataItem[];
  title?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      <p className="text-sm text-text-secondary">
        Value:{' '}
        <span className="font-bold text-primary">
          {payload[0].value.toLocaleString()}
        </span>
      </p>
    </div>
  );
};

const LineChart = ({ data, title, height = 350 }: LineChartProps) => {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6A00" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FF6A00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#A8A8A8', fontSize: 12 }}
            axisLine={{ stroke: '#2A2A2A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#A8A8A8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FF6A00"
            strokeWidth={2.5}
            fill="url(#lineChartGradient)"
            dot={{ fill: '#FF6A00', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: '#FF6A00', strokeWidth: 2, stroke: '#0B0B0B', r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
