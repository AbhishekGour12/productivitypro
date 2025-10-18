import TaskForm from '@/app/components/forms/TaskForm';
import Link from 'next/link';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

export default function AddTaskPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/tasks"
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <FaArrowLeft />
                        <span>Back to Tasks</span>
                    </Link>
                </div>
            </div>

            {/* Page Title */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mb-4">
                    <FaPlus className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Create New Task</h1>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Add a new task to organize and track your work efficiently.
                </p>
            </div>

            {/* Task Form */}
            <TaskForm />
        </div>
    );
}