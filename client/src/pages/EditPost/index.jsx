import { useParams } from 'react-router-dom';
import { usePostData } from './hooks/usePostData';
import { useUpdatePost } from './hooks/useUpdatePost';
import { EditPostForm } from './components/EditPostForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';

const EditPost = () => {
  const { id } = useParams();
  const { post, isLoading, error: fetchError } = usePostData(id);
  const { error: updateError, isUpdating, updatePost } = useUpdatePost(id);

  // Combine errors from both hooks
  const error = fetchError || updateError;

  if (isLoading) {
    return (
      <>
        <SEO
          title="Edit Post"
          description="Update your content on StackNova."
          canonicalPath={`/edit-post/${id}`}
          noIndex={true} // Set noIndex to true based on robots.txt
        />
        <LoadingSpinner text="Loading post..." />
      </>
    );
  }

  return (
    <>
      <SEO
        title={post ? `Edit: ${post.title}` : "Edit Post"}
        description="Update your content on StackNova."
        canonicalPath={`/edit-post/${id}`}
        noIndex={true} // Set noIndex to true based on robots.txt
      />
      
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
    </>
  );
};

export default EditPost;