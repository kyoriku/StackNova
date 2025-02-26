import { NewPostForm } from './components/NewPostForm';
import { useCreatePost } from './hooks/useCreatePost';

const NewPost = () => {
  const { error, isCreating, createPost } = useCreatePost();

  return (
    <section className="max-w-4xl mx-auto pb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Create New Post
      </h1>

      <NewPostForm 
        onSubmit={createPost} 
        isSubmitting={isCreating} 
        error={error} 
      />
    </section>
  );
};

export default NewPost;