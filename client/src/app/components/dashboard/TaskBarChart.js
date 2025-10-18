'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TaskBarChart = ({ completed = 8, pending = 5, inProgress = 2 }) => {
    const data = [
        { name: 'Completed', value: completed, color: '#10B981' },
        { name: 'In Progress', value: inProgress, color: '#3B82F6' },
        { name: 'Pending', value: pending, color: '#F59E0B' },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-gray-600">
                        Tasks: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBarChart;