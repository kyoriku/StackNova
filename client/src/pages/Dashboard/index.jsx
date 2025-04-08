import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { usePrefetchPost } from '../Posts/hooks/usePrefetchPost';
import { useDashboardPosts } from './hooks/useDashboardPosts';
import { useDeletePost } from './hooks/useDeletePost';
import { DeleteModal } from './components/DeleteModal';
import { Header } from './components/Header';
import { PostsList } from './components/PostsList';
import { Pagination } from '../Posts/components/Pagination';
import { DefaultMetaTags } from '../../components/MetaTags';
import { useQueryClient } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10; // Set the number of items per page

const Dashboard = () => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page
  const prefetchPost = usePrefetchPost();
  const queryClient = useQueryClient();
  
  // Check for prefetched data
  const prefetchedData = queryClient.getQueryData(['userPosts', user?.id]);
  
  // Fetch user's posts using custom hook with suspense if no prefetched data
  const { data: posts, error, refetch } = useDashboardPosts(user?.id, {
    suspense: !prefetchedData
  });
  
  // Delete post mutation using custom hook
  const { deletePostMutation } = useDeletePost({
    userId: user?.id,
    onSuccess: () => {
      // Calculate the new total number of pages after deletion
      const newTotalItems = posts.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
      
      // If current page is now invalid, adjust it
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        // If there are no posts left
        setCurrentPage(1);
      }
      
      refetch();
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  });

  // Reset to first page when posts change significantly
  useEffect(() => {
    setCurrentPage(1);
  }, [user?.id]);

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

  // Calculate pagination
  const totalPages = posts ? Math.ceil(posts.length / ITEMS_PER_PAGE) : 0;
  const paginatedPosts = posts ? posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) : null;

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error.message}</div>;
  }

  return (
    <>
      <DefaultMetaTags 
        title="Dashboard" 
        description="Manage your posts on StackNova."
      />
      
      <div className="max-w-5xl mx-auto pb-8" id="dashboard-content">
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
          posts={paginatedPosts}
          onDeleteClick={handleDeleteClick}
          prefetchPost={prefetchPost}
        />

        {/* Pagination Section */}
        {posts && posts.length > ITEMS_PER_PAGE && (
          <nav aria-label="Pagination" className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </nav>
        )}
      </div>
    </>
  );
};

export default Dashboard;