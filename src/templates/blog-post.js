import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";

export const SINGLE_POST_QUERY = graphql`
  query SinglePostQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        description
      }
    }
  }
`;

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <Title>{post.frontmatter.title}</Title>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <Footer>@mmazzarolo - {post.frontmatter.date}</Footer>
    </Layout>
  );
};

export default BlogPostTemplate;

const Title = styled.h1`
  marginbottom: 0;
`;

const Footer = styled.footer`
  display: block;
  margin-top: 3rem;
  color: var(--time-color);
`;
