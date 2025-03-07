import { Octokit } from 'octokit';

class GitHubService {
  private octokit: Octokit | null = null;
  private owner: string = '';
  private repo: string = '';

  constructor() {
    // Initialize with token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('github_token') : null;
    if (token) {
      this.initialize(token);
    }
  }

  initialize(token: string, owner: string = '', repo: string = '') {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('github_token', token);
      if (owner) localStorage.setItem('github_owner', owner);
      if (repo) localStorage.setItem('github_repo', repo);
    }
  }

  isInitialized() {
    return !!this.octokit;
  }

  setRepository(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
    }
  }

  async getCurrentUser() {
    if (!this.octokit) throw new Error('GitHub service not initialized');
    
    const response = await this.octokit.rest.users.getAuthenticated();
    return response.data;
  }

  async getRepositories() {
    if (!this.octokit) throw new Error('GitHub service not initialized');
    
    const response = await this.octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    return response.data;
  }

  // Issues management
  async getIssues(state: 'open' | 'closed' | 'all' = 'open') {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.listForRepo({
      owner: this.owner,
      repo: this.repo,
      state,
      per_page: 100
    });
    
    return response.data;
  }

  async createIssue(title: string, body: string, labels: string[] = []) {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      labels
    });
    
    return response.data;
  }

  async updateIssue(issueNumber: number, data: {
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
    assignees?: string[];
  }) {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.update({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      ...data
    });
    
    return response.data;
  }

  async assignIssue(issueNumber: number, assignees: string[]) {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.addAssignees({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      assignees
    });
    
    return response.data;
  }

  // Milestones management for roadmap
  async getMilestones(state: 'open' | 'closed' | 'all' = 'open') {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.listMilestones({
      owner: this.owner,
      repo: this.repo,
      state,
      per_page: 100
    });
    
    return response.data;
  }

  async createMilestone(title: string, description: string, dueOn?: string) {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.issues.createMilestone({
      owner: this.owner,
      repo: this.repo,
      title,
      description,
      due_on: dueOn
    });
    
    return response.data;
  }

  // Team members (collaborators)
  async getCollaborators() {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    const response = await this.octokit.rest.repos.listCollaborators({
      owner: this.owner,
      repo: this.repo,
      per_page: 100
    });
    
    return response.data;
  }

  // Automatic assignment algorithm
  async autoAssignIssue(issueNumber: number, issueTitle: string, issueBody: string) {
    if (!this.octokit || !this.owner || !this.repo) {
      throw new Error('GitHub service not fully initialized');
    }
    
    // 1. Get all collaborators
    const collaborators = await this.getCollaborators();
    
    // 2. Get all open issues to analyze workload
    const openIssues = await this.getIssues('open');
    
    // 3. Calculate workload for each collaborator
    const workloads = collaborators.reduce((acc, collaborator) => {
      const username = collaborator.login;
      const assignedIssues = openIssues.filter(issue => 
        issue.assignees?.some(assignee => assignee.login === username)
      );
      
      acc[username] = assignedIssues.length;
      return acc;
    }, {} as Record<string, number>);
    
    // 4. Simple algorithm to find the best assignee
    // This is a basic implementation - in a real system, you would use more sophisticated methods
    // such as analyzing issue content, collaborator expertise, etc.
    
    // Sort collaborators by workload (ascending)
    const sortedCollaborators = [...collaborators].sort((a, b) => {
      return (workloads[a.login] || 0) - (workloads[b.login] || 0);
    });
    
    // Select the collaborator with the lowest workload
    const assignee = sortedCollaborators[0]?.login;
    
    if (assignee) {
      // Assign the issue
      await this.assignIssue(issueNumber, [assignee]);
      return assignee;
    }
    
    return null;
  }
}

// Create a singleton instance
const githubService = new GitHubService();

export default githubService; 