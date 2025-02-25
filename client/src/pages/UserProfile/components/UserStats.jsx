export const UserStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 col-span-1">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Posts</h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPosts}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 col-span-1">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Comments</h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalComments}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 col-span-2 md:col-span-1">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">Member Since</h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.memberSince}</p>
    </div>
  </div>
);
