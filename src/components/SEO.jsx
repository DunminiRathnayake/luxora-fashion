import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, url, type = "website" }) => {
  const siteTitle = "Luxora Fashion";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Premium Luxury Fashion`;
  const defaultDesc = "Experience high-end luxury fashion curation with Luxora. Exquisite materials, cinematic designs, and premium streetwear.";
  const metaDesc = description || defaultDesc;
  
  // Dynamic canonical URL resolution
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  
  const defaultImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80";
  const metaImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
