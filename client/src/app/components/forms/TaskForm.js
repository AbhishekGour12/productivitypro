'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { tasksAPI } from '../../lib/tasks';

const TaskForm = ({ initialData = null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Work',
        status: 'pending',
        priority: 'medium',
    });

    useEffect(() => {
        if (initialData) {
            setTask({
                ...initialData,
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const taskData = {
                ...task,
                dueDate: new Date(task.dueDate).toISOString()
            };

            if (initialData) {
                // Update existing task
                await tasksAPI.updateTask(initialData._id, taskData);
                toast.success('Task updated successfully!');
            } else {
                // Create new task
                await tasksAPI.createTask(taskData);
                toast.success('Task created successfully!');
            }
            
            router.push('/tasks');
            router.refresh(); // Refresh the page to show updated data
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error(error.message || 'Failed to save task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {initialData ? 'Update your task details' : 'Organize and track your tasks efficiently'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <Input 
                        name="title" 
                        value={task.title} 
                        onChange={handleChange} 
                        placeholder="e.g., Complete project proposal, Review documents"
                        required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200 resize-none"
                        placeholder="Describe the task in detail, including any specific requirements or steps..."
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date *
                        </label>
                        <Input 
                            type="date" 
                            name="dueDate" 
                            value={task.dueDate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <Select 
                            name="category" 
                            value={task.category} 
                            onChange={handleChange}
                        >
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Finance">Finance</option>
                            <option value="Other">Other</option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                        </label>
                        <Select 
                            name="status" 
                            value={task.status} 
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority *
                        </label>
                        <Select 
                            name="priority" 
                            value={task.priority} 
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button 
                        type="button" 
                        onClick={() => router.back()} 
                        variant="secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                        {initialData ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default TaskForm;