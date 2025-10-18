'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaTags, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaClock, FaPlayCircle } from 'react-icons/fa';
import { tasksAPI } from '../../lib/tasks';
import toast from 'react-hot-toast';

const DetailItem = ({ icon: Icon, label, value, valueClass = 'text-gray-800' }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center text-sm text-gray-500 mb-2">
            <Icon className="mr-2" />
            <span className="font-medium">{label}</span>
        </div>
        <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FaClock, label: 'Pending' },
        'in-progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FaPlayCircle, label: 'In Progress' },
        completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: FaCheckCircle, label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
            <StatusIcon className="mr-1" />
            {config.label}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
        low: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Low' },
        medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium' },
        high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'High' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
            <FaExclamationTriangle className="mr-1" />
            {config.label} Priority
        </span>
    );
};

export default function TaskDetailsPage({ params }) {
    const router = useRouter();
    const id = React.use(params)
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setIsLoading(true);
            const response = await tasksAPI.getTaskById(id.id);
            setTask(response);
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Failed to load task details');
            router.push('/tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await tasksAPI.deleteTask(id.id);
            toast.success('Task deleted successfully');
            router.push('/tasks');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await tasksAPI.updateTaskStatus(id.id, newStatus);
            toast.success(`Task marked as ${newStatus}`);
            fetchTask(); // Refresh task data
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task status');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="text-center p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Task Not Found</h2>
                    <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
                    <Link href="/tasks">
                        <Button>Back to Tasks</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                    <Link 
                        href="/tasks" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <FaArrowLeft />
                        <span>Back to Tasks</span>
                    </Link>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Button 
                        onClick={() => handleStatusChange('completed')}
                        disabled={task.status === 'completed'}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                    >
                        <FaCheckCircle className="mr-2" />
                        Mark Complete
                    </Button>
                    <Link href={`/tasks/edit/${task._id}`}>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <FaEdit className="mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <FaTrash className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Task Details Card */}
            <Card className="border-l-4 border-l-blue-500">
                <div className="p-6">
                    {/* Task Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-3">{task.title}</h1>
                            <div className="flex flex-wrap gap-3">
                                <StatusBadge status={task.status} />
                                <PriorityBadge priority={task.priority} />
                            </div>
                        </div>
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <DetailItem 
                            icon={FaCalendarAlt} 
                            label="Due Date" 
                            value={formattedDate}
                            valueClass={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : 'text-gray-800'}
                        />
                        <DetailItem 
                            icon={FaTags} 
                            label="Category" 
                            value={task.category}
                        />
                    </div>

                    {/* Description */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            <FaInfoCircle className="mr-2" />
                            <span className="font-medium">Description</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {task.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    {task.status !== 'completed' && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                {task.status !== 'in-progress' && (
                                    <Button 
                                        onClick={() => handleStatusChange('in-progress')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <FaPlayCircle className="mr-2" />
                                        Start Task
                                    </Button>
                                )}
                                <Button 
                                    onClick={() => handleStatusChange('completed')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Mark Complete
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}