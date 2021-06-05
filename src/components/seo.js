import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO_QUERY = graphql`
  query SEO {
    site {
      siteMetadata {
        author
        description
        image
        siteUrl
        title
        titleTemplate
        twitterUsername
      }
    }
  }
`;

function SEO({ author, description, location, title, twitterImage }) {
  const { site } = useStaticQuery(SEO_QUERY);

  const seo = {
    author: author || site.siteMetadata.author,
    description: description || site.siteMetadata.description,
    image: `${site.siteMetadata.siteUrl}${site.siteMetadata.image}`,
    title: title || site.siteMetadata.title,
    titleTemplate: site.siteMetadata.titleTemplate,
    twitterImage: `${site.siteMetadata.siteUrl}${
      twitterImage || site.siteMetadata.image
    }`,
    twitterUsername: site.siteMetadata.twitterUsername,
  };

  return (
    <Helmet
      title={seo.title}
      titleTemplate={seo.titleTemplate}
      htmlAttributes={{
        lang: "en",
      }}
    >
      <link rel="icon" href="/favicon.png" />
      <meta name="description" content={seo.description} />
      <meta property="og:type" content="website" />
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta name="twitter:card" content="summary" />
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
      <script
        async
        defer
        data-domain="mmazzarolo.com"
        src="https://stats.mmazzarolo.com/js/index.js"
      ></script>
    </Helmet>
  );
}

export default SEO;
