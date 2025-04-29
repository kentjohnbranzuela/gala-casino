
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ContactButton from './ContactButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize localStorage with sessionStorage if available
  React.useEffect(() => {
    // Sync user data from sessionStorage to localStorage for cross-device access
    const syncUserData = () => {
      const username = sessionStorage.getItem('username');
      const userType = sessionStorage.getItem('userType');
      const isLoggedIn = sessionStorage.getItem('isLoggedIn');

      if (username) localStorage.setItem('username', username);
      if (userType) localStorage.setItem('userType', userType);
      if (isLoggedIn) localStorage.setItem('isLoggedIn', isLoggedIn);

      // Broadcast login event to sync across tabs
      window.dispatchEvent(new Event('storage:user:login'));
    };
    
    syncUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 casino-container py-8">
        {children}
      </main>
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Layout;
