import React from "react";
import { Lottie } from "@lunchboxinc/react-lottie";
import {config} from "utils";

let json = "";

const Loader = () => {
  const controller = new AbortController();
  const {signal} = controller;
  const [animationData, setAnimationData] = React.useState(json);

  const fetchAnimation = async () => {
    try {
      const data = await fetch(
        `https://assets.lunchbox.io/${config.directory}/images/Loader/data.json`,
        {signal},
      ).then((r) => r.json());
      // const data = await fetch(`${process.env.PUBLIC_URL}/images/${config.directory}/data.json`, { signal }).then(r => r.json());
      json = data;
      setAnimationData(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!animationData) {
      fetchAnimation();
    }
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <Lottie
        options={{
          animationData,
          assetsPath: `https://assets.lunchbox.io/${config.directory}/images/Loader/images/`,
          autoplay: true,
          loop: true,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={100}
        width={100}
      />
    </div>
  );
};

export {Loader};
export default Loader;
