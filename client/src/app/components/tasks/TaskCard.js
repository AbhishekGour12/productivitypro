import Card from '../ui/Card';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const TaskCard = ({ task, onDelete, onStatusChange, onDetail }) => {
  const { title, description, status, priority, category, dueDate } = task;

  const priorityClasses = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="flex flex-col justify-between p-3">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${priorityClasses[priority]}`}>
            {priority}
          </span>
        </div>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
      </div>
      <div>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-md">{status}</span>
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{category}</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="flex justify-between text-sm">
            <span className="font-medium text-text-secondary">Due:</span>
            <span>{dueDate}</span>
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="p-2 text-gray-500 hover:text-blue-600"><FaEye onClick={() =>{onDetail(task._id)}} /></button>
          <button className="p-2 text-gray-500 hover:text-yellow-600"><FaEdit onClick={() =>{onStatusChange(task._id)}} /></button>
          <button className="p-2 text-gray-500 hover:text-red-600" onClick={() => {onDelete(task._id)}}><FaTrash /></button>
        </div>
      </div>
    </Card>
  );
};
export default TaskCard;