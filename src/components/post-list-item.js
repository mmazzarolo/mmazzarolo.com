import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const linkActiveClassName = "active";

export const PostListItem = ({ title, date, url }) => {
  return (
    <Root>
      <TitleLink to={url} activeClassName={linkActiveClassName}>
        {title}
      </TitleLink>
      <MobileSpacer> </MobileSpacer>
      <Time datetime="Sep 1">{date}</Time>
    </Root>
  );
};

const Root = styled.li`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 5px;
  padding-top: 12px;
  @media only screen and (max-width: 540px) {
    padding-top: 1rem;
    display: block;
  }
}
`;
const TitleLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
  &.${linkActiveClassName} {
    text-decoration: underline;
  }
`;

const Time = styled.time`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
`;

const MobileSpacer = styled.span`
  @media only screen and (min-width: 541px) {
    display: none;
  }
`;

export default PostListItem;
