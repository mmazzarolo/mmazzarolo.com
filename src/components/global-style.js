import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

export const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  
  :root {
    --text-color: #303336;
    --text-content-color: #6F6865;
    --time-color: #777; 
    --link-color: #0366d6;
    --text-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    --header-font-family: font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  body {
    font-family: var(--text-font-family);
    color: var(--text-color);
    max-width: 690px;
    margin: 0 auto;
    padding: 30px 20px;
    font-size: 1rem;
    line-height: 1.7;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: var(--header-font-family);
    font-weight: 500;
    letter-spacing: 0.004em;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
    margin-top: 0;
  }

  a {
    color: var(--link-color);
    text-decoration: none;
    outline: 0;
  }

  a:hover {
    text-decoration: underline;
  }

  ul { 
    margin-bottom: 1rem;
  }

  blockquote {
    border-left: 0.25em solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
    margin-bottom: 1rem;
    margin: 0;
  }

  time {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--time-color);
  }

  kbd {
    background-color: #fafbfc;
    border: 1px solid #c6cbd1;
    border-bottom-color: #959da5;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #959da5;
    color: #444d56;
    display: inline-block;
    font-size: 11px;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
    font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;    
    box-sizing: border-box;
  }

  figure {
    margin-block-start: 2em;
    margin-block-end: 2.4em;
    margin-inline-start: 1.2em;
    margin-inline-end: 1.2em;
  }

  figure figcaption {
    font-weight: 200;
    color: gray;
    text-align: center;
    margin-top: 10px;
  }

  code,
  pre {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .gist-data {
   padding: 6px;
 }

  .gist .markdown-body .highlight pre, .gist .markdown-body pre {
    font-size: .85rem !important;
  }

  .float-images {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .float-images img {
    display: initial;
    max-width: initial;
    max-height: initial;
    margin: initial;
  }

  article img {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 590px;
  }

  video {
    max-width: 100%;
    margin-bottom: 26px;
    border-radius: 4px;
  }
`;
