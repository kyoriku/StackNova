import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MarkdownPreview } from '../../../components/MarkdownEditor';
import { usePrefetchUserProfile } from '../hooks/usePrefetchUserProfile';

export const PostContent = ({ post }) => {
  const prefetchUserProfile = usePrefetchUserProfile();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {post.title}
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg 
      dark:shadow-black/20 p-4 mb-8 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white mb-4">
          <MarkdownPreview content={post.content} />
        </p>
        {/* <hr className='mb-4 border-gray-400'/> */}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <Link
            to={`/user/${post.user.username}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
            dark:hover:text-blue-500 font-medium "
            onMouseEnter={() => prefetchUserProfile(post.user.username)} // Prefetch on hover
          >
            {post.user.username}
          </Link>
          <span aria-hidden="true"> • </span>
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </time>
        </p>
      </div>
    </>
  );
};