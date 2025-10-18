'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaRocket, FaCheck, FaEye, FaEyeSlash, FaCrown, FaUsers } from 'react-icons/fa';
import { authAPI } from '../lib/auth';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user', // Default role
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        } else if (!['user', 'admin'].includes(formData.role)) {
            newErrors.role = 'Please select a valid role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);

        try {
            const registrationData = {
                username: formData.fullName.trim(),
                email: formData.email.toLowerCase(),
                password: formData.password,
                role: formData.role // Include role in registration data
            };

            const response = await authAPI.register(registrationData);

            toast.success('Account created successfully!');

            // Auto-login after successful registration
            try {
                const loginResponse = await authAPI.login({
                    email: formData.email.toLowerCase(),
                    password: formData.password
                });

                // Store tokens and user data
                localStorage.setItem('accessToken', loginResponse.data.accessToken);
                localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

                toast.success(`Welcome, ${loginResponse.data.user.name}!`);

                // Redirect based on role
                if (formData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } catch (loginError) {
                // If auto-login fails, redirect to login page
                toast.success('Account created! Please login to continue.');
                router.push('/');
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.message?.includes('already exists') || error.message?.includes('email')) {
                setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
                toast.error('This email address is already registered.');
            } else {
                toast.error(error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 py-8 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-4 border border-white/30">
                            <FaRocket className="text-4xl text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Join ProductivityPro</h1>
                        <p className="text-blue-100 text-lg">Start your journey to better productivity</p>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Full Name *
                            </label>
                            <Input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                icon={FaUser}
                                placeholder="Enter your full name"
                                required
                                error={errors.fullName}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Email Address *
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={FaEnvelope}
                                placeholder="Enter your email"
                                required
                                error={errors.email}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Account Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                                    className={`p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${formData.role === 'user'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <FaUsers className={`text-2xl ${formData.role === 'user' ? 'text-blue-600' : 'text-gray-400'
                                        }`} />
                                    <span className="font-medium">User</span>
                                    <p className="text-xs text-center text-gray-500">
                                        Regular user account
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                                    className={`p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${formData.role === 'admin'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <FaCrown className={`text-2xl ${formData.role === 'admin' ? 'text-purple-600' : 'text-gray-400'
                                        }`} />
                                    <span className="font-medium">Admin</span>
                                    <p className="text-xs text-center text-gray-500">
                                        Administrator account
                                    </p>
                                </button>
                            </div>
                            {errors.role && (
                                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Password *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    icon={FaLock}
                                    placeholder="Create a password (min. 6 characters)"
                                    required
                                    error={errors.password}
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    icon={FaCheck}
                                    placeholder="Confirm your password"
                                    required
                                    error={errors.confirmPassword}
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Simple Password Hint */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <p className="text-xs text-blue-700">
                                <strong>Password tip:</strong> Use at least 6 characters for your password.
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            isLoading={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/"
                                className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}