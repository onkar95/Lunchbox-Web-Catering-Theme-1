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

/**
 * ! DEPRECATED: do not use. Use <Image/> from elements folder
 * Returns an image tag with the url of the file from the s3 assets bucket
 *
 * @param {object} props
 * @param {string} props.mediaName - Name of the file ex art_menu_header.jpg
 * @param {string} props.mediaType - File extension if needed to override the extension on the mediaName ex png, svg
 */
const Image1 = ({mediaName, mediaType, ...props}) => {
  const src = ImageUrlGenerator(mediaName, mediaType);
  return <ImageBase src={src} {...props} />;
};

const Image = ({src, mediaName, mediaType, ...props}) => {
  if (src) {
    return <ImageBase src={src} {...props} />;
  }
  if (mediaName) {
    return <Image1 mediaName={mediaName} mediaType={mediaType} {...props} />;
  }
  return null;
};

export {Image};
export default Image;
