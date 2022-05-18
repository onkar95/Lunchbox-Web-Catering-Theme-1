import React, {useEffect, useState, useReducer} from "react";
import {ElementsThemed, Fragments, HOCs} from "components";
import {DatePickForm} from "components/templates";
import {Copy, helpers} from "utils";
import commonStyles from "../../index.module.css";
import css from "../index.module.css";

const {View} = ElementsThemed;

const {FooterButton} = Fragments;

const {withTemplate} = HOCs;

const ScheduleDate = ({
  order: {
    order,
    order: {scheduledAt, orderType},
    setOrderDetails,
  },
  style,
  setHeader,
  onSuccess,
}) => {
  const locationId = order?.location?.id;
  const {views, cells} = style;
  const [isSubmitting, setSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (setHeader) setHeader(`Schedule ${orderType} Date`);
  }, [orderType]);

  const onSubmitTime = () => {
    setSubmitting(true);
    setOrderDetails({scheduledAt: selectedTime});
    onSuccess();
    setSubmitting(false);
  };

  const onSelectTime = (newTime) => {
    setSelectedTime(newTime);
  };

  return (
    <View type={views.background} className={commonStyles.container}>
      <div className={css["fields-container"]}>
        <DatePickForm
          locationId={locationId}
          template="address"
          diningOption={orderType}
          onSelectTime={onSelectTime}
          scheduledAt={scheduledAt}
        />
      </div>

      <FooterButton
        type={cells.bottom}
        disabled={isSubmitting}
        onClick={onSubmitTime}
      >
        {helpers.stringReplacer(Copy.CART_STATIC.SCHEDULED_DATE_CONFIRM_TIME, [
          {replaceTarget: "{orderType}", replaceValue: orderType},
        ])}
      </FooterButton>
    </View>
  );
};

export default withTemplate(ScheduleDate, "scheduledAt");
