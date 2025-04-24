
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  
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
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    // Simple validation
    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match');
      setIsRegistering(false);
      return;
    }
    
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      setIsRegistering(false);
      return;
    }
    
    // In a real app, this would call an API to create a new user
    // For demo purposes, we'll just simulate a successful registration
    setTimeout(() => {
      toast.success('Account created successfully! You can now log in.');
      setIsRegistering(false);
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-casino-dark p-4">
      <div className="w-full max-w-md bg-card border border-casino-purple-dark rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-casino-gold mb-2">Gala Casino</h1>
          <p className="text-gray-300">Access your account</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted border-casino-purple-dark pr-10"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="btn-gold w-full py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="reg-username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <Input
                  id="reg-username"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="bg-muted border-casino-purple-dark"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="bg-muted border-casino-purple-dark pr-10"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="bg-muted border-casino-purple-dark"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="btn-gold w-full py-6"
                disabled={isRegistering}
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
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
