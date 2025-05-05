
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Video, History, Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Video className="h-8 w-8 text-brand-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Caça<span className="text-brand-500">Viral</span>
              </span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-brand-500 text-sm font-medium text-gray-900 dark:text-white">
                Dashboard
              </Link>
              <Link to="/history" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                Histórico
              </Link>
              <Link to="/plans" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                Planos
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut()} 
                  className="font-medium"
                >
                  Sair
                </Button>
                <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button 
                  className="bg-brand-500 hover:bg-brand-600" 
                  size="sm" 
                  asChild
                >
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/dashboard" 
            className="block pl-3 pr-4 py-2 border-l-4 border-brand-500 text-base font-medium text-brand-700 bg-brand-50 dark:bg-gray-800 dark:text-brand-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/history" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Histórico
          </Link>
          <Link 
            to="/plans" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Planos
          </Link>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-brand-500 text-white flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Button asChild className="w-full justify-center mb-2" variant="outline">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Entrar</Link>
                </Button>
                <Button asChild className="w-full justify-center bg-brand-500 hover:bg-brand-600">
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
