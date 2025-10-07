import { FileText, MessageSquare, Calendar } from 'lucide-react';

export const UserStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3">
    {/* Total Posts */}
    <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                  dark:from-gray-800 dark:to-gray-800/50
                  rounded-2xl p-4 sm:p-6
                  border border-gray-200/60 dark:border-gray-700/60
                  shadow-sm shadow-gray-900/5 dark:shadow-black/20
                  overflow-hidden
                  group hover:border-blue-300 dark:hover:border-blue-500/50
                  transition-all duration-300">
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            Total Posts
          </h3>
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-3xl font-black bg-gradient-to-r 
                    from-gray-900 to-blue-800 
                    dark:from-gray-100 dark:to-blue-300
                    bg-clip-text text-transparent">
          {stats.totalPosts}
        </p>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 
                    bg-gradient-to-br from-blue-500/5 to-blue-600/5
                    dark:from-blue-500/10 dark:to-blue-600/10
                    rounded-full blur-2xl -z-0
                    group-hover:scale-150 transition-transform duration-500" />
    </div>

    {/* Total Comments */}
    <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                  dark:from-gray-800 dark:to-gray-800/50
                  rounded-2xl p-4 sm:p-6
                  border border-gray-200/60 dark:border-gray-700/60
                  shadow-sm shadow-gray-900/5 dark:shadow-black/20
                  overflow-hidden
                  group hover:border-purple-300 dark:hover:border-purple-500/50
                  transition-all duration-300">
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            Total Comments
          </h3>
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p className="text-3xl font-black bg-gradient-to-r 
                    from-gray-900 to-purple-800 
                    dark:from-gray-100 dark:to-purple-300
                    bg-clip-text text-transparent">
          {stats.totalComments}
        </p>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 
                    bg-gradient-to-br from-purple-500/5 to-purple-600/5
                    dark:from-purple-500/10 dark:to-purple-600/10
                    rounded-full blur-2xl -z-0
                    group-hover:scale-150 transition-transform duration-500" />
    </div>

    {/* Member Since */}
    <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                  dark:from-gray-800 dark:to-gray-800/50
                  rounded-2xl p-4 sm:p-6
                  border border-gray-200/60 dark:border-gray-700/60
                  shadow-sm shadow-gray-900/5 dark:shadow-black/20
                  overflow-hidden
                  group hover:border-blue-300 dark:hover:border-blue-500/50
                  transition-all duration-300
                  col-span-2 sm:col-span-2 md:col-span-1">
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            Member Since
          </h3>
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-2xl font-black bg-gradient-to-r 
                    from-gray-900 to-green-800 
                    dark:from-gray-100 dark:to-green-300
                    bg-clip-text text-transparent">
          {stats.memberSince}
        </p>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 
                    bg-gradient-to-br from-green-500/5 to-green-600/5
                    dark:from-green-500/10 dark:to-green-600/10
                    rounded-full blur-2xl -z-0
                    group-hover:scale-150 transition-transform duration-500" />
    </div>
  </div>
);