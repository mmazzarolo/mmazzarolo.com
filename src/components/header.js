import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "styled-components";

const HEADER_QUERY = graphql`
  query HeaderQuery {
    site {
      siteMetadata {
        menuLinks {
          name
          link
        }
      }
    }
  }
`;

export const Header = ({ description, lang, meta, title }) => {
  const { site } = useStaticQuery(HEADER_QUERY);
  const menuLinks = site.siteMetadata.menuLinks;

  return (
    <Root>
      <Nav>
        <Menu>
          {menuLinks.map((menuLink) => {
            return (
              <MenuItem key={menuLink.name}>
                <MenuItemLink
                  to={menuLink.link}
                  activeClassName={activeClassName}
                  partiallyActive={menuLink.link !== "/"}
                >
                  {menuLink.name}
                </MenuItemLink>
              </MenuItem>
            );
          })}
        </Menu>
      </Nav>
    </Root>
  );
};

const Root = styled.header`
  margin-bottom: 24px;
  box-shadow: 0 1px 0 rgba(38, 52, 74, 0.15);
  padding: 0 0 20px;
`;

const Nav = styled.nav`
  font-family: var(--text-font-family);
  color: var(--text-color);
  max-width: 690px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.5;
`;

const Menu = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: inline;
`;

const activeClassName = "active";

const MenuItemLink = styled(Link)`
  font-weight: 500;
  margin-right: 1rem;
  color: var(--text-color);
  &.${activeClassName} {
    text-decoration: underline;
  }
`;
