# Project Management System

A comprehensive project management system with roadmap visualization, issue tracking, and automatic assignment features.

## Features

- **Roadmap Management**: Visualize project timelines, milestones, and deliverables
- **Issue Tracking**: Create, manage, and track issues throughout the development lifecycle
- **Automatic Assignment**: Intelligently assign issues to team members based on workload, expertise, and availability
- **GitHub Integration**: Seamlessly integrates with GitHub repositories and projects

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub account with repository access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/SofianeBel/project-management-system.git
   cd project-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your GitHub credentials and other configuration options.

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `src/` - Source code
  - `api/` - API routes and controllers
  - `components/` - React components
  - `services/` - Business logic and services
  - `utils/` - Utility functions
- `public/` - Static assets
- `scripts/` - Automation scripts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub API for providing the foundation for repository integration
- React and Next.js for the frontend framework
- Node.js for the backend runtime