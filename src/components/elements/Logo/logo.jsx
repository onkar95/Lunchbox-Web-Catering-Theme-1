import React from "react";
import PropTypes from "prop-types";
import {config} from "utils";
import styles from "./logo.module.css";

const Logo = ({src, style}) => (
  <img
    className={styles.logo}
    style={style}
    src={src}
    alt={`${config.restaurant} Logo`}
  />
);

Logo.propTypes = {
  src: PropTypes.string.isRequired,
};

Logo.defaultProps = {};

export default Logo;
