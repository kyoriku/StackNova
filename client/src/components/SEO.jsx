import { Helmet } from 'react-helmet';

export const SEO = ({
  title,
  description,
  canonicalPath = '',
  type = 'website',
  jsonLd = null,
  noIndex = false,
  image = null
}) => {
  // Base site info
  const siteName = 'StackNova';
  const siteUrl = 'https://stacknova.ca';
  const defaultDescription = 'Share your technical insights and get answers from the developer community on StackNova';
  const defaultImage = `${siteUrl}/screenshots/1-StackNova-Home.jpg`;
  
  // Generate full values
  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Search Engine Directives */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};