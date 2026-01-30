
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical }) => {
  const location = useLocation();
  const baseTitle = "BoiSathi.com | পুরোনো বই, নতুন আশা";
  const baseDesc = "Bangladesh's premier student marketplace for buying, selling, and donating books.";

  useEffect(() => {
    // Update Document Title
    document.title = title ? `${title} | BoiSathi` : baseTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || baseDesc);
    }

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || baseTitle);

    // Update OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || baseDesc);

    // Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical || `https://boisathi.com${location.pathname}`);
    }
  }, [title, description, canonical, location]);

  return null;
};

export default SEO;
