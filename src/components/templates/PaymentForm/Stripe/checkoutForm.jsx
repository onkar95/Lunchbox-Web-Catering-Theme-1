import React, {useState, useRef} from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {InlineLoader} from "components/elements";
import {loadStripe} from "@stripe/stripe-js";
import {Copy} from "utils";
import {PATRON_ADD_CARD, HANDLE_ERROR} from "utils/api";
import {FooterButton} from "components/fragments";
import {ThemeText} from "components/elementsThemed";
import {useTemplateContext} from "components/providers/template";
import {mapTokenizeError} from "./utils";
import css from "./stripe.module.scss";

const CheckoutForm = (props) => {
  const {
    style: {cells, labels},
    locationId,
    onSuccess,
  } = props;
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const templateContext = useTemplateContext();
  const {colors} = templateContext.theme;
  const textColor = colors[labels.primary.split("_")?.[1]];

  const createOptions = {
    style: {
      base: {
        "::placeholder": {
          color: "#aab7c4",
        },
        color: textColor,
        fontFamily: "Open Sans, sans-serif",
        fontSize: "20px",
        letterSpacing: "0.025em",
      },
      invalid: {
        color: "#c23d4b",
      },
    },
  };

  const handleFocus = () => setErr("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const cardElement = elements.getElement(CardElement);

    // e.g. createToken - https://stripe.com/docs/js/tokens_sources/create_token?type=cardElement
    const {token, error: tokenizeError} = await stripe.createToken(cardElement);

    if (tokenizeError && Object.keys(tokenizeError).length) {
      const tokenizeErrorMessage = mapTokenizeError(tokenizeError);
      setErr(tokenizeErrorMessage);
      setSubmitting(false);
      return;
    }

    const data = {
      cardNonce: `${token.id}`,
      isCateringEnabled: true,
    };
    try {
      await PATRON_ADD_CARD(data, {locationId});
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const mappedError = HANDLE_ERROR(error);
      setErr(
        mappedError.data ||
          "Processing a payment with the card you have provided was declined, please make sure you've provided the correct card information.",
      );
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={css["stripeForm-container"]}>
        <div className={css["stripeForm-items"]}>
          <CardElement onFocus={handleFocus} options={createOptions} />
        </div>
        {err && <ThemeText type={labels.error}>{err}</ThemeText>}
      </div>
      <FooterButton id="my-submit" onClick={submit} type={cells.bottom}>
        {submitting ? (
          <InlineLoader size={24} />
        ) : (
          Copy.PAYMENT_FORM_STATIC.PAYMENT_FORM_SAVE_BUTTON_TEXT
        )}
      </FooterButton>
    </>
  );
};

export default ({apiKey, ...props}) => {
  const ref = useRef(loadStripe(apiKey));
  return (
    <Elements stripe={ref.current}>
      <CheckoutForm {...props} />
    </Elements>
  );
};
