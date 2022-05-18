import React, {useRef, useEffect} from "react";
import {Formik, Form} from "formik";
import {ElementsThemed, Fragments, HOCs} from "components";
import {axios, Schemas, Copy} from "utils";
import commonStyles from "../index.module.css";
import styles from "./index.module.css";
import {mapItems} from "../helpers";

const {
  View,
  ThemeText,
  Field: {Input},
} = ElementsThemed;

const {FooterButton} = Fragments;

const {withTemplate} = HOCs;

const Discount = ({style, onSuccess, items}) => {
  const {views, inputs, cells} = style;
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const validateCode = async ({code}, actions) => {
    try {
      const {data} = await axios.methods.post("/discount/validate", {
        code,
        items: mapItems(items),
      });
      if (data.discountId) {
        onSuccess({
          code,
          discount: data.discountId,
          promotionCodeId: data.promotionCodeId,
          promotionId: data.promotionId,
        });
        actions.setStatus(data.message);
      } else {
        actions.setStatus(data.message);
      }
    } catch (error) {
      const e = axios.handleError(error);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        code: "",
      }}
      validationSchema={Schemas.DiscountSchema}
      validateOnChange={false}
      onSubmit={validateCode}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={views.background}
          className={commonStyles.container}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              inputRef={inputRef}
              label={Copy.CHECKOUT_STATIC.DISCOUNT_PROMO_CODE_INPUT_LABEL}
              name="code"
              type={inputs.standard}
              error={errors.code}
              value={values.code}
              placeholder={
                Copy.CHECKOUT_STATIC.DISCOUNT_PROMO_CODE_INPUT_PLACEHOLDER
              }
              onChange={(e) => setFieldValue("code", e.target.value)}
            />
            {status && (
              <ThemeText type={style.labels.error}>{status}</ThemeText>
            )}
          </div>
          <FooterButton
            type={cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.CHECKOUT_STATIC.DISCOUNT_APPLY_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(Discount, "discount");
