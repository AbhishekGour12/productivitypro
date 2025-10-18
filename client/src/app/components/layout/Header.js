'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '@/app/store/features/authSlice';
import toast from 'react-hot-toast';
import {
    FaChartBar,
    FaWallet,
    FaTasks,
    FaUserShield,
    FaSignOutAlt,
    FaBell,
    FaCog,
    FaRocket
} from 'react-icons/fa';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        dispatch(logoutSuccess());
        localStorage.removeItem('token');
        
        toast.success('Logged out successfully!');
        router.push('/Login');
    };

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: FaChartBar },
        { href: '/Expenses', label: 'Expenses', icon: FaWallet },
        { href: '/tasks', label: 'Tasks', icon: FaTasks },
    ];

    if (user?.role === 'admin') {
        navLinks.push({ href: '/(main)/admin', label: 'Admin', icon: FaUserShield });
    }

    const getLinkClass = (href) => {
        const isActive = pathname === href || (href !== '/(main)/dashboard' && pathname.startsWith(href));
        return `flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`;
    };

    return (
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/(main)/dashboard" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <FaRocket className="text-lg" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">ProductivityPro</h1>
                            <p className="text-xs text-gray-500">Welcome, {user?.name || 'User'}</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={getLinkClass(link.href)}
                            >
                                <link.icon className="h-4 w-4" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            <FaBell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                       

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            title="Logout"
                        >
                            <FaSignOutAlt className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;