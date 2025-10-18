'use client';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import { FaEdit, FaTrash, FaEye, FaArrowUp, FaArrowDown, FaCreditCard, FaMoneyBill, FaMobile, FaWallet } from 'react-icons/fa';

const ExpenseCard = ({ expense, onDelete, onEdit }) => {
  const router = useRouter();
  const { _id, title, description, amount, type, category, paymentMethod, date, tags } = expense;
  const isIncome = type === 'income';

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card': return FaCreditCard;
      case 'cash': return FaMoneyBill;
      case 'upi': return FaMobile;
      case 'bank transfer': return FaWallet;
      default: return FaCreditCard;
    }
  };

  const PaymentIcon = getPaymentIcon(paymentMethod);

  const handleDelete = () => {
    onDelete(_id);
  };

  const handleEdit = () => {
    router.push(`/Expenses/edit/${_id}`);
  };

  const handleView = () => {
    router.push(`/Expenses/${_id}`);
  };

  return (
    <Card hover={true} className="flex flex-col justify-between h-full p-3">
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
              {isIncome ? <FaArrowUp /> : <FaArrowDown />}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
              <p className="text-sm text-gray-500">{category}</p>
            </div>
          </div>
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${isIncome
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
            {type}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Details */}
        <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Amount:</span>
            <span className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'
              }`}>
              {isIncome ? `+₹${amount}` : `-₹${amount}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Payment:</span>
            <span className="flex items-center space-x-1 text-gray-700">
              <PaymentIcon className="text-sm" />
              <span>{paymentMethod}</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Date:</span>
            <span className="text-gray-700">{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleView}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
            title="Edit Expense"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
            title="Delete Expense"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;