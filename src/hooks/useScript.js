import {useEffect, useState} from "react";

const cachedScripts = [];
const useScript = (url) => {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    error: false,
    loaded: false,
  });

  useEffect(() => {
    if (cachedScripts.includes(url)) {
      setState({
        error: false,
        loaded: true,
      });
    } else {
      cachedScripts.push(url);
      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      // Script event listener callbacks for load and error
      const onScriptLoad = () => {
        setState({
          error: false,
          loaded: true,
        });
      };

      const onScriptError = () => {
        // Remove from cachedScripts we can try loading again
        const index = cachedScripts.indexOf(url);
        if (index >= 0) cachedScripts.splice(index, 1);
        script.remove();

        setState({
          error: true,
          loaded: true,
        });
      };

      script.addEventListener("load", onScriptLoad);
      script.addEventListener("error", onScriptError);

      document.body.appendChild(script);
      // Remove event listeners on cleanup
      return () => {
        script.removeEventListener("load", onScriptLoad);
        script.removeEventListener("error", onScriptError);
      };
    }
  }, [url]);

  return state;
};

export default useScript;
