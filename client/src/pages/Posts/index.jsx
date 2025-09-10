import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Pagination } from './components/Pagination';
import { PostsContainer } from './components/PostsContainer';
import { usePosts } from './hooks/usePosts';
import { usePrefetchPost } from './hooks/usePrefetchPost';
import { SEO } from '../../components/SEO';

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

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": "Latest Posts - StackNova",
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
          "url": `https://stacknova.ca/post/${post.slug}`, // Fixed: use slug instead of id
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
        title="Latest Posts"
        description="Discover and engage with the latest programming insights, technical solutions, and developer discussions on StackNova. Share your knowledge and connect with a community of passionate developers."
        canonicalPath=""
        jsonLd={jsonLd}
      />

      <section className="max-w-4xl mx-auto pb-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-start text-gray-900 dark:text-white">
            Latest Posts
          </h1>

          <div className="w-full md:w-112">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resultsCount={filteredPosts.length}
            />
          </div>
        </header>

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