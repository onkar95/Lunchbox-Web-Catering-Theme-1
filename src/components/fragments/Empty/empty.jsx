import React from "react";
import {Elements} from "components";
import {config} from "utils";
import {Image} from "../Image";
import styles from "./empty.module.css";

const {
  Layout: {Flex},
} = Elements;

const ImageSelector = ({img}) => {
  switch (img) {
    case "empty": {
      return (
        <Image.Image src={config?.images?.art_empty_cart} alt="Empty Cart" />
      );
    }
    case "error": {
      return (
        <Image.Image
          src={config?.images?.art_empty_locations}
          alt="Error Occured"
        />
      );
    }
    default:
      return null;
  }
};

const Empty = ({img, children}) => (
  <Flex
    direction="col"
    align="center"
    justify="center"
    grow={1}
    className={styles["cart-empty"]}
  >
    <div>{children}</div>
    <ImageSelector img={img} />
  </Flex>
);

export default Empty;
