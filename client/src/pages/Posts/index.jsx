import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { SearchBar } from './components/SearchBar';
import { Pagination } from './components/Pagination';
import { PostsContainer } from './components/PostsContainer';
import { usePosts } from './hooks/usePosts';
import { usePrefetchPost } from './hooks/usePrefetchPost';
import { SEO } from '../../components/SEO';

const ITEMS_PER_PAGE = 10;

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lastBrowsePage, setLastBrowsePage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Get state from URL with basic validation
  const requestedPage = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const urlSearchTerm = searchParams.get('search') || '';

  // Use local search term for instant results, URL term for initial load
  const { posts: filteredPosts, isLoading, error } = usePosts(localSearchTerm);
  const prefetchPost = usePrefetchPost();

  // Calculate pagination and clamp page to valid range
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  // Helper function to build consistent URL params (search first, then page)
  const buildURLParams = (searchTerm, page) => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (page && page !== 1) {
      params.set('page', page.toString());
    }
    return params;
  };

  // Initialize local search term from URL
  useEffect(() => {
    setLocalSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  // Redirect to valid page if URL page is out of bounds
  useEffect(() => {
    if (!isLoading && totalPages > 0 && requestedPage !== currentPage) {
      const params = buildURLParams(localSearchTerm, currentPage);
      setSearchParams(params, { replace: true });
    }
  }, [isLoading, totalPages, requestedPage, currentPage, localSearchTerm, setSearchParams]);

  // Track last browse page when not searching
  useEffect(() => {
    if (!localSearchTerm) {
      setLastBrowsePage(currentPage);
    }
  }, [currentPage, localSearchTerm]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  // Handle page changes
  const handlePageChange = (page) => {
    const params = buildURLParams(localSearchTerm, page);
    setSearchParams(params);
  };

  // Debounced URL update function
  const debouncedUpdateURL = useCallback(
    debounce((term) => {
      const params = term.trim() 
        ? buildURLParams(term.trim(), 1)
        : buildURLParams('', lastBrowsePage);
      setSearchParams(params);
    }, 500),
    [lastBrowsePage]
  );

  // Handle search changes with instant results and debounced URL
  const handleSearchChange = (term) => {
    setLocalSearchTerm(term);
    debouncedUpdateURL(term);
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    const params = buildURLParams('', lastBrowsePage);
    setSearchParams(params);
  };

  // Calculate pagination display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": "StackNova",
    "description": "Discover and engage with the latest programming insights, technical solutions, and developer discussions on StackNova. Share your knowledge and connect with a community of passionate developers.",
    "url": "https://stacknova.ca",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": paginatedPosts.map((post, index) => ({
        "@type": "ListItem",
        "position": startIndex + index + 1,
        "item": {
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "url": `https://stacknova.ca/post/${post.slug}`,
          "datePublished": post.createdAt,
          "author": {
            "@type": "Person",
            "name": post.user.username
          },
          "commentCount": post.comments?.length || post.commentCount || 0
        }
      }))
    }
  };

  return (
    <>
      <SEO
      title={localSearchTerm ? `${localSearchTerm} - Search Results` : ""}
        description="Discover and engage with the latest programming insights, technical solutions, and developer discussions on StackNova. Share your knowledge and connect with a community of passionate developers."
        canonicalPath=""
        jsonLd={jsonLd}
      />

      <section className="max-w-4xl mx-auto pb-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-start text-gray-900 dark:text-white">
            {localSearchTerm ? "Search Results" : "Latest Posts"}
          </h1>

          <div className="w-full md:w-112">
            <SearchBar
              searchTerm={localSearchTerm}
              setSearchTerm={handleSearchChange}
              resultsCount={filteredPosts.length}
              onClear={handleClearSearch}
              lastBrowsePage={localSearchTerm ? lastBrowsePage : null}
            />
          </div>
        </header>

        <PostsContainer
          isLoading={isLoading}
          error={error}
          posts={paginatedPosts}
          prefetchPost={prefetchPost}
        />

        {totalPages > 1 && (
          <nav aria-label="Pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </nav>
        )}
      </section>
    </>
  );
};

export default Posts;