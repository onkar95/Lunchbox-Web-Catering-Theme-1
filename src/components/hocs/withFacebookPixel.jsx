import React from "react";
import PropTypes from "prop-types";

const withFacebookPixel = (Component, eventType) => {
  const pixelized = ({payload, ...props}) => {
    if (window.fbq) {
      return (
        <Component
          {...props}
          tracker={() => {
            window.fbq("track", eventType, payload);
          }}
        />
      );
    }
    return <Component {...props} tracker={() => null} />;
  };
  pixelized.propTypes = {
    eventType: PropTypes.string,
  };
  pixelized.defaultProps = {
    eventType: "UnnamedEvent",
  };

  return pixelized;
};

export default withFacebookPixel;
