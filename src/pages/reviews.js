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
            date(formatString: "MMM DD, 'YY")
            director
            featured_image {
              childImageSharp {
                fluid(maxWidth: 60) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
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
      <SEO title="Reviews" />
      <summary>
        👋 Here I'm logging my opinions and feelings about movies, tv-series,
        albums and books, with a score from 1 to 5 to indicate how much I
        enjoyed them.
        <br />
        P.S.: My older{" "}
        <a href="https://rateyourmusic.com/~mazzaaaaa#musicrating">
          albums
        </a>{" "}
        and <a href="https://rateyourmusic.com/~mazzaaaaa#filmrating">movies</a>{" "}
        ratings are still on RateYourMusic.
      </summary>
      <br />
      <Reviews>
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

          const featuredImgFluid =
            node.frontmatter.featured_image.childImageSharp.fluid;

          return (
            <ReviewListItem
              key={slug}
              category={category}
              content={content}
              featuredImgFluid={featuredImgFluid}
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
