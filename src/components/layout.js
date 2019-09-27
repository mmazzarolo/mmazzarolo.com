import React from "react";
import { Header } from "./header";
import { GlobalStyle } from "./global-style";

class Layout extends React.Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <Header />
        <main>{this.props.children}</main>
      </>
    );
  }
}

export default Layout;
