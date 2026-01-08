import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface MatchGaugeProps {
  score: number;
}

const MatchGauge: React.FC<MatchGaugeProps> = ({ score }) => {
  const data = [{ name: 'score', value: score }];
  
  const getColor = (val: number) => {
    if (val >= 80) return '#10B981'; // Emerald 500
    if (val >= 50) return '#F59E0B'; // Amber 500
    return '#EF4444'; // Red 500
  };

  const circleColor = getColor(score);

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: '#E5E7EB' }} // gray-200
            dataKey="value"
            cornerRadius={30} // Rounded ends
            fill={circleColor}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold text-stone-700">{score}%</span>
        <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">Match</span>
      </div>
    </div>
  );
};

export default MatchGauge;
