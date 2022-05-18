import React, {useState, useEffect} from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {withTheme} from "styled-components";
import {Layout} from "components/elements";
import {usePatronContext} from "components/providers/patron";
import {FooterButton, Loader} from "components/fragments";
import {withTemplate} from "components/hocs";
import {ThemeText, View, Field} from "components/elementsThemed";
import {axios, Copy} from "utils";
import styles from "./paymentForm.module.css";
import formStyle from "../../form.module.css";

const {
  Grid: {Row, Col},
} = Lbc;
const {FieldItem} = Field;
const {Flex} = Layout;

const {handleError} = axios;

const applicationId = ["stage", "production"].includes(process.env.BUILD_ENV)
  ? "sq0idp-HFZAr1QIfIFtihBDVFRQUQ"
  : "sandbox-sq0idp-HFZAr1QIfIFtihBDVFRQUQ";

// Create and initialize a payment form object
const sqForm = ({
  applicationId,
  locationId,
  onLoad,
  onComplete,
  onInput,
  inputStyles,
}) =>
  new window.SqPaymentForm({
    applicationId,
    autoBuild: false,
    callbacks: {
      cardNonceResponseReceived: (errors, nonce, cardData) => {
        onComplete({cardData, errors, nonce});
      },

      onInput: (inputEvent) => {
        switch (inputEvent.eventType) {
          case "focusClassAdded":
            onInput({payload: [], type: "error"});
            break;
          case "focusClassRemoved":
            break;
          case "errorClassAdded":
            onInput({
              payload: [
                Copy.PAYMENT_FORM_STATIC.SQUARE_CARD_INFORMATION_ERROR_MESSAGE,
              ],
              type: "error",
            });
            break;
          case "errorClassRemoved":
            onInput({payload: [], type: "error"});
            break;
          case "cardBrandChanged":
            break;
          case "postalCodeChanged":
            break;
          default:
        }
      },

      paymentFormLoaded: () => {
        onLoad();
      },

      unsupportedBrowserDetected: () => {},
    },
    cardNumber: {
      elementId: "sq-card-number",
      placeholder: Copy.PAYMENT_FORM_STATIC.SQUARE_CARD_NUMBER_PLACEHOLDER,
    },

    cvv: {
      elementId: "sq-cvv",
      placeholder: Copy.PAYMENT_FORM_STATIC.SQUARE_CARD_CVV_NUMBER_PLACEHOLDER,
    },

    expirationDate: {
      elementId: "sq-expiration-date",
      placeholder:
        Copy.PAYMENT_FORM_STATIC.SQUARE_CARD_EXPIRATION_DATE_PLACEHOLDER,
    },
    inputClass: "sq-input",
    inputStyles: [inputStyles],
    locationId,

    postalCode: {
      elementId: "sq-postal-code",
      placeholder: Copy.PAYMENT_FORM_STATIC.SQUARE_CARD_ZIPCODE_PLACEHOLDER,
    },
  });

const loaderStyle = {
  overflow: "hidden",
  width: "100%",
};

const pluckErrors = (errors, field) =>
  errors
    .reduce((accu, i) => (i.field === field ? [...accu, i.message] : accu), [])
    .join("");

const PaymentForm = ({style, onSuccess, theme, locationId, ...props}) => {
  const {cells, labels, views} = style;

  const [font, color] = labels.primary.split("_");

  const {updateCard} = usePatronContext();
  const [isSupported] = useState(
    window.SqPaymentForm.isSupportedBrowser() || false,
  );
  const [errors, setErrors] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const [squarePaymentForm] = useState(() =>
    sqForm({
      applicationId,
      inputStyles: {
        color: `${theme.colors[color]}`,
        fontFamily: "Helvetica",
        fontSize: `${theme.fonts[font].size}px`,
        lineHeight: `${theme.fonts[font].size}px`,
        placeholderColor: `${theme.colors.alternateGray}`,
      },
      onComplete: (data) => {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors([]);
          saveCard(data.nonce);
        }
      },
      onInput: (data) => {
        if (data.type === "error") {
          setErrors([data.payload]);
        }
      },
      onLoad: () => setFetching(false),
    }),
  );

  const requestCardNonce = (event) => {
    event.preventDefault();
    squarePaymentForm.requestCardNonce();
  };

  const saveCard = async (cardNonce) => {
    setSaving(true);
    try {
      const res = await axios.methods.post(
        "/cards/",
        {
          cardNonce,
          isCateringEnabled: true,
        },
        locationId
          ? {
              headers: {
                locationId,
              },
            }
          : {},
      );
      updateCard(res.data);
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
      setErrors([handleError(error).data]);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isSupported) {
      squarePaymentForm.build();
    }
    return () => {
      squarePaymentForm.destroy();
    };
  }, [isSupported]);

  if (!isSupported) {
    return (
      <ThemeText type={labels.error}>
        Oops Your browser doesnt support this payment flow
      </ThemeText>
    );
  }

  return (
    <View type={views.background} Component="form" className={formStyle.form}>
      {fetching && (
        <Flex
          grow="1"
          direction="col"
          align="center"
          justify="center"
          style={loaderStyle}
        >
          <Loader />
        </Flex>
      )}

      <div className={formStyle["fields-container"]}>
        <div style={{visibility: fetching ? "hidden" : "initial"}}>
          <Row spacing={15}>
            <Col>
              <FieldItem type={labels.primary} label="Card Number">
                <div id="sq-card-number" className={styles["sq-card-number"]} />
                <hr className={styles.hr} />
                <ThemeText type={labels.error}>
                  {pluckErrors(errors, "cardNumber")}
                </ThemeText>
              </FieldItem>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col xs="1-3">
              <FieldItem type={labels.primary} label="Expiration">
                <div
                  id="sq-expiration-date"
                  className={styles["sq-expiration-date"]}
                />
                <hr className={styles.hr} />
                <ThemeText type={labels.error}>
                  {pluckErrors(errors, "expirationDate")}
                </ThemeText>
              </FieldItem>
            </Col>

            <Col xs="1-3">
              <FieldItem type={labels.primary} label="CVV">
                <div id="sq-cvv" className={styles["sq-cvv"]} />
                <hr className={styles.hr} />
                <ThemeText type={labels.error}>
                  {pluckErrors(errors, "cvv")}
                </ThemeText>
              </FieldItem>
            </Col>
            <Col xs="1-3">
              <FieldItem type={labels.primary} label="Postal">
                <div id="sq-postal-code" className={styles["sq-postal-code"]} />
                <hr className={styles.hr} />
                <ThemeText type={labels.error}>
                  {pluckErrors(errors, "postalCode")}
                </ThemeText>
              </FieldItem>
            </Col>
          </Row>

          {errors
            .filter((i) => i.type === undefined)
            .map((i, index) => (
              <ThemeText key={index} type={labels.error}>
                {i}
              </ThemeText>
            ))}
        </div>
      </div>
      {!fetching && (
        <FooterButton
          type={cells.bottom}
          disabled={saving}
          onClick={requestCardNonce}
        >
          {saving
            ? Copy.PAYMENT_FORM_STATIC.BUTTON_TEXT_SAVING
            : Copy.PAYMENT_FORM_STATIC.PAYMENT_FORM_SAVE_BUTTON_TEXT}
        </FooterButton>
      )}
    </View>
  );
};

export default withTheme(withTemplate(PaymentForm, "payment"));
