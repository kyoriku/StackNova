import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Pagination } from './components/Pagination';
import { PostsContainer } from './components/PostsContainer';
import { usePosts } from './hooks/usePosts';
import { usePrefetchPost } from './hooks/usePrefetchPost';
import { SEOMetaTags } from '../../components/MetaTags';

const ITEMS_PER_PAGE = 10;

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { posts: filteredPosts, isLoading, error } = usePosts(searchTerm);
  const prefetchPost = usePrefetchPost();

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <SEOMetaTags
        title=""
        description="Browse the latest programming questions and solutions from our developer community."
        path="/"
        image="/screenshots/1-StackNova-Home.jpg"
      />

      <section className="max-w-4xl mx-auto pb-8">
        <header>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Latest Posts
          </h1>
        </header>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resultsCount={filteredPosts.length}
        />

        <PostsContainer
          isLoading={isLoading}
          error={error}
          posts={paginatedPosts}
          prefetchPost={prefetchPost}
        />

        <nav aria-label="Pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </nav>
      </section>
    </>
  );
};

export default Posts;