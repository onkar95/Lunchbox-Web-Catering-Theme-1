import React, {useEffect} from "react";
import {Fragments} from "components";
import {useResource, usePrevious} from "hooks";

const {Loader} = Fragments;

const AutoSend = ({email, onSuccess}) => {
  const [{fetching}] = useResource({
    data: {
      email,
    },
    method: "post",
    path: "/patron/forgot-password",
  });
  const prevFetching = usePrevious(fetching);
  useEffect(() => {
    if (!fetching && prevFetching) {
      onSuccess(email);
    }
  }, [fetching]);

  if (fetching) {
    return <Loader />;
  }

  return null;
};

export default AutoSend;
