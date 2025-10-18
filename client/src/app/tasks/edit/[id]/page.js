'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/app/components/forms/TaskForm';
import Link from 'next/link';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { tasksAPI } from '../../../lib/tasks';
import toast from 'react-hot-toast';

export default function EditTaskPage({ params }) {
    const router = useRouter();
    const id = React.use(params)
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTaskData();
        console.log(id)
    }, [id]);

    const fetchTaskData = async () => {
        try {
            setIsLoading(true);
            const response = await tasksAPI.getTaskById(id.id);
        
            setTaskData(response);
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Failed to load task data');
            // router.push('/tasks');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!taskData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Task Not Found</h2>
                    <p className="text-gray-600 mb-4">The task you're trying to edit doesn't exist.</p>
                    <Link href="/tasks">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Back to Tasks
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-4">
                    <FaEdit className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Task</h1>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Update your task details and keep your progress on track.
                </p>
            </div>

            {/* Task Form */}
            <TaskForm initialData={taskData} />
        </div>
    );
}