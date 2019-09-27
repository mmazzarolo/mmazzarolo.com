import React from "react";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default class IndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <SEO title="Mazzarolo Matteo" />
        <Root>
          <Main>
            <Greetings>Hi! I'm Matteo.</Greetings>
            <Username>@mmazzarolo</Username>
            <Content>
              I'm an introvert, I like{" "}
              <a href="https://rateyourmusic.com/collection/mazzaaaaa/r0.5-5.0,ss.dd">
                music
              </a>
              ,{" "}
              <a href="https://rateyourmusic.com/film_collection/mazzaaaaa/r0.5-5.0,ss.dd">
                movies
              </a>
              , reading tech news and wasting a lot of time on{" "}
              <a href="https://github.com/mmazzarolo">GitHub</a>.
            </Content>
            <SubContent>
              Currently, I'm building tools for designers at{" "}
              <a href="https://www.invisionapp.com/">InVision</a>.
            </SubContent>
            <SubContent>
              To keep updated with my work, follow me on{" "}
              <a href="https://twitter.com/mazzarolomatteo">Twitter</a>,{" "}
              <a href="https://github.com/mmazzarolo">GitHub</a> or subscribe to
              this blog <a href="">with RSS</a>.
            </SubContent>
          </Main>
        </Root>
      </Layout>
    );
  }
}

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 120px);
`;

const Main = styled.main`
  max-width: 540px;
`;

const Greetings = styled.h1`
  font-size: 3rem;
  margin: 0;
  line-height: 3rem;
  font-weight: 600;

  @media only screen and (max-width: 360px) {
    font-size: 2rem;
    line-height: 2rem;
  }
`;

const Username = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  color: #9b9b9b;
  @media only screen and (max-width: 360px) {
    font-size: 0.8rem;
  }
`;

const Content = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  line-height: 2.3rem;
  @media only screen and (max-width: 360px) {
    font-size: 1.6rem;
    line-height: 1.8rem;
  }
`;

const SubContent = styled.h4`
  font-size: 1.3rem;
  font-family: var(--text-font-family);
  font-weight: 300;
  @media only screen and (max-width: 360px) {
    font-size: 1rem;
  }
`;
