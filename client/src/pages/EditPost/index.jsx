import { useParams } from 'react-router-dom';
import { usePostData } from './hooks/usePostData';
import { useUpdatePost } from './hooks/useUpdatePost';
import { EditPostForm } from './components/EditPostForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';

const EditPost = () => {
  const { slug } = useParams();
  const { post, isLoading, error: fetchError } = usePostData(slug);
  const { error: updateError, isUpdating, updatePost } = useUpdatePost(slug);

  const error = fetchError || updateError;

  if (isLoading) {
    return (
      <>
        <SEO
          title="Edit Post"
          description="Update your content on StackNova."
          canonicalPath={`/edit-post/${slug}`}
          noIndex={true}
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
        canonicalPath={`/edit-post/${slug}`}
        noIndex={true}
      />

      <section className="max-w-4xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r 
                       from-gray-900 via-blue-800 to-purple-800 
                       dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                       bg-clip-text text-transparent mb-1">
            Edit Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your content
          </p>
        </div>

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