import React, {useEffect, useMemo} from "react";
import {Formik, Form} from "formik";
import {ElementsThemed, Fragments, HOCs} from "components";
import {useResource} from "hooks";
import {Copy, helpers} from "utils";
import commonStyles from "../../index.module.css";
import css from "../index.module.css";

const {
  View,
  ThemeText,
  Field: {Select},
} = ElementsThemed;

const {FooterButton, Loader} = Fragments;

const {withTemplate} = HOCs;

const onChange =
  (key, set) =>
  ({target: {value}}) => {
    set(key, value);
  };

const ScheduleDate = ({
  order: {
    order: {orderType},
    setOrderDetails,
  },
  style,
  setHeader,
  onSuccess,
}) => {
  const {views, inputs, cells, labels} = style;
  const formText = orderType === "pickup" ? "Pick-up" : "Delivery";
  const {resource = [], fetching} = useResource({
    data: {orderType},
    path: "/catering/schedule",
  });

  const {dates, times} = useMemo(() => {
    const uniqueDays = resource.reduce((accu, i) => {
      if (!accu[i.day]) {
        accu[i.day] = [i];
      } else {
        accu[i.day].push(i);
      }
      return accu;
    }, {});
    const uniqueDaysToArray = Object.keys(uniqueDays);
    return {
      dates: uniqueDaysToArray,
      times: uniqueDays,
    };
  }, [resource]);

  useEffect(() => {
    setHeader && setHeader(`Schedule ${orderType} Date`);
  }, [orderType]);

  if (fetching) {
    return (
      <View type={views.background} className={commonStyles.container}>
        <div className={commonStyles.loader}>
          <Loader />
        </div>
      </View>
    );
  }
  return (
    <Formik
      initialValues={{
        date: "",
        time: "",
      }}
      validateOnChange={false}
      onSubmit={(values, {setStatus}) => {
        setStatus("status");
        if (!values.time) {
          setStatus("Please Select a time");
          return;
        }
        setOrderDetails({scheduledAt: values.time});
        onSuccess();
      }}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={views.background}
          className={commonStyles.container}
          Component={Form}
        >
          <div className={css["fields-container"]}>
            <Select
              label={`${formText} Date`}
              type={inputs.standard}
              error={errors.date}
              value={values.date}
              onChange={onChange("date", setFieldValue)}
            >
              <option value="">
                {Copy.CART_STATIC.SCHEDULED_DATE_DAY_PLACEHOLDER}
              </option>
              {dates.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>

            <Select
              label={`${formText} Time`}
              type={inputs.standard}
              disabled={!values.date}
              error={errors.time}
              value={values.time}
              onChange={onChange("time", setFieldValue)}
            >
              <option value="">
                {Copy.CART_STATIC.SCHEDULED_DATE_TIME_PLACEHOLDER}
              </option>
              {(times[values.date] || []).map((i) => (
                <option key={i.unixTimestamp} value={i.unixTimestamp}>
                  {i.time}
                </option>
              ))}
            </Select>
            {status && <ThemeText type={labels.error}>{status}</ThemeText>}
          </div>
          <FooterButton
            type={cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {helpers.stringReplacer(
              Copy.CART_STATIC.SCHEDULED_DATE_CONFIRM_TIME,
              [{replaceTarget: "{orderType}", replaceValue: orderType}],
            )}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(ScheduleDate, "scheduledAt");
