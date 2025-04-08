import { PostItem } from './PostItem';

export const PostsList = ({ posts, prefetchPost }) => (
  <section 
    aria-label="Posts list" 
    className="max-w-5xl mx-auto"
  >
    <h2 className="sr-only">Blog posts</h2>
    <div role="feed" aria-busy="false" aria-label="Blog posts" className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} prefetchPost={prefetchPost} />
      ))}
    </div>
  </section>
);