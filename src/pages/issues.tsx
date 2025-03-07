import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Mock data for demonstration
const mockIssues = [
  { 
    id: 1, 
    title: 'Fix navigation bug on mobile', 
    description: 'The navigation menu is not working correctly on mobile devices.',
    status: 'open', 
    priority: 'high', 
    assignee: 'johndoe',
    labels: ['bug', 'mobile'],
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-16T14:20:00Z'
  },
  { 
    id: 2, 
    title: 'Implement user authentication', 
    description: 'Add user login and registration functionality.',
    status: 'in-progress', 
    priority: 'high', 
    assignee: 'janedoe',
    labels: ['feature', 'security'],
    createdAt: '2023-10-10T09:15:00Z',
    updatedAt: '2023-10-14T11:45:00Z'
  },
  { 
    id: 3, 
    title: 'Update documentation for API endpoints', 
    description: 'The API documentation needs to be updated with the new endpoints.',
    status: 'open', 
    priority: 'medium', 
    assignee: null,
    labels: ['documentation'],
    createdAt: '2023-10-12T15:20:00Z',
    updatedAt: '2023-10-12T15:20:00Z'
  },
  { 
    id: 4, 
    title: 'Optimize database queries', 
    description: 'The database queries are slow and need optimization.',
    status: 'open', 
    priority: 'medium', 
    assignee: null,
    labels: ['performance', 'database'],
    createdAt: '2023-10-14T13:10:00Z',
    updatedAt: '2023-10-14T13:10:00Z'
  },
  { 
    id: 5, 
    title: 'Add dark mode support', 
    description: 'Implement dark mode theme for the application.',
    status: 'closed', 
    priority: 'low', 
    assignee: 'alexsmith',
    labels: ['feature', 'ui'],
    createdAt: '2023-09-28T11:05:00Z',
    updatedAt: '2023-10-08T16:30:00Z'
  }
];

const mockTeamMembers = [
  { id: 1, username: 'johndoe', name: 'John Doe', avatar: 'https://avatars.githubusercontent.com/u/1', skills: ['frontend', 'react', 'mobile'], workload: 75 },
  { id: 2, username: 'janedoe', name: 'Jane Doe', avatar: 'https://avatars.githubusercontent.com/u/2', skills: ['backend', 'security', 'api'], workload: 50 },
  { id: 3, username: 'alexsmith', name: 'Alex Smith', avatar: 'https://avatars.githubusercontent.com/u/3', skills: ['frontend', 'ui', 'design'], workload: 25 },
  { id: 4, username: 'sarahjones', name: 'Sarah Jones', avatar: 'https://avatars.githubusercontent.com/u/4', skills: ['backend', 'database', 'performance'], workload: 40 }
];

export default function Issues() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState(mockIssues);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'medium',
    labels: []
  });

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

  const filteredIssues = issues.filter(issue => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned' && issue.assignee !== null) return false;
      if (assigneeFilter !== 'unassigned' && issue.assignee !== assigneeFilter) return false;
    }
    return true;
  });

  const handleNewIssueSubmit = (e) => {
    e.preventDefault();
    
    // Auto-assign the issue based on skills and workload
    const assignee = autoAssignIssue(newIssue);
    
    const newIssueObj = {
      id: issues.length + 1,
      title: newIssue.title,
      description: newIssue.description,
      status: 'open',
      priority: newIssue.priority,
      assignee: assignee ? assignee.username : null,
      labels: newIssue.labels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setIssues([newIssueObj, ...issues]);
    setNewIssue({
      title: '',
      description: '',
      priority: 'medium',
      labels: []
    });
    setShowNewIssueForm(false);
  };

  // Automatic assignment algorithm
  const autoAssignIssue = (issue) => {
    // Extract keywords from the issue title and description
    const issueText = `${issue.title} ${issue.description}`.toLowerCase();
    
    // Calculate a score for each team member based on skills match and workload
    const scoredMembers = teamMembers.map(member => {
      // Calculate skill match score (0-100)
      const skillMatchScore = member.skills.reduce((score, skill) => {
        return issueText.includes(skill) ? score + 25 : score;
      }, 0);
      
      // Calculate workload score (0-100, inverse of workload)
      const workloadScore = 100 - member.workload;
      
      // Calculate total score (weighted average)
      const totalScore = (skillMatchScore * 0.7) + (workloadScore * 0.3);
      
      return {
        ...member,
        score: totalScore
      };
    });
    
    // Sort by score (highest first)
    scoredMembers.sort((a, b) => b.score - a.score);
    
    // Return the highest scoring member, or null if no good match
    return scoredMembers[0].score > 30 ? scoredMembers[0] : null;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Issues | Project Management System</title>
        <meta name="description" content="Issue tracking and management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Issue Tracking</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0">
            <div className="mb-2 md:mb-0">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="mb-2 md:mb-0">
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="assignee-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                id="assignee-filter"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.username}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewIssueForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            New Issue
          </button>
        </div>

        {showNewIssueForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Issue</h2>
            <form onSubmit={handleNewIssueSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Issue title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Issue description"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewIssueForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No issues found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {issue.labels.map((label) => (
                            <span key={label} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {issue.assignee ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {issue.assignee.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{issue.assignee}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(issue.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}