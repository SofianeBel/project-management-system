import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Mock data for demonstration
const mockProjects = [
  { id: 1, name: 'Website Redesign', progress: 75, issues: 12, dueDate: '2023-12-15' },
  { id: 2, name: 'Mobile App Development', progress: 40, issues: 8, dueDate: '2024-02-28' },
  { id: 3, name: 'API Integration', progress: 90, issues: 3, dueDate: '2023-11-30' },
  { id: 4, name: 'Database Migration', progress: 20, issues: 15, dueDate: '2024-01-15' },
];

const mockRecentActivity = [
  { id: 1, type: 'issue', action: 'created', title: 'Fix navigation bug', user: 'johndoe', time: '2 hours ago' },
  { id: 2, type: 'roadmap', action: 'updated', title: 'Q4 Milestones', user: 'janedoe', time: '5 hours ago' },
  { id: 3, type: 'assignment', action: 'assigned', title: 'Implement login page', user: 'alexsmith', time: '1 day ago' },
  { id: 4, type: 'issue', action: 'closed', title: 'Update documentation', user: 'johndoe', time: '2 days ago' },
];

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState(mockProjects);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('github_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dashboard | Project Management System</title>
        <meta name="description" content="Dashboard for Project Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
            <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            <p className="text-gray-600">Active projects</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Issues</h2>
            <div className="text-3xl font-bold text-yellow-500">
              {projects.reduce((total, project) => total + project.issues, 0)}
            </div>
            <p className="text-gray-600">Open issues</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Next Deadline</h2>
            <div className="text-3xl font-bold text-red-500">
              {new Date(Math.min(...projects.map(p => new Date(p.dueDate).getTime()))).toLocaleDateString()}
            </div>
            <p className="text-gray-600">Days remaining</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
                <Link href="/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {projects.map(project => (
                    <div key={project.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{project.name}</h3>
                        <span className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{project.progress}% Complete</span>
                        <span className="text-yellow-500">{project.issues} open issues</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center text-white ${
                        activity.type === 'issue' ? 'bg-yellow-500' : 
                        activity.type === 'roadmap' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {activity.type === 'issue' ? 'I' : activity.type === 'roadmap' ? 'R' : 'A'}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">{activity.user}</span> {activity.action} {activity.type} "{activity.title}"
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}