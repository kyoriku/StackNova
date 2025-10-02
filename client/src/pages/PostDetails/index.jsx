import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../NotFound';
import { usePost } from './hooks/usePost';
import { useComments } from './hooks/useComments';
import { DeleteModal } from './components/DeleteModal';
import { PostContent } from './components/PostContent';
import { CommentForm } from './components/CommentForm';
import { CommentsList } from './components/CommentsList';
import { SEO } from '../../components/SEO';
import { useQueryClient } from '@tanstack/react-query';

const PostDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const { data: post, isLoading, error, isError } = usePost(identifier);
  const {
    editingCommentId,
    setEditingCommentId,
    deleteModalOpen,
    setDeleteModalOpen,
    commentToDelete,
    addCommentMutation,
    editCommentMutation,
    deleteCommentMutation,
    handleEditClick,
    handleDeleteClick
  } = useComments(post?.slug || identifier);

  // Helper function to check if identifier is UUID
  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Handle UUID -> slug redirect
  useEffect(() => {
    if (post && post.slug && identifier !== post.slug && isUUID(identifier)) {
      navigate(`/post/${post.slug}`, { replace: true });
    }
  }, [post, identifier, navigate]);

  // Effect to handle body scroll lock when modal is open
  useEffect(() => {
    if (deleteModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [deleteModalOpen]);

  useEffect(() => {
    const isFromEdit = location.state?.fromEdit;
    if (isFromEdit) {
      queryClient.invalidateQueries({ queryKey: ['post', identifier] });
    }
  }, [identifier, location.state, queryClient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCommentError(''); // Clear previous errors

    // Client-side validation
    if (commentText.trim().length < 2) {
      setCommentError('Comment must be at least 2 characters');
      return;
    }

    if (commentText.length > 7500) {
      setCommentError('Comment must be less than 7500 characters');
      return;
    }

    if (editingCommentId) {
      editCommentMutation.mutate({
        commentId: editingCommentId,
        updatedText: commentText
      }, {
        onSuccess: () => {
          setCommentText('');
          setCommentError('');
        },
        onError: (error) => {
          const message = error.response?.data?.errors?.[0]?.msg || 
                         'Failed to update comment. Please try again.';
          setCommentError(message);
        }
      });
    } else {
      addCommentMutation.mutate({
        comment_text: commentText,
        post_id: post.id
      }, {
        onSuccess: () => {
          setCommentText('');
          setCommentError('');
        },
        onError: (error) => {
          const message = error.response?.data?.errors?.[0]?.msg || 
                         'Failed to post comment. Please try again.';
          setCommentError(message);
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setCommentText('');
    setCommentError('');
  };

  const handleCommentEdit = (comment) => {
    handleEditClick(comment);
    setCommentText(comment.comment_text);
    setCommentError('');
  };

  // Generate enhanced JSON-LD for the blog post
  const generateJsonLd = (post) => {
    if (!post) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": "https://stacknova.ca/screenshots/2-StackNova-Question.jpg",
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "author": {
        "@type": "Person",
        "name": post.user.username,
        "url": `https://stacknova.ca/user/${post.user.username}`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "StackNova",
        "logo": {
          "@type": "ImageObject",
          "url": "https://stacknova.ca/favicon.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://stacknova.ca/post/${post.slug || identifier}`
      },
      "commentCount": post.comments?.length || 0,
      "comment": post.comments?.map(comment => ({
        "@type": "Comment",
        "text": comment.comment_text,
        "dateCreated": comment.createdAt,
        "author": {
          "@type": "Person",
          "name": comment.user.username
        }
      })) || []
    };
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  if (isError || !post) {
    const displayName = isUUID(identifier) ? 'this post' : `"${identifier}"`;
    return (
      <NotFound
        title="Post not found"
        message={`The post ${displayName} does not exist or could not be found.`}
        linkText="Browse all posts"
        linkTo="/"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <SEO
        title={post.title}
        description={post.excerpt || `A question by ${post.user.username} on StackNova`}
        canonicalPath={`/post/${post.slug || identifier}`}
        type="article"
        image="https://stacknova.ca/screenshots/2-StackNova-Question.jpg"
        jsonLd={generateJsonLd(post)}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteCommentMutation.mutate(commentToDelete?.id)}
        isDeleting={deleteCommentMutation.isPending}
      />

      <PostContent post={post} />

      {isAuthenticated ? (
        <CommentForm
          commentText={commentText}
          setCommentText={setCommentText}
          isEditing={!!editingCommentId}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
          isSubmitting={addCommentMutation.isPending || editCommentMutation.isPending}
          error={commentError}
        />
      ) : (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg text-center border 
        border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white">
            You must be logged in to comment.{' '}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
            >
              Log in here.
            </Link>
          </p>
        </div>
      )}

      <CommentsList
        comments={post.comments}
        currentUserId={user?.id}
        onEditComment={handleCommentEdit}
        onDeleteComment={handleDeleteClick}
        isEditingComment={editingCommentId}
      />
    </div>
  );
};

export default PostDetails;