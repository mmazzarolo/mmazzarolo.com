import React from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO_QUERY = graphql`
  query SEO {
    site {
      siteMetadata {
        description
        siteUrl
        title
        titleTemplate
        twitterUsername
      }
    }
  }
`;

function SEO({ description, location, title, twitterImage }) {
  const { site } = useStaticQuery(SEO_QUERY);

  const seo = {
    description: description || site.siteMetadata.description,
    image: ``, // TODO:
    title: title || site.siteMetadata.title,
    titleTemplate: site.siteMetadata.titleTemplate,
    twitterImage: ``, // TODO:
    twitterUsername: site.siteMetadata.twitterUsername
  };

  return (
    <Helmet title={seo.title} titleTemplate={seo.titleTemplate}>
      <link rel="icon" href="/favicon.png" />
      <meta name="description" content={seo.description} />
      <meta property="og:type" content="website" />
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {seo.twitterUsername && (
        <meta name="twitter:creator" content={seo.twitterUsername} />
      )}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.twitterImage && (
        <meta name="twitter:image" content={seo.twitterImage} />
      )}
    </Helmet>
  );
}

export default SEO;
