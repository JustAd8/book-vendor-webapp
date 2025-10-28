import React from 'react';
import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Product from './components/Product';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';

const MainContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DarkModeToggle />
      
      {isAuthenticated ? (
        <>
          <Header />
          <main className="py-8">
            <Product />
          </main>
        </>
      ) : (
        <Login />
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
