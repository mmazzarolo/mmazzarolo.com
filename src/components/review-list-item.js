import React from "react";
import Img from "gatsby-image";
import styled from "styled-components";
import { times } from "lodash";

export const ReviewListItem = ({
  category,
  content,
  featuredImgFluid,
  date,
  director,
  score,
  season,
  title,
  url,
  year
}) => {
  const titleAndSeason = `${title}${season ? ` (Season ${season})` : ""}`;
  const directorAndYear = `${director} (${year})`;
  const positiveStars = times(score).map(x => "★");
  const negativeStarts = times(5 - score).map(x => "☆");
  const stars = positiveStars.concat(negativeStarts).join("");
  return (
    <Root>
      <Category>#{category}</Category>
      <Header>
        <HeaderLeft>
          <CoverArtImage fluid={featuredImgFluid} />
          <Info>
            <TitleAndSeason>{titleAndSeason}</TitleAndSeason>
            <DirectorAndYear>{directorAndYear}</DirectorAndYear>
          </Info>
        </HeaderLeft>
        <HeaderRight>
          <Score>{stars}</Score>
          <Time datetime="Sep 1">{date}</Time>
        </HeaderRight>
      </Header>
      <Body>
        <section dangerouslySetInnerHTML={{ __html: content }} />
      </Body>
    </Root>
  );
};

const Root = styled.li``;

const Category = styled.div`
  text-align: right;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 5px;
  flex-direction: column;
  justify-content: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CoverArtImage = styled(Img)`
  display: block;
  min-width: 70px;
  min-height: 70px;
  width: 70px;
  height: 70px;
  border-radius: 3px;
  margin-right: 12px;
  @media only screen and (max-width: 540px) {
    min-width: 50px;
    min-height: 50px;
    width: 50px;
    height: 50px;
  }
`;

const TitleAndSeason = styled.span`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DirectorAndYear = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* margin-left: 10px; */
`;

const Body = styled.div`
  padding-top: 0.6rem;
  color: var(--text-content-color);
`;

const Score = styled.span`
  text-align: right;
`;

const Time = styled.time`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  text-align: right;
`;

export default ReviewListItem;
