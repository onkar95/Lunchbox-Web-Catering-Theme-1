import * as React from "react";
import PropTypes from "prop-types";

const Image = ({src, defaultSrc, alt, ...props}) => {
  const image = src || defaultSrc;
  return <img src={image} alt={alt} {...props} />;
};

Image.propTypes = {
  alt: PropTypes.string,
  defaultSrc: PropTypes.string,
  src: PropTypes.string,
};

Image.defaultProps = {
  alt: "",
  defaultSrc: "",
  src: "",
};

export default Image;
