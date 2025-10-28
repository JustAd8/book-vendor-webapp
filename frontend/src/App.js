import React, { useState } from 'react';
import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Product from './components/Product';
import Header from './components/Header';
import GuestHeader from './components/GuestHeader';
import DarkModeToggle from './components/DarkModeToggle';

const MainContent = () => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleSignInClick = () => {
    setShowLogin(true);
  };

  const handleBackToProducts = () => {
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DarkModeToggle />
      
      {showLogin && !isAuthenticated ? (
        <Login onBackToProducts={handleBackToProducts} />
      ) : (
        <>
          {isAuthenticated ? (
            <Header />
          ) : (
            <GuestHeader onSignInClick={handleSignInClick} />
          )}
          <main className="py-8">
            <Product onSignInRequired={handleSignInClick} />
          </main>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
