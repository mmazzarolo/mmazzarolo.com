import React from "react";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";

const links = [
  { title: "Flat Icon: Free vector icons", url: "https://www.flaticon.com/" },
  { title: "Uses This", url: "https://usesthis.com/" },
  { title: "5000 best movies", url: "http://5000best.com/movies/" },
  { title: "Animista", url: "https://animista.net/" },
  { title: "Carbon", url: "https://carbon.now.sh/" },
  { title: "Hero Patterns", url: "http://www.heropatterns.com/" },
  { title: "Tom MacWright's blog", url: "https://macwright.org/" },
  { title: "Lobsters", url: "https://lobste.rs/" },
  { title: "∑ Xah Code", url: "http://xahlee.info/index.html" },
  { title: "Drew DeVault's Blog", url: "https://drewdevault.com/" },
  {
    title: "iTunes Artwork Finder",
    url: "https://bendodson.com/projects/itunes-artwork-finder/,index.html"
  },
  { title: "UI Garage", url: "https://uigarage.net/" },
  { title: "unDraw: Open-source illustrations", url: "https://undraw.co/" },
  {
    title: "Open Doodles: Free Illustrations",
    url: "https://www.opendoodles.com/"
  },
  {
    title: "Encoding Video for the web",
    url: "https://gist.github.com/Vestride/278e13915894821e1d6f"
  }
];

export const LinksIndexPage = () => {
  return (
    <Layout>
      <SEO title="Links" />
      <Root>
        <summary>
          <h3>🔖A few bookmarks</h3>
          <ul>
            {links.map(link => {
              const favicon = `https://www.google.com/s2/favicons?domain=${link.url}`;
              return (
                <li key={link.title}>
                  <Bookmark href={link.url}>
                    <Favicon src={favicon} />
                    {link.title}
                  </Bookmark>
                </li>
              );
            })}
          </ul>
        </summary>
      </Root>
    </Layout>
  );
};

export default LinksIndexPage;

const Root = styled.div`
  display: flex;
`;

const Bookmark = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Favicon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;
