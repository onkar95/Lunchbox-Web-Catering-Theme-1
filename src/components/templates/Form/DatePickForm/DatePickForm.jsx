import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {Hooks} from "@lunchboxinc/lunchbox-components";
import {useDidUpdateEffect} from "hooks";
import {DatePicker} from "components/elementsThemed/Field";
import {axios, Copy} from "utils";
import {withTemplate} from "components/hocs";
import styles from "./DatePickForm.module.css";

const {useForm} = Hooks;
const {
  methods: {get},
} = axios;

const getScheduleDate = async (diningOption, locationId) => {
  try {
    const {data} = await get(
      `/catering/schedule-dates`,
      {orderType: diningOption},
      {headers: {locationId}},
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getScheduleTime = async (diningOption, locationId, unixTimestamp) => {
  try {
    const {data} = await get(
      `/catering/schedule-dates/${unixTimestamp}`,
      {orderType: diningOption},
      {headers: {locationId}},
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const formatAvailableTimes = (times = []) => {
  const availableTime = times.reduce((acc, curTime) => {
    return [
      ...acc,
      {
        content: `${curTime.time}`,
        key: curTime.time,
        unixTimestamp: curTime.unixTimestamp,
        value: curTime.time,
      },
    ];
  }, []);
  return availableTime;
};

const formatAvailableDates = (dates) => {
  const availableDates = dates.reduce((acc, curDate) => {
    return [
      ...acc,
      {
        content: `${curDate.date}`,
        key: curDate.date,
        unixTimestamp: curDate.unixTimestamp,
        value: curDate.date,
      },
    ];
  }, []);
  return availableDates;
};

const DatePickForm = ({
  diningOption = "pickup",
  scheduledAt = "",
  onSelectTime,
  style,
  locationId,
}) => {
  const [dates, setDates] = useState([]);
  const [activeDate, setActiveDate] = useState(null);
  const [activeTime, setActiveTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [fetching, setFetching] = useState(false);

  const {values, errors, updateField, updateError} = useForm({
    initialValues: scheduledAt
      ? {
          date: format(new Date(scheduledAt * 1000), "ddd MM/DD/YYYY"),
          time: scheduledAt,
        }
      : {
          date: "",
          time: "",
        },
  });

  const onFocus = (key) => () => {
    updateError(key, false);
  };

  const onTimeChange =
    (key) =>
    ({target: {value}}) => {
      const selectedTime = times.find((time) => time.time === value);
      setActiveTime(selectedTime);
      updateField(key, value);
      onFocus(key)();
    };

  const onDateChange =
    (key) =>
    ({target: {value}}) => {
      const selectedDate = dates.find((date) => date.date === value);
      setActiveDate(selectedDate);
      updateField(key, value);
      onFocus(key)();
    };

  useEffect(() => {
    if (!diningOption || !locationId) {
      return;
    }
    const fetchDate = async () => {
      setFetching(true);
      const availableDates = await getScheduleDate(diningOption, locationId);

      const availableDatesToArray = availableDates.reduce((acc, date) => {
        return [...acc, {date: date.pretty, unixTimestamp: date.unixTimestamp}];
      }, []);
      setDates(availableDatesToArray);
      setFetching(false);
    };

    fetchDate();
  }, [diningOption, locationId]);

  useEffect(() => {
    if (!diningOption || !locationId || !activeDate) {
      return;
    }
    const fetchTime = async () => {
      if (activeDate.unixTimestamp) {
        setFetching(true);
        const availableTime = await getScheduleTime(
          diningOption,
          locationId,
          activeDate.unixTimestamp,
        );
        setTimes(availableTime);
        setFetching(false);
      }
    };
    fetchTime();
  }, [diningOption, locationId, activeDate]);

  useEffect(() => {
    if (activeTime) {
      onSelectTime(activeTime.unixTimestamp);
    }
  }, [activeTime]);

  useDidUpdateEffect(() => {
    updateField("time", "");
  }, [values.date]);

  const formText = diningOption === "pickup" ? "Pick-up" : "Delivery";

  return (
    <div className={styles["date-pick-container"]}>
      <DatePicker
        label={`${formText} ${Copy.DATE_PICK_FORM_STATIC.DATE_INPUT_LABEL}`}
        type={style.inputs.standard}
        disabled={fetching}
        error={errors.date}
        value={values.date}
        onChange={onDateChange("date")}
        onFocus={onFocus("date")}
        placeholder={Copy.DATE_PICK_FORM_STATIC.DATE_INPUT_PLACEHOLDER}
        availableOptions={formatAvailableDates(dates)}
      />

      <DatePicker
        label={`${formText} ${Copy.DATE_PICK_FORM_STATIC.TIME_INPUT_LABEL}`}
        type={style.inputs.standard}
        disabled={!values.date || fetching}
        error={errors.time}
        value={values.time}
        onChange={onTimeChange("time")}
        onFocus={onFocus("time")}
        placeholder={Copy.DATE_PICK_FORM_STATIC.TIME_INPUT_PLACEHOLDER}
        availableOptions={formatAvailableTimes(times)}
      />
    </div>
  );
};

export default withTemplate(DatePickForm, "address");
