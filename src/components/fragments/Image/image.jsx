import React from "react";
import {config} from "utils";
import {Image as ImageBase} from "../../elements";

const baseURL = "https://assets.lunchbox.io";
/**
 * Helper function for returning an asset URL
 *
 * @param {string} mediaName - Name of the file ex art_menu_header.jpg
 * @param {string} mediaType - File extension if needed to override the extension on the mediaName ex png, svg
 */
const ImageUrlGenerator = (mediaName, mediaType) => {
  const name = config.theme.directory ?? config.directory;
  return `${baseURL}/${name}/images/${mediaName}.${mediaType}`;
};

const Image = ({src, mediaName, mediaType, ...props}) => {
  if (src) {
    return <ImageBase src={src} {...props} />;
  }
  if (mediaName) {
    return (
      <ImageBase src={ImageUrlGenerator(mediaName, mediaType)} {...props} />
    );
  }
  return null;
};

export {Image};
export default {
  Image,
};
