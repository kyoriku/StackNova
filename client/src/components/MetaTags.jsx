import { Helmet } from 'react-helmet';

export const DefaultMetaTags = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} - StackNova` : 'StackNova'}</title>
    <meta 
      name="description" 
      content={description || 'Share your technical insights and get answers from the developer community on StackNova'} 
    />
  </Helmet>
);

export const SEOMetaTags = ({ 
  title, 
  description,
  path,
  noindex = false,
  image,
  type = 'website',
  structuredData = null,
  children
}) => {
  const siteName = 'StackNova';
  const baseUrl = 'https://stacknova.ca';
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
  
  // Default images based on page type
  const defaultImage = '/screenshots/1-StackNova-Home.jpg'; 
  const fullImageUrl = image 
    ? (image.startsWith('http') ? image : `${baseUrl}${image}`)
    : `${baseUrl}${defaultImage}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} - ${siteName}` : siteName}</title>
      <meta name="description" content={description || 'Share your technical insights and get answers from the developer community on StackNova'} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Index control */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title ? `${title} - ${siteName}` : siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title ? `${title} - ${siteName}` : siteName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Structured data if provided */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Allow additional custom meta tags */}
      {children}
    </Helmet>
  );
};

// For auth pages
export const AuthPageMetaTags = ({ title }) => (
  <Helmet>
    <title>{title ? `${title} - StackNova` : 'StackNova'}</title>
    <meta name="robots" content="noindex, nofollow" />
  </Helmet>
);