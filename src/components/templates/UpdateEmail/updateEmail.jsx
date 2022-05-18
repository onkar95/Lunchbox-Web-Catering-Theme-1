import React from "react";
// import VerifyCodeForm from './verifyCodeForm';
import EmailForm from "./emailForm";

// 2019-12-01 Tempory until we have proper email validation, then this will be a wizard like update phone

const UpdateEmail = ({
  onSuccess,
  email: initEmail = "",
  message = "",
  token,
}) => (
  <EmailForm
    onSuccess={onSuccess}
    email={initEmail}
    message={message}
    token={token}
  />
);

export default UpdateEmail;
