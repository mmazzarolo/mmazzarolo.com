import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const linkActiveClassName = "active";

export const ReviewListItem = ({
  category,
  content,
  date,
  director,
  score,
  season,
  title,
  url,
  year
}) => {
  return (
    <Root>
      <Category>
        <a href="/categories/">{category}</a>
      </Category>
      <Header>
        <HeaderLeft>
          <TitleWrapper>
            <Title>
              <b>
                {title}
                {season && ` (Season ${season})`}
              </b>
            </Title>
            <MobileComma>,&nbsp;</MobileComma>
            <span class="review-director-and-year">
              {director} ({year})
            </span>
          </TitleWrapper>
        </HeaderLeft>
        <HeaderRight>
          <Time datetime="Sep 1">{date}</Time>
          <Score>{score}</Score>
        </HeaderRight>
      </Header>
      <Body>
        <section dangerouslySetInnerHTML={{ __html: content }} />
      </Body>
    </Root>
  );
};

const Root = styled.li`
  /* display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 5px;
  padding-top: 5px;
  @media only screen and (max-width: 540px) {
    padding-top: 1rem;
    display: block;
  } */
}`;

const Category = styled.div`
  text-align: right;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 5px;
`;

const HeaderLeft = styled.div``;

const TitleWrapper = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
  @media only screen and (max-width: 540px) {
    display: flex;
    flex-direction: column;
  }
}
`;

const Title = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 540px) {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
  }
`;

const Body = styled.div`
  padding-top: 0.6rem;
  color: var(--text-content-color);
`;

const MobileComma = styled.span`
  @media only screen and (max-width: 540px) {
    display: none;
  }
`;

const Score = styled.span`
  margin-left: 10px;
  text-align: right;
`;

const Time = styled.time`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
`;

export default ReviewListItem;
