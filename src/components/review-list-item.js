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
      <div class="review-list-subheader">
        <a href="/categories/">{category}</a>
      </div>
      <div class="review-list-header">
        <div class="review-list-left">
          <a class="review-link" href="{{ .RelPermalink }}">
            <span class="review-title">
              <b>
                {title}
                {season && ` (Season ${season})`}
              </b>
            </span>
            <span class="review-comma">,&nbsp;</span>
            <span class="review-director-and-year">
              {director} ({year})
            </span>
          </a>
        </div>
        <div class="review-list-right">
          <Time datetime="Sep 1">{date}</Time>
          <span>{score}</span>
        </div>
      </div>
      <div class="review-list-body">
        <section dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Root>
  );
};

const Root = styled.li`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 5px;
  padding-top: 5px;
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

export default ReviewListItem;
