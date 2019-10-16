import React from "react";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";

const RYM_URL = "https://rateyourmusic.com/film_collection/mazzaaaaa";

export const ReviewsIndexPage = () => {
  return (
    <Layout>
      <SEO title="Reviews" />
      <Root>
        <summary>
          👋 Maintaining my own reviews was too time consuming.
          <br />
          If you're interested, you can find my album/movie reviews on{" "}
          <a href={RYM_URL}>RateYourMusic</a>.
        </summary>
      </Root>
    </Layout>
  );
};

export default ReviewsIndexPage;

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 128px);
`;
