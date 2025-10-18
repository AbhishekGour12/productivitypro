import Card from '../ui/Card';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ title, value, change, icon: Icon, color, bgColor, trend }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <p className={`text-2xl font-bold ${color} `}>{value}</p>
                        {change && (
                            <p className={`text-sm font-medium mt-1 flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                {change}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${bgColor}`}>
                        <Icon className={`text-xl  ${color}`} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;