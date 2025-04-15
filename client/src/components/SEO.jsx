// import { Helmet } from 'react-helmet';

// export const SEO = ({
//   title,
//   description,
//   canonicalUrl,
//   ogImage = null,
//   jsonLd = null,
//   children
// }) => {
//   // Default site info
//   const siteUrl = 'https://stacknova.ca';
//   const defaultImage = `${siteUrl}/screenshots/1-StackNova-Home.jpg`;
//   const metaImage = ogImage || defaultImage;

//   return (
//     <Helmet>
//       {/* Basic Meta Tags */}
//       <title>{title}</title>
//       <meta name="description" content={description} />
//       <link rel="canonical" href={canonicalUrl} />
      
//       {/* Open Graph Tags */}
//       <meta property="og:title" content={title} />
//       <meta property="og:description" content={description} />
//       <meta property="og:url" content={canonicalUrl} />
//       <meta property="og:type" content="website" />
//       <meta property="og:site_name" content="StackNova" />
//       <meta property="og:image" content={metaImage} />
      
//       {/* Twitter Card Tags */}
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content={title} />
//       <meta name="twitter:description" content={description} />
//       <meta name="twitter:image" content={metaImage} />
      
//       {/* JSON-LD Structured Data */}
//       {jsonLd && (
//         <script type="application/ld+json">
//           {JSON.stringify(jsonLd)}
//         </script>
//       )}
      
//       {/* Additional tags */}
//       {children}
//     </Helmet>
//   );
// };



// import { Helmet } from 'react-helmet';

// export const SEO = ({
//   title,
//   description,
//   canonicalPath = '',
//   type = 'website',
//   jsonLd = null,
//   noIndex = false
// }) => {
//   // Base site info
//   const siteName = 'StackNova';
//   const siteUrl = 'https://stacknova.ca';
//   const defaultDescription = 'Discover and engage with the latest programming insights, technical solutions, and developer discussions on StackNova. Share your knowledge and connect with a community of passionate developers.';
//   const defaultImage = `${siteUrl}/screenshots/1-StackNova-Home.jpg`;
  
//   // Generate full values
//   const fullTitle = title ? `${title} - ${siteName}` : siteName;
//   const metaDescription = description || defaultDescription;
//   const canonicalUrl = `${siteUrl}${canonicalPath}`;

//   return (
//     <Helmet>
//       <title>{fullTitle}</title>
//       <meta name="description" content={metaDescription} />
//       <link rel="canonical" href={canonicalUrl} />
      
//       {/* Open Graph Tags */}
//       <meta property="og:title" content={fullTitle} />
//       <meta property="og:description" content={metaDescription} />
//       <meta property="og:url" content={canonicalUrl} />
//       <meta property="og:type" content={type} />
//       <meta property="og:site_name" content={siteName} />
//       <meta property="og:image" content={defaultImage} />
      
//       {/* Twitter Card Tags */}
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content={fullTitle} />
//       <meta name="twitter:description" content={metaDescription} />
//       <meta name="twitter:image" content={defaultImage} />
      
//       {/* Search Engine Directives */}
//       {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
//       {/* JSON-LD Structured Data */}
//       {jsonLd && (
//         <script type="application/ld+json">
//           {JSON.stringify(jsonLd)}
//         </script>
//       )}
//     </Helmet>
//   );
// };


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