'use client';
import { useState, useEffect } from 'react';
import TaskCard from '../components/tasks/TaskCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FaPlus, FaFilter, FaSearch, FaSort, FaSync } from 'react-icons/fa';
import { tasksAPI } from '../lib/tasks';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        category: '',
        page: 1,
        limit: 6
    });
    const [totalPage, setTotalPage] = useState();
    const [total, setTotal]  = useState()

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await tasksAPI.getTasks(filters);
            setTasks(response.tasks);
           
            setTotalPage(response.totalPages)
            setTotal(response.totalTasks)
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleSearch = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value,
            page: 1
        }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: value
        }));
    };

    const handleDeleteTask = async (id) => {

        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await tasksAPI.deleteTask(id);
            toast.success('Task deleted successfully');
            fetchTasks(); // Refresh the list
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            router.push(`tasks/edit/${id}`)
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task status');
        }
    };

    const handleRefresh = () => {
        fetchTasks();
    };
    const detailPage = (id) => {
        router.push(`tasks/${id}`)

    }

    return (
        <>
            <Header />
            <div className="space-y-6 p-3">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
                        <p className="text-gray-600 mt-2">Organize, track, and complete your tasks efficiently.</p>
                    </div>
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => { router.push('/tasks/add') }}
                        >
                            <FaPlus className="mr-2" />
                            Add New Task
                        </Button>
                        <Button
                            className="bg-gray-600 hover:bg-gray-700 border border-gray-600"
                            onClick={handleRefresh}
                            isLoading={isLoading}
                        >
                            <FaSync className="mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-100">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 w-full">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={filters.search}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                            {total} tasks
                        </div>
                    </div>
                </Card>

                {/* Tasks Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                    onDetail={detailPage}
                                />
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <Card className="text-center py-12">
                                <p className="text-gray-500 text-lg">No tasks found</p>
                                <p className="text-gray-400 mt-2">Try adjusting your filters or create a new task.</p>
                            </Card>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">1-{tasks.length}</span> of{' '}
                                <span className="font-semibold">{tasks.length}</span> tasks
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                    disabled={filters.page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex space-x-1">
  {Array.from({ length: totalPage }, (_, i) => i + 1).map(page => (
    <button
      key={page}
      onClick={() => handleFilterChange('page', page)}
      className={`w-10 h-10 rounded-lg font-medium ${
        page === filters.page
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {page}
    </button>
  ))}
</div>

                                <Button
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                        
                      
                    </>
                    
                )}
            </div>

        </>
    );
}