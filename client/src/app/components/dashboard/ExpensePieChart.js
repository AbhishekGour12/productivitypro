'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../ui/Card';

const data = [
  { name: 'Food', value: 400 },
  { name: 'Shopping', value: 300 },
  { name: 'Bills', value: 200 },
  { name: 'Travel', value: 278 },
  { name: 'Education', value: 189 },
];
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#00C49F'];

const ExpensePieChart = () => {
  return (
    <Card className='p-3'>
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default ExpensePieChart;