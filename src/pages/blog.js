import React, { Fragment } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { groupBy, uniq } from "lodash";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";
import PostListItem from "../components/post-list-item";

const POST_LIST_QUERY = graphql`
  query PostListQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD")
            year: date(formatString: "YYYY")
            title
            description
          }
        }
      }
    }
  }
`;

const BlogIndexPage = () => {
  const queryResult = useStaticQuery(POST_LIST_QUERY);
  const posts = queryResult.allMarkdownRemark.edges;
  const years = uniq(posts.map((post) => post.node.frontmatter.year))
    .sort()
    .reverse();
  const postsByYear = groupBy(posts, (post) => post.node.frontmatter.year);
  return (
    <Layout>
      <SEO title="Blog" />
      {years.map((year) => {
        return (
          <Fragment key={year}>
            <Year>{year}</Year>
            <PostsGroup>
              {postsByYear[year].map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug;
                const date = node.frontmatter.date;
                const slug = node.fields.slug;
                return (
                  <PostListItem
                    key={slug}
                    title={title}
                    date={date}
                    url={slug}
                  />
                );
              })}
            </PostsGroup>
          </Fragment>
        );
      })}
    </Layout>
  );
};

export default BlogIndexPage;

const PostsGroup = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Year = styled.h3`
  margin-block-end: 0.3em;
  margin-block-start: 1.5em;
`;
