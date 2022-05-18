import React, {useEffect} from "react";
import {useFormikContext} from "formik";

/**
* @author Judy Tan
ErrorFocus component will work on Formik && if input field have a name attribute
* Autoscrolls to required fields that are empty 
* Will highlight the input to make missing value more noticable
*/


const ErrorFocus = () => {
  const {isSubmitting, isValidating, errors} = useFormikContext();

  useEffect(() => {
    const keys = Object.keys(errors);

    if (keys.length > 0 && isSubmitting && !isValidating) {
      const errorElement = document.querySelector(`[name="${keys[0]}"]`)

      if (errorElement) {
        errorElement.scrollIntoView({behavior: "smooth"});
        errorElement.focus()
      }
    }
  }, [isSubmitting, isValidating, errors])
  return null;
}

export default ErrorFocus;