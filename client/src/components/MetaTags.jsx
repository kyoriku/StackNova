import { Helmet } from 'react-helmet-async';

export const DefaultMetaTags = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} - StackNova` : 'StackNova'}</title>
    <meta 
      name="description" 
      content={description || 'Share your technical insights and get answers from the developer community on StackNova'} 
    />
  </Helmet>
);