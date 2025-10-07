import { NewPostForm } from './components/NewPostForm';
import { useCreatePost } from './hooks/useCreatePost';
import { SEO } from '../../components/SEO';
import { POST_LIMITS } from './constants';

const NewPost = () => {
  const { error, isCreating, createPost } = useCreatePost();

  return (
    <>
      <SEO
        title="Create New Post"
        description="Share your programming knowledge and questions with the StackNova community."
        canonicalPath="/new-post"
        noIndex={true}
      />

      <section className="max-w-4xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r 
                       from-gray-900 via-blue-800 to-purple-800 
                       dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                       bg-clip-text text-transparent mb-1">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your knowledge with the community
          </p>
        </div>

        <NewPostForm
          onSubmit={createPost}
          isSubmitting={isCreating}
          error={error}
          limits={POST_LIMITS}
        />
      </section>
    </>
  );
};

export default NewPost;