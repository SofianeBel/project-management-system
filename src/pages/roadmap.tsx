import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Mock data for demonstration
const mockMilestones = [
  {
    id: 1,
    title: 'Q1 2024',
    description: 'First quarter objectives',
    items: [
      { id: 1, title: 'Project Kickoff', status: 'completed', dueDate: '2024-01-15' },
      { id: 2, title: 'Requirements Gathering', status: 'completed', dueDate: '2024-01-31' },
      { id: 3, title: 'Design Phase', status: 'in-progress', dueDate: '2024-02-28' },
      { id: 4, title: 'Initial Development', status: 'not-started', dueDate: '2024-03-15' },
      { id: 5, title: 'Q1 Review', status: 'not-started', dueDate: '2024-03-31' },
    ]
  },
  {
    id: 2,
    title: 'Q2 2024',
    description: 'Second quarter objectives',
    items: [
      { id: 6, title: 'Alpha Release', status: 'not-started', dueDate: '2024-04-30' },
      { id: 7, title: 'User Testing', status: 'not-started', dueDate: '2024-05-15' },
      { id: 8, title: 'Feedback Implementation', status: 'not-started', dueDate: '2024-06-15' },
      { id: 9, title: 'Q2 Review', status: 'not-started', dueDate: '2024-06-30' },
    ]
  },
  {
    id: 3,
    title: 'Q3 2024',
    description: 'Third quarter objectives',
    items: [
      { id: 10, title: 'Beta Release', status: 'not-started', dueDate: '2024-07-31' },
      { id: 11, title: 'Performance Optimization', status: 'not-started', dueDate: '2024-08-31' },
      { id: 12, title: 'Documentation', status: 'not-started', dueDate: '2024-09-15' },
      { id: 13, title: 'Q3 Review', status: 'not-started', dueDate: '2024-09-30' },
    ]
  },
  {
    id: 4,
    title: 'Q4 2024',
    description: 'Fourth quarter objectives',
    items: [
      { id: 14, title: 'Final Testing', status: 'not-started', dueDate: '2024-10-31' },
      { id: 15, title: 'Production Deployment', status: 'not-started', dueDate: '2024-11-15' },
      { id: 16, title: 'Marketing Launch', status: 'not-started', dueDate: '2024-11-30' },
      { id: 17, title: 'Year-End Review', status: 'not-started', dueDate: '2024-12-15' },
    ]
  }
];

export default function Roadmap() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [milestones, setMilestones] = useState(mockMilestones);
  const [activeTab, setActiveTab] = useState('timeline');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'not-started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Roadmap | Project Management System</title>
        <meta name="description" content="Project roadmap and timeline" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Roadmap</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timeline View
              </button>
              <button
                onClick={() => setActiveTab('kanban')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'kanban'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Kanban View
              </button>
              <button
                onClick={() => setActiveTab('gantt')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'gantt'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gantt Chart
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h2>
                    <p className="text-gray-600 mb-4">{milestone.description}</p>
                    
                    <div className="space-y-4">
                      {milestone.items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{item.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(item.status)} mr-2`}></span>
                              <span className="text-sm text-gray-500">{getStatusText(item.status)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'kanban' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Kanban view will be implemented in a future update.</p>
              </div>
            )}

            {activeTab === 'gantt' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Gantt chart view will be implemented in a future update.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Milestone</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Milestone title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Milestone description"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Add Milestone
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}