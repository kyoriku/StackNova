import { Helmet } from 'react-helmet';

export const UserMetaTags = ({ username }) => (
  <Helmet>
    <title>{username} - StackNova</title>
    <meta name="description" content={`View ${username}'s profile and posts on StackNova`} />
    
    {/* Open Graph tags */}
    <meta property="og:title" content={`${username} on StackNova`} />
    <meta property="og:description" content={`View ${username}'s profile and posts on StackNova`} />
    <meta property="og:url" content={`https://stacknova.ca/user/${username}`} />
    <meta property="og:type" content="profile" />
    
    {/* Twitter card tags */}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={`${username} - StackNova`} />
    <meta name="twitter:description" content={`View ${username}'s profile and posts on StackNova`} />
    <meta name="twitter:url" content={`https://stacknova.ca/user/${username}`} />
    
    <link rel="canonical" href={`https://stacknova.ca/user/${username}`} />
  </Helmet>
);