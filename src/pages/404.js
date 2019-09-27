import React from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";

export default () => {
  return (
    <Layout>
      <SEO title="404: Not Found" />
      <Main>
        <Title>Not found :(</Title>
        <Redirect>
          <a href="/">mmazzarolo.com</a>
        </Redirect>
      </Main>
    </Layout>
  );
};

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 120px);
}`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  line-height: 3rem;
  font-weight: 600;
`;

const Redirect = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  line-height: 2.3rem;
`;
