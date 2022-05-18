import React from "react";
import {Formik, Form} from "formik";
import {ElementsThemed, Fragments, HOCs} from "components";
import {usePatronContext} from "components/providers/patron";
import {useOrderContext} from "components/providers/Order/order";
import {Schemas, Copy, config, helpers} from "utils";
import styles from "./orderDetails.module.scss";
import commonStyles from "../index.module.css";

const {OrderDetailsSchema} = Schemas;
const {formatAddress, ErrorFocus} = helpers;

const {
  ThemeText,
  View,
  RadioButton: {RadioGroup, RadioButton},
  Field: {Input, Textarea, FieldItem},
} = ElementsThemed;
const {FooterButton} = Fragments;

const {withTemplate} = HOCs;

const OrderDetails = ({style, onSuccess}) => {
  const {patron} = usePatronContext();
  const orderContext = useOrderContext();
  const {
    order: {
      patronCompany,
      contactName,
      contactPhone,
      notes,
      numberOfGuests,
      needsServingUtensils,
      needsEatingUtensils,
      taxExemptId,
      deliveryInfo,
    },
  } = orderContext;

  const initName =
    patron && patron.firstName ? `${patron.firstName} ${patron.lastName}` : "";
  const initPhone =
    patron && patron.phone ? patron.phone.value || patron.phone : "";

  const {views, labels, cells, inputs, buttons} = style;

  const placeholder =
    orderContext.order.orderType === "delivery"
      ? Copy.ORDER_DETAILS.ORDER_DETAILS_NOTES_PLACEHOLDER_DELIVERY
      : Copy.ORDER_DETAILS.ORDER_DETAILS_NOTES_PLACEHOLDER_PICKUP;

  const inputAddress =
    orderContext.order.orderType === "delivery"
      ? formatAddress(deliveryInfo)
      : orderContext.order.address;

  return (
    <Formik
      initialValues={{
        contactName: contactName || initName,
        contactPhone: contactPhone || initPhone,
        needsEatingUtensils,
        needsServingUtensils,
        notes,
        numberOfGuests,
        patronCompany: patronCompany || "",
        taxExemptId,
      }}
      enableReinitialize
      validateOnChange={false}
      validationSchema={OrderDetailsSchema}
      onSubmit={(values) => {
        orderContext.setOrderDetails(values);
        onSuccess();
      }}
    >
      {({values, errors, ...formProps}) => (
        <View
          type={views.background}
          className={commonStyles.container}
          Component={Form}
        >
          <View
            type={views.background}
            className={`${commonStyles.content} ${styles.content}`}
          >
            {config.order_details.has_company ? (
              <Input
                label="Company"
                name="patronCompany"
                type={inputs.standard}
                error={errors.patronCompany}
                value={values.patronCompany}
                placeholder="Enter Company Name Here"
                onChange={(e) =>
                  formProps.setFieldValue("patronCompany", e.target.value)
                }
              />
            ) : null}

            <Input
              label="Address"
              type={inputs.standard}
              value={inputAddress}
              disabled
              placeholder="Your Address here"
            />

            <Input
              label="Contact Name"
              name="contactName"
              type={inputs.standard}
              error={errors.contactName}
              value={values.contactName}
              placeholder="Enter Full Name Here"
              onChange={(e) =>
                formProps.setFieldValue("contactName", e.target.value)
              }
            />

            <Input
              label="Contact Phone"
              name="contactPhone"
              type={inputs.standard}
              error={errors.contactPhone}
              value={values.contactPhone}
              placeholder="Enter Contact Phone Number Here"
              onChange={(e) =>
                formProps.setFieldValue("contactPhone", e.target.value)
              }
            />
            <Input
              label="Number of Guests"
              name="numberOfGuests"
              type={inputs.standard}
              error={errors.numberOfGuests}
              value={values.numberOfGuests}
              placeholder="Enter Number of Guest Here"
              suffix={
                <div className={styles.steppers}>
                  <div
                    role="button"
                    className={styles["arrow-up"]}
                    onClick={() => {
                      const asNumber = Number(values.numberOfGuests);
                      formProps.setFieldValue("numberOfGuests", asNumber + 1);
                    }}
                  />
                  <div
                    role="button"
                    className={styles["arrow-down"]}
                    onClick={() => {
                      const asNumber = Number(values.numberOfGuests);
                      formProps.setFieldValue(
                        "numberOfGuests",
                        asNumber > 1 ? asNumber - 1 : asNumber,
                      );
                    }}
                  />
                </div>
              }
              onChange={(e) => {
                formProps.setFieldValue(
                  "numberOfGuests",
                  e.target.value.replace(/[^-0-9]/g, ""),
                );
              }}
            />
            {config.order_details.has_utensils &&
              config.order_details.required_needs_serving_utensils && (
                <>
                  <FieldItem
                    type={labels.formLabel}
                    label="Serving Utensils"
                    inline
                  >
                    <RadioGroup type={buttons.radioButton}>
                      <RadioButton
                        value={values.needsServingUtensils}
                        onChange={() =>
                          formProps.setFieldValue("needsServingUtensils", true)
                        }
                      >
                        Yes
                      </RadioButton>
                      <RadioButton
                        value={!values.needsServingUtensils}
                        onChange={() =>
                          formProps.setFieldValue("needsServingUtensils", false)
                        }
                      >
                        No
                      </RadioButton>
                    </RadioGroup>
                  </FieldItem>
                </>
              )}

            {config.order_details.has_utensils &&
              config.order_details.required_needs_eating_utensils && (
                <>
                  <FieldItem
                    type={labels.formLabel}
                    label="Eating Utensils"
                    inline
                  >
                    <RadioGroup type={buttons.radioButton}>
                      <RadioButton
                        value={values.needsEatingUtensils}
                        onChange={() =>
                          formProps.setFieldValue("needsEatingUtensils", true)
                        }
                      >
                        Yes
                      </RadioButton>
                      <RadioButton
                        value={!values.needsEatingUtensils}
                        onChange={() =>
                          formProps.setFieldValue("needsEatingUtensils", false)
                        }
                      >
                        No
                      </RadioButton>
                    </RadioGroup>
                  </FieldItem>
                </>
              )}

            <Input
              label="Tax Exempt Id"
              name="taxExemptId"
              placeholder="Optional"
              type={inputs.standard}
              error={errors.taxExemptId}
              value={values.taxExemptId}
              onChange={(e) =>
                formProps.setFieldValue("taxExemptId", e.target.value)
              }
            />

            <Textarea
              label="Notes"
              name="notes"
              resizable={false}
              type={inputs.textarea}
              error={errors.notes}
              value={values.notes}
              placeholder={placeholder}
              rows={4}
              onChange={(e) => formProps.setFieldValue("notes", e.target.value)}
            />
            {errors.message && (
              <div>
                <ThemeText type={labels.error}>{errors.message}</ThemeText>
              </div>
            )}
          </View>
          <FooterButton
            type={cells.bottom}
            htmlType="submit"
            disabled={formProps.isSubmitting}
          >
            Confirm Details
          </FooterButton>
          <ErrorFocus />
        </View>
      )}
    </Formik>
  );
};

export default withTemplate(OrderDetails, "orderDetails");
