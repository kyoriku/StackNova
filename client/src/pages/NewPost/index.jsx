import { NewPostForm } from './components/NewPostForm';
import { useCreatePost } from './hooks/useCreatePost';
import { DefaultMetaTags } from '../../components/MetaTags';
import { POST_LIMITS } from './constants';

const NewPost = () => {
  const { error, isCreating, createPost } = useCreatePost();

  return (
    <>
      <DefaultMetaTags
        title="Create New Post"
        description="Share your programming knowledge and questions with the StackNova community."
      />

      <section className="max-w-5xl mx-auto pb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Post
        </h1>

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