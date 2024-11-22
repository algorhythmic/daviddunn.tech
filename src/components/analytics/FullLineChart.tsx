'use client';

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from 'next-themes';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 400 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 350 },
];

export function FullLineChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a3a3a3' : '#737373';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <XAxis 
          dataKey="name" 
          stroke={textColor} 
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="text-sm font-medium">{payload[0].value}</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          stroke="#22c55e"
          dot={true}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
