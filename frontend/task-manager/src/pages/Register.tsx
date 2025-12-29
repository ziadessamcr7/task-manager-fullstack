import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ApiError } from '../types';

const Register = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting registration with:', { name, email });
      
      const response = await authAPI.register(name, email, password);
      
      console.log('Full response received:', response);
      
      let token: string | undefined;
      
      if (typeof response === 'string') {
        token = response;
      } else if (response && typeof response === 'object') {
        token = 
          response.token || 
          (response as any).accessToken || 
          (response as any).access_token || 
          (response as any).authToken ||
          (response as any).data?.token ||
          (response as any).data?.accessToken;
      }
      
      if (!token || typeof token !== 'string') {
        console.error('Token not found in response!');
        console.error('Full response structure:', JSON.stringify(response, null, 2));
        setError('Registration successful but no token received. Check console for response structure.');
        return;
      }
      
      console.log('✅ Registration successful!');
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', response?.data?.user?.name || 'user name'); 
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 50);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      const apiError = err as ApiError;
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (!apiError.response) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running';
      } else if (apiError.response.status === 400) {
        errorMessage = 'Invalid name, email or password format';
      } else if (apiError.response.status === 409) {
        errorMessage = 'Email already exists';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Create account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account to get started
        </p>
  
        <form onSubmit={handleSubmit} className="space-y-5">
  
          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
  
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmed Azmy"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum 6 characters
            </p>
          </div>
  
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
  
          {/* Login link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
  
};

export default Register;