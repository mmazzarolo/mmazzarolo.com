import React from "react";
import { Header } from "./header";
import { GlobalStyle } from "./global-style";

export const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
