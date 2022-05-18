import React from "react";

export default (typesObject, envKey, defaultValue) => (props) => {
  const Component = typesObject[envKey] ? typesObject[envKey] : defaultValue;

  return <Component {...props} />;
};
