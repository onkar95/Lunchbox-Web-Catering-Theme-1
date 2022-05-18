/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";

const withPixelClick = (Component, eventType) => {
  const pixelized = ({onClick, ...props}) => {
    if (window.fbq) {
      return (
        <Component
          {...props}
          onClick={(e) => {
            const callback = (payload) => {
              window.fbq("track", eventType, payload);
            };
            onClick(e, callback);
          }}
        />
      );
    }
    return <Component {...props} />;
  };
  pixelized.propTypes = {
    onClick: PropTypes.func.isRequired,
  };
  pixelized.defaultProps = {};

  return pixelized;
};

export default withPixelClick;
