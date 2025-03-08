import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { usePrefetchPost } from '../Posts/hooks/usePrefetchPost';
import { useDashboardPosts } from './hooks/useDashboardPosts';
import { useDeletePost } from './hooks/useDeletePost';
import { DeleteModal } from './components/DeleteModal';
import { Header } from './components/Header';
import { PostsList } from './components/PostsList';
import { DefaultMetaTags } from '../../components/MetaTags';

const Dashboard = () => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const prefetchPost = usePrefetchPost();

  // Fetch user's posts using custom hook
  const { data: posts, isLoading, error, refetch } = useDashboardPosts(user?.id);
  
  // Delete post mutation using custom hook
  const { deletePostMutation } = useDeletePost({
    userId: user?.id,
    onSuccess: () => {
      refetch();
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  });

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

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };

  if (isLoading && !posts) { // Only show loading state if we don't have cached data
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error.message}</div>;
  }

  return (
    <>
      <DefaultMetaTags 
        title="Dashboard" 
        description="Manage your posts and account on StackNova."
      />
      
      <div className="max-w-4xl mx-auto pb-8" id="dashboard-content">
        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deletePostMutation.isPending}
          itemName={postToDelete?.title}
          itemType="Post"
        />

        {/* Header Section */}
        <Header username={user?.username} />

        {/* Posts Section */}
        <PostsList 
          posts={posts}
          onDeleteClick={handleDeleteClick}
          prefetchPost={prefetchPost}
        />
      </div>
    </>
  );
};

export default Dashboard;