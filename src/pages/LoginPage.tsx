
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple login logic (in a real app, this would use proper authentication)
    if (username === 'admin' && password === 'admin123') {
      // Admin login
      setTimeout(() => {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Welcome, Admin!');
        navigate('/admin');
        setIsLoading(false);
      }, 1000);
    } else if (username === 'user' && password === 'user123') {
      // User login
      setTimeout(() => {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Login successful!');
        navigate('/');
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast.error('Invalid username or password');
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-casino-dark p-4">
      <div className="w-full max-w-md bg-card border border-casino-purple-dark rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-casino-gold mb-2">Gala Casino</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted border-casino-purple-dark"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-casino-purple-dark"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="btn-gold w-full py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>Demo accounts:</p>
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
