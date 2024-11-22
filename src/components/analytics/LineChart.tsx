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

export function LineChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a3a3a3' : '#737373';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <text 
          x={0} 
          y={10} 
          textAnchor="start" 
          dominantBaseline="hanging"
          className="text-[8px] fill-current text-muted-foreground"
        >
          Visitors
        </text>
        <XAxis 
          dataKey="name" 
          stroke={textColor} 
          fontSize={8}
          tickLine={false}
          axisLine={true}
          tick={{ fontSize: 8 }}
        />
        <YAxis
          stroke={textColor}
          fontSize={8}
          tickLine={false}
          axisLine={true}
          width={15}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-1 shadow-sm">
                  <div className="text-[10px] font-medium">{payload[0].value} visitors</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={1.5}
          stroke="#22c55e"
          dot={true}
          activeDot={{ r: 3 }}
          isAnimationActive={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
