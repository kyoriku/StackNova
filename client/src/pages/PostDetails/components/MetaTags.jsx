import { Helmet } from 'react-helmet';

export const MetaTags = ({ post }) => (
  <Helmet>
    <title>{post.title} - StackNova</title>
    <meta name="description" content={post.excerpt || `${post.title} - StackNova`} />
    
    {/* Open Graph tags */}
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt || post.title} />
    <meta property="og:url" content={`https://stacknova.ca/post/${post.id}`} />
    <meta property="og:type" content="article" />
    
    {/* Twitter card tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.excerpt || post.title} />
    <meta name="twitter:url" content={`https://stacknova.ca/post/${post.id}`} />
    
    <link rel="canonical" href={`https://stacknova.ca/post/${post.id}`} />
  </Helmet>
);