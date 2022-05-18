import React from "react";
import VerifyPhoneCode from "./verifyCodeForm";
import PhoneForm from "./phoneForm";

const UpdatePhone = ({phone: initPhone = "", onSuccess, token}) => {
  const [step, setStep] = React.useState(initPhone ? 1 : 0);
  const [phone, setPhone] = React.useState(initPhone);

  const onPhoneFormSuccess = (newPhone) => {
    setStep(1);
    setPhone(newPhone);
  };

  const onVerifyPhoneSuccess = () => {
    onSuccess && onSuccess({isPhoneVerified: true, phone});
  };

  switch (step) {
    case 1:
      return (
        <VerifyPhoneCode
          onSuccess={onVerifyPhoneSuccess}
          phone={phone}
          token={token}
        />
      );
    default:
      return <PhoneForm onSuccess={onPhoneFormSuccess} token={token} />;
  }
};

export default UpdatePhone;
