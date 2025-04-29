
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Phone } from 'lucide-react';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Admin credentials - updated with new admin credentials
    if (username === 'admin' && password === 'admin123') {
      setTimeout(() => {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Synchronize with sessionStorage for cross-device consistency
        sessionStorage.setItem('userType', 'admin');
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        toast.success('Welcome, Admin!');
        navigate('/admin');
        setIsLoading(false);
      }, 1000);
    } else {
      // Check if this is a registered user
      try {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const foundUser = users.find((user: any) => 
            user.username === username && user.password === password
          );
          
          if (foundUser) {
            // Update user's last login time
            const updatedUsers = users.map((user: any) => {
              if (user.username === username) {
                return {
                  ...user,
                  lastLogin: new Date().toISOString().split('T')[0],
                  // Add IP and geolocation info
                  lastLoginInfo: {
                    timestamp: new Date().toISOString(),
                    device: navigator.userAgent
                  }
                };
              }
              return user;
            });
            
            localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
            localStorage.setItem('userType', 'user');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Synchronize with sessionStorage for cross-device consistency
            sessionStorage.setItem('userType', 'user');
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);
            
            setTimeout(() => {
              toast.success('Login successful!');
              
              // Simulate SMS notification for login
              if (foundUser.phoneNumber) {
                console.info(`SMS notification sent to ${foundUser.phoneNumber}: You have successfully logged in to your casino account.`);
              }
              
              navigate('/');
              setIsLoading(false);
            }, 1000);
            return;
          }
        }
        
        // If no match found
        setTimeout(() => {
          toast.error('Invalid username or password');
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Login error:", error);
        toast.error('An error occurred during login');
        setIsLoading(false);
      }
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
    
    if (!phoneNumber) {
      toast.error('Phone number is required');
      setIsRegistering(false);
      return;
    }
    
    try {
      // Check if username already exists
      const storedUsers = localStorage.getItem('registeredUsers');
      let users = [];
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        
        // Check if username already exists
        if (users.some((user: any) => user.username === regUsername)) {
          toast.error('Username already exists');
          setIsRegistering(false);
          return;
        }
      }
      
      // Create new user with geolocation info
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const newUser = {
        id: Date.now().toString(),
        username: regUsername,
        password: regPassword, // In a real app, this would be hashed
        phoneNumber: phoneNumber, // Add phone number
        registrationDate: today,
        lastLogin: today,
        registrationInfo: {
          timestamp: new Date().toISOString(),
          device: navigator.userAgent
        },
        depositCount: 0,
        withdrawalCount: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        balance: 0 // Initialize balance as 0
      };
      
      // Add user to storage
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Trigger an event so the admin panel can refresh
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('user:registered', { 
        detail: { username: regUsername, phone: phoneNumber } 
      }));
      
      // Simulate SMS notification
      console.info(`SMS notification sent to ${phoneNumber}: Your account registration was successful! Welcome to Gala Casino.`);
      
      setTimeout(() => {
        toast.success('Account created successfully! You can now log in.');
        setIsRegistering(false);
        setRegUsername('');
        setRegPassword('');
        setRegConfirmPassword('');
        setPhoneNumber('');
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error('An error occurred during registration');
      setIsRegistering(false);
    }
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
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-muted border-casino-purple-dark pl-10"
                    placeholder="09XXXXXXXXX"
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Phone size={18} />
                  </span>
                </div>
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
      </div>
    </div>
  );
};

export default LoginPage;
