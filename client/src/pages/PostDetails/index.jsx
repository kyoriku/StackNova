// import { useState, useEffect } from 'react';
// import { useParams, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import { usePost } from './hooks/usePost';
// import { useComments } from './hooks/useComments';
// import { DeleteModal } from './components/DeleteModal';
// import { PostContent } from './components/PostContent';
// import { CommentForm } from './components/CommentForm';
// import { CommentsList } from './components/CommentsList';

// const PostDetails = () => {
//   const { id } = useParams();
//   const [commentText, setCommentText] = useState('');
//   const { isAuthenticated, user } = useAuth();
//   const location = useLocation();

//   const { data: post, isLoading, error } = usePost(id);
//   const {
//     editingCommentId,
//     setEditingCommentId,
//     deleteModalOpen,
//     setDeleteModalOpen,
//     commentToDelete,
//     addCommentMutation,
//     editCommentMutation,
//     deleteCommentMutation,
//     handleEditClick,
//     handleDeleteClick
//   } = useComments(id);

//   // Effect to handle body scroll lock when modal is open
//   useEffect(() => {
//     if (deleteModalOpen) {
//       const scrollY = window.scrollY;
//       document.body.style.position = 'fixed';
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.width = '100%';
//     } else {
//       const scrollY = document.body.style.top;
//       document.body.style.position = '';
//       document.body.style.top = '';
//       document.body.style.width = '';
//       window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
//     }
//   }, [deleteModalOpen]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (editingCommentId) {
//       editCommentMutation.mutate({
//         commentId: editingCommentId,
//         updatedText: commentText
//       }, {
//         onSuccess: () => setCommentText('')
//       });
//     } else {
//       addCommentMutation.mutate({
//         comment_text: commentText,
//         post_id: id
//       }, {
//         onSuccess: () => setCommentText('')
//       });
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setCommentText('');
//   };

//   const handleCommentEdit = (comment) => {
//     handleEditClick(comment);
//     setCommentText(comment.comment_text);
//   };

//   if (isLoading) {
//     return <LoadingSpinner text="Loading post..." />;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error.message}</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto pb-8">
//       <DeleteModal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={() => deleteCommentMutation.mutate(commentToDelete?.id)}
//         isDeleting={deleteCommentMutation.isPending}
//       />

//       <PostContent post={post} />

//       {isAuthenticated ? (
//         <CommentForm
//           commentText={commentText}
//           setCommentText={setCommentText}
//           isEditing={!!editingCommentId}
//           onSubmit={handleSubmit}
//           onCancelEdit={handleCancelEdit}
//           isSubmitting={addCommentMutation.isPending || editCommentMutation.isPending}
//         />
//       ) : (
//         <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg text-center border border-gray-200 dark:border-gray-700">
//           <p className="text-gray-900 dark:text-white">
//             Please{' '}
//             <Link
//               to="/login"
//               state={{ from: location.pathname }}
//               className="text-blue-600 hover:text-blue-700"
//             >
//               log in
//             </Link>{' '}
//             to comment on this post.
//           </p>
//         </div>
//       )}

//       <CommentsList
//         comments={post.comments}
//         currentUserId={user?.id}
//         onEditComment={handleCommentEdit}
//         onDeleteComment={handleDeleteClick}
//         isEditingComment={editingCommentId}
//       />
//     </div>
//   );
// };

// export default PostDetails;

import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../NotFound';
import { usePost } from './hooks/usePost';
import { useComments } from './hooks/useComments';
import { DeleteModal } from './components/DeleteModal';
import { PostContent } from './components/PostContent';
import { CommentForm } from './components/CommentForm';
import { CommentsList } from './components/CommentsList';
import { MetaTags } from './components/MetaTags';

const PostDetails = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const { data: post, isLoading, error, isError } = usePost(id);
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
  } = useComments(id);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCommentId) {
      editCommentMutation.mutate({
        commentId: editingCommentId,
        updatedText: commentText
      }, {
        onSuccess: () => setCommentText('')
      });
    } else {
      addCommentMutation.mutate({
        comment_text: commentText,
        post_id: id
      }, {
        onSuccess: () => setCommentText('')
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setCommentText('');
  };

  const handleCommentEdit = (comment) => {
    handleEditClick(comment);
    setCommentText(comment.comment_text);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  // Use the flexible NotFound component for posts that don't exist
  if (isError || !post) {
    return (
      <NotFound 
        title="Post not found" 
        message={`The post with ID "${id}" does not exist or could not be found.`}
        linkText="Browse all posts"
        linkTo="/"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {post && <MetaTags post={post} />}
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
        />
      ) : (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white">
            Please{' '}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="text-blue-600 hover:text-blue-700"
            >
              log in
            </Link>{' '}
            to comment on this post.
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