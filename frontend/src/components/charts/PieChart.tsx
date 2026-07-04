import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/* ============================================
   PIE CHART COMPONENT
   Dark-themed Recharts pie chart with legend
   ============================================ */

interface PieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartDataItem[];
  title?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: PieChartDataItem }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-white mb-1">{item.name}</p>
      <p className="text-sm text-text-secondary">
        Value:{' '}
        <span className="font-bold" style={{ color: item.payload.color || '#FF6A00' }}>
          {item.value.toLocaleString()}
        </span>
      </p>
    </div>
  );
};

interface CustomLegendProps {
  payload?: { value: string; color: string }[];
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-text-secondary">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color || '#FF6A00' }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ data, title, height = 350 }: PieChartProps) => {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#FF6A00'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
