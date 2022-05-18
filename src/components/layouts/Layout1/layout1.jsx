import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {config} from "utils";
import {Elements} from "components";
import styles from "./layout1.module.css";

const {
  Layout: {Flex},
} = Elements;

const {
  Grid: {Row, Col},
} = Lbc;

const bkgImg = {
  backgroundImage: `url(${config?.images?.art_background})`,
};
const contentProps = {
  lg: {offset: "1-3", span: "1-3"},
  md: {offset: "1-4", span: "1-2"},
  sm: {offset: "1-6", span: "2-3"},
  xs: {span: "1"},
};

const Layout1 = ({children}) => (
  <Flex
    className={styles.container}
    style={bkgImg}
    direction="col"
    justify="center"
  >
    <Row flex style={{flexGrow: 1}}>
      <Col
        {...contentProps}
        style={{
          alignSelf: "center",
          display: "flex",
          height: "80vh",
        }}
      >
        {children}
      </Col>
    </Row>
  </Flex>
);

Layout1.defaultProps = {
  logo: true,
};

export default Layout1;
