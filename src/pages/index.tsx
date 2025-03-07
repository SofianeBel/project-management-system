import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('github_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Project Management System</title>
        <meta name="description" content="A project management system with roadmap visualization, issue tracking, and automatic assignment features" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Project Management System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive solution for managing projects with roadmap visualization, issue tracking, and automatic assignment features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Roadmap Management</h2>
            <p className="text-gray-600 mb-4">
              Visualize project timelines, milestones, and deliverables to keep your team on track.
            </p>
            <Link href={isLoggedIn ? "/roadmap" : "/login"} className="text-blue-600 hover:text-blue-800 font-medium">
              {isLoggedIn ? "View Roadmap" : "Login to Access"}
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Issue Tracking</h2>
            <p className="text-gray-600 mb-4">
              Create, manage, and track issues throughout the development lifecycle.
            </p>
            <Link href={isLoggedIn ? "/issues" : "/login"} className="text-blue-600 hover:text-blue-800 font-medium">
              {isLoggedIn ? "Manage Issues" : "Login to Access"}
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Automatic Assignment</h2>
            <p className="text-gray-600 mb-4">
              Intelligently assign issues to team members based on workload, expertise, and availability.
            </p>
            <Link href={isLoggedIn ? "/assignments" : "/login"} className="text-blue-600 hover:text-blue-800 font-medium">
              {isLoggedIn ? "View Assignments" : "Login to Access"}
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          {!isLoggedIn && (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
              Get Started
            </Link>
          )}
          {isLoggedIn && (
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
              Go to Dashboard
            </Link>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Project Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}