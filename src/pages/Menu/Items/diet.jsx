import React from "react";
import {Fragments} from "components";
import styles from "./diet.module.css";

const {
  Image: {Image},
} = Fragments;

const Diet = ({diet}) => (
  <Image
    className={styles["item-diet"]}
    mediaName={`indicator_diet_${diet}`}
    mediaType="svg"
    alt={diet}
  />
);
export default Diet;
