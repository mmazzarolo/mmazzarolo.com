import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ReviewListItem from "../components/review-list-item";

const REVIEW_LIST_QUERY = graphql`
  query ReviewListQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/reviews/" } }
    ) {
      edges {
        node {
          excerpt
          html
          fields {
            slug
          }
          frontmatter {
            artist
            author
            categories
            date(formatString: "MMM DD")
            director
            score
            season
            title
            year: date(formatString: "YYYY")
          }
        }
      }
    }
  }
`;

export const ReviewsIndexPage = () => {
  const queryResult = useStaticQuery(REVIEW_LIST_QUERY);
  const reviews = queryResult.allMarkdownRemark.edges;
  return (
    <Layout>
      <Reviews>
        <SEO title="Reviews" />
        {reviews.map(({ node, ...other }) => {
          const category = node.frontmatter.categories[0];
          const content = node.html;
          const date = node.frontmatter.date;
          const director =
            node.frontmatter.director ||
            node.frontmatter.artist ||
            node.frontmatter.author;
          const score = node.frontmatter.score;
          const season = node.frontmatter.season;
          const title = node.frontmatter.title || node.fields.slug;
          const year = node.frontmatter.year;
          const slug = node.fields.slug;
          return (
            <ReviewListItem
              key={slug}
              category={category}
              content={content}
              date={date}
              director={director}
              score={score}
              season={season}
              title={title}
              url={slug}
              year={year}
            />
          );
        })}
      </Reviews>
    </Layout>
  );
};

export default ReviewsIndexPage;

const Reviews = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Year = styled.h3`
  margin-block-end: 0.3em;
  margin-block-start: 1.5em;
`;
