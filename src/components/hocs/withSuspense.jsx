import React, {Suspense} from "react";

export default (Component) => (props) => (
  <Suspense fallback={<h1>Loading</h1>}>
    <Component {...props} />
  </Suspense>
);
