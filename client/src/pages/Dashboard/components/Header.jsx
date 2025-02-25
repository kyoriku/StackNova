import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const Header = ({ username }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
    <div className="text-left w-full sm:w-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {username}'s Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
        Manage your posts and content
      </p>
    </div>
    <Link
      to="/new-post"
      className="flex items-center gap-2 px-4 py-2 
         bg-blue-600 text-white rounded-lg
         [&:hover]:bg-blue-700 w-full sm:w-auto justify-center sm:justify-start"
      aria-label="Create a new post"
    >
      <PlusCircle size={20} aria-hidden="true" />
      New Post
    </Link>
  </header>
);