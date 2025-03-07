import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('github_token');
    const storedUsername = localStorage.getItem('github_username');
    
    setIsLoggedIn(!!token);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_owner');
    localStorage.removeItem('github_repo');
    localStorage.removeItem('github_username');
    router.push('/');
  };

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                PMS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isLoggedIn && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/dashboard') 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/roadmap" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/roadmap') 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Roadmap
                  </Link>
                  <Link 
                    href="/issues" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/issues') 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Issues
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm text-gray-500">{username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {isLoggedIn && (
            <>
              <Link 
                href="/dashboard" 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/roadmap" 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/roadmap')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Roadmap
              </Link>
              <Link 
                href="/issues" 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/issues')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Issues
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{username}</div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4">
              <Link 
                href="/login" 
                className="block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 