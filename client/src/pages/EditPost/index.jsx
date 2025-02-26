import { useParams } from 'react-router-dom';
import { usePostData } from './hooks/usePostData';
import { useUpdatePost } from './hooks/useUpdatePost';
import { EditPostForm } from './components/EditPostForm';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const { post, isLoading, error: fetchError } = usePostData(id);
  const { error: updateError, isUpdating, updatePost } = useUpdatePost(id);

  // Combine errors from both hooks
  const error = fetchError || updateError;

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  return (
    <section className="max-w-4xl mx-auto pb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Edit Post
      </h1>

      <EditPostForm
        post={post}
        onSubmit={updatePost}
        isSubmitting={isUpdating}
        error={error}
      />
    </section>
  );
};

export default EditPost;