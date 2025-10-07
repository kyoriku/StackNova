import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const Header = ({ username }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <div className="text-left w-full sm:w-auto">
      <h1 className="text-4xl font-black bg-gradient-to-r 
                   from-gray-900 via-blue-800 to-purple-800 
                   dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                   bg-clip-text text-transparent mb-1">
        {username}'s Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage your posts and content
      </p>
    </div>
    <Link
      to="/new-post"
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl
               bg-gradient-to-r from-blue-500 to-purple-500
               dark:from-blue-600 dark:to-purple-600
               text-white font-semibold text-sm
               hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
               hover:scale-105
               w-full sm:w-auto justify-center
               transition-all duration-200"
      aria-label="Create a new post"
    >
      <PlusCircle size={18} aria-hidden="true" />
      New Post
    </Link>
  </header>
);