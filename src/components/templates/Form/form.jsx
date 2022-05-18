import React, {useEffect, useState} from "react";
import {parse, format, addMinutes} from "date-fns";
import {Lbc, Hooks} from "@lunchboxinc/lunchbox-components";
import {useDidUpdateEffect} from "hooks";
import {HOCs, ElementsThemed} from "components";
import {useTemplateContext} from "components/providers/template";
import {axios} from "utils";
import {LiveSearch} from "./LiveSearch";
import css from "./form.module.css";

const {useForm} = Hooks;
const {
  Grid: {Row, Col},
} = Lbc;
const {withTemplate} = HOCs;
const {
  Field: {Select, FieldItem, Input},
} = ElementsThemed;

const {
  methods: {get},
} = axios;

const getSchedule = async (orderType) => {
  try {
    // let { data } = await get(`/catering/schedule-dates`, { orderType });
    const {data} = await get(`/catering/schedule`, {orderType});

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const timeOptions = (i) => {
  const timeStart = parse(Number(i.unixTimestamp) * 1000);
  const timeEnd = addMinutes(timeStart, 15);
  return (
    <option key={i.unixTimestamp} value={i.unixTimestamp}>
      {`${format(timeStart, "hh:mm a")} - ${format(timeEnd, "hh:mm a")}`}
    </option>
  );
};

const Form = ({
  orderType = "pickup",
  scheduledAt = "",
  onSelectTime,
  onChangeStreet2,
  recentAddresses,
  street2,
  style,
  ...props
}) => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);

  const [address, setAddress] = useState(props.address);
  const [fetching, setFetching] = useState(false);
  const {
    theme: {
      elements: {inputs},
    },
  } = useTemplateContext();

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
  const onChange =
    (key) =>
    ({target: {value}}) => {
      updateField(key, value);
      onFocus(key)();
    };

  useEffect(() => {
    if (!orderType) {
      return;
    }
    (async () => {
      setFetching(true);
      const availableDates = await getSchedule(orderType);

      const uniqueDays = availableDates.reduce((accu, i) => {
        if (!accu[i.day]) {
          accu[i.day] = [i];
        } else {
          accu[i.day].push(i);
        }
        return accu;
      }, {});
      const uniqueDaysToArray = Object.entries(uniqueDays).map(
        ([key, value]) => ({
          date: key,
          dayOfWeek: value[0].dayOfWeek,
        }),
      );
      setTimes(uniqueDays);
      setDates(uniqueDaysToArray);
      setFetching(false);
    })();
  }, [orderType]);

  useEffect(() => {
    onSelectTime(values.time);
  }, [values.time]);

  useDidUpdateEffect(() => {
    updateField("time", "");
  }, [values.date]);

  const formText = orderType === "pickup" ? "Pick-up" : "Delivery";
  const searchLabel =
    orderType === "pickup"
      ? "Where are you located"
      : "Where's your food going";
  return (
    <div>
      <Row gutter={15}>
        <Col xs="2-3">
          <FieldItem
            className={css.locationInput}
            type={inputs[style.inputs.standard].title}
            label={searchLabel}
          >
            <LiveSearch
              type={style.inputs.standard}
              orderType={orderType}
              resultType={style.buttons.searchResults}
              recentAddresses={recentAddresses}
              onSelect={(i) => {
                setAddress(i.text);
                props.onSelect(i);
              }}
              inputProps={{
                onChange: (i) => setAddress(i),
                placeholder: "Enter Your Address",
                value: address,
              }}
            />
          </FieldItem>
        </Col>
        <Col xs="1-3">
          <Input
            label="Apt/Rm/Fl"
            type={style.inputs.standard}
            placeholder="optional"
            value={street2}
            onChange={(e) => {
              onChangeStreet2(e.target.value);
            }}
          />
        </Col>
      </Row>

      <Select
        label={`${formText} Date`}
        type={style.inputs.standard}
        disabled={fetching}
        error={errors.date}
        value={values.date}
        onChange={onChange("date")}
        onFocus={onFocus("date")}
      >
        <option value="">Select a Date</option>
        {dates.map((i) => (
          <option key={i.date} value={i.date}>
            {`${i.dayOfWeek} ${i.date}`}
          </option>
        ))}
      </Select>

      <Select
        label={`${formText} Time`}
        type={style.inputs.standard}
        disabled={!values.date || !props.address || fetching}
        error={errors.time}
        value={values.time}
        onChange={onChange("time")}
        onFocus={onFocus("time")}
      >
        <option value="">Select a Time</option>
        {(times[values.date] || []).map(timeOptions)}
      </Select>
    </div>
  );
};

export default withTemplate(Form, "address");
