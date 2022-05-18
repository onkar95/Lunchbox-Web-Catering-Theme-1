import React from "react";
import LazyLoad from "react-lazy-load";
import Image from "../Image";

const LazyImage = () => {
  return (
    <LazyLoad width={100} height={100} debounce={false} offsetVertical={500}>
      <Image />
    </LazyLoad>
  );
};

LazyImage.propTypes = {};
LazyImage.defaultProps = {};

export {LazyImage};
export default LazyImage;
