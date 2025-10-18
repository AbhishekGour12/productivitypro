'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaRocket, FaUser } from 'react-icons/fa';
import { FiShield } from 'react-icons/fi';
import { authAPI } from './lib/auth';
import api from './lib/api';

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();


    //setIsLoading(true);


    try {

      // const response = await authAPI.login(formData);

      const response = await api.post('/auth/login', { email: formData.email, password: formData.password });

      // Store tokens and user data
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      //Update Redux store
      dispatch(loginSuccess(response.data.user));

      toast.success(`Welcome back, ${response.data.user.username}!`);
      router.push('/dashboard')

      // Redirect based on role

    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }


  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <FaRocket className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ProductivityPro</h1>
          <p className="text-blue-100">
            Welcome back! Please login to your account.
          </p>
        </div>

        <div className="p-8">
          <form id="login-form" className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={FaEnvelope}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                icon={FaLock}
                placeholder="Enter your password"
                required
              />
            </div>



            <Button

              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              isLoading={isLoading}
              onClick={handleLogin}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="Register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
