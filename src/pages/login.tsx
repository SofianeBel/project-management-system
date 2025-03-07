import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import githubService from '../services/github';

export default function Login() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already logged in
    const storedToken = localStorage.getItem('github_token');
    const storedOwner = localStorage.getItem('github_owner');
    const storedRepo = localStorage.getItem('github_repo');
    
    if (storedToken && storedOwner && storedRepo) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Initialize GitHub service with token
      githubService.initialize(token, owner, repo);
      
      // Test the connection by getting the authenticated user
      await githubService.getCurrentUser();
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <Head>
        <title>Login | Project Management System</title>
        <meta name="description" content="Login to Project Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Project Management System</h1>
          <p className="text-gray-600 mt-2">Sign in with your GitHub credentials</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                <a 
                  href="https://github.com/settings/tokens/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create a token
                </a> with repo and user scopes.
              </p>
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Repository Owner
              </label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="username or organization"
                required
              />
            </div>

            <div>
              <label htmlFor="repo" className="block text-sm font-medium text-gray-700 mb-1">
                Repository Name
              </label>
              <input
                id="repo"
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="repository-name"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 