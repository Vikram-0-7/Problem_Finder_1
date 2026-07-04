import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ============================================
   BAR CHART COMPONENT
   Dark-themed Recharts bar chart
   ============================================ */

interface BarChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartDataItem[];
  title?: string;
  height?: number;
}

const defaultColor = '#FF6A00';

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: BarChartDataItem }[];
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

const BarChart = ({ data, title, height = 350 }: BarChartProps) => {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,106,0,0.05)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColor}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
