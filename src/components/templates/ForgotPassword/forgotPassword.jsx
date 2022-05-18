import React, {useState} from "react";
import EmailForm from "./emailForm";
import VerifyEmailForm from "./verifyEmailForm";
import UpdatePasswordForm from "./updatePasswordForm";
import AutoSendPin from "./autoSendPin";

const ForgotPassword = ({onSuccess, location}) => {
  const {autoSend = false, message = "", email: initEmail = ""} =
    location.state || {};

  const [step, setStep] = useState(0);
  const [patronData, setPatronData] = useState("");
  const [email, setEmail] = useState(initEmail);

  const onEmailSuccess = (enteredEmail) => {
    setEmail(enteredEmail);
    setStep(1);
  };
  const onVerifySuccess = (data) => {
    setPatronData(data);
    setStep(2);
  };
  const onChangePasswordSuccess = () => {
    onSuccess(patronData);
  };

  switch (step) {
    case 1:
      return (
        <VerifyEmailForm
          onSuccess={onVerifySuccess}
          email={email}
          message={message}
        />
      );
    case 2:
      return (
        <UpdatePasswordForm
          onSuccess={onChangePasswordSuccess}
          patron={patronData}
        />
      );
    default: {
      if (autoSend) {
        return <AutoSendPin email={email} onSuccess={onEmailSuccess} />;
      }
      return <EmailForm onSuccess={onEmailSuccess} />;
    }
  }
};

export default ForgotPassword;
