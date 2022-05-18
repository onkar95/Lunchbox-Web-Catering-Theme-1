import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {Lbc, Hooks} from "@lunchboxinc/lunchbox-components";
import {useDidUpdateEffect} from "hooks";
import {HOCs, ElementsThemed} from "components";
import {useTemplateContext} from "components/providers/template";
import {WebApis, Copy} from "utils";
import {Image as ImageComps} from "components/fragments";
import {LiveSearch} from "../LiveSearch";
import css from "./LocationForm.module.css";

const {useForm} = Hooks;
const {Image} = ImageComps;
const {
  Grid: {Row, Col},
} = Lbc;
const {withTemplate} = HOCs;
const {
  Field: {FieldItem, Input},
} = ElementsThemed;

const LocationForm = (props) => {
  const {
    diningOption,
    idAddressDetailEnable,
    isAutoFetchIPEnable,
    locatorIcon,
    onChangeStreet2,
    onGeoUpdate,
    onLocationSelect,
    recentAddresses,
    scheduledAt,
    street2,
    style,
  } = props;

  const [address, setAddress] = useState(props.address);
  const [fetching, setFetching] = useState(false);

  const {
    theme: {
      elements: {inputs},
    },
  } = useTemplateContext();

  const {values, updateField, updateError} = useForm({
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

  useDidUpdateEffect(() => {
    updateField("time", "");
  }, [values.date]);

  const searchLabel =
    diningOption === "pickup"
      ? Copy.LOCATION_FORM_STATIC.SEARCH_PICKUP_LABEL
      : Copy.LOCATION_FORM_STATIC.SEARCH_DELIVERY_LABEL;

  const getGeo = async () => {
    setFetching(true);
    try {
      const coords = await WebApis.Geo.getPosition();
      onGeoUpdate({
        lat: coords.coords.latitude,
        long: coords.coords.longitude,
      });
      setAddress("");
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const checkGeo = async () => {
      if (navigator.permissions) {
        // Permission API is implemented
        await navigator.permissions
          .query({
            name: "geolocation",
          })
          .then((permission) => {
            if (permission.state === "granted") {
              return getGeo();
            }
          });
      }
    };
    isAutoFetchIPEnable && checkGeo();
  }, []);

  const onSearchItemSelected = (props) => {
    // id & text
    setAddress(props.text);
    onLocationSelect(props);
    // onGeoUpdate(i.id);
  };

  return (
    <div>
      <Row gutter={15}>
        <Col xs={idAddressDetailEnable ? "2-3" : "1-1"}>
          <FieldItem
            className={css.locationInput}
            type={inputs[style.inputs.standard].title}
            label={searchLabel}
          >
            <LiveSearch
              recentAddresses={recentAddresses}
              type={style.inputs.standard}
              orderType={diningOption}
              resultType={style.buttons.searchResults}
              onSelect={onSearchItemSelected}
              inputProps={{
                icon: locatorIcon && (
                  <Image
                    className={`${css["geo-icon"]} ${
                      fetching ? css.blink : ""
                    }`}
                    src={locatorIcon}
                    onClick={getGeo}
                    alt="locator icon"
                  />
                ),
                onChange: (i) => setAddress(i),
                placeholder: Copy.LOCATION_FORM_STATIC.SEARCH_PLACEHOLDER,
                value: address,
              }}
            />
          </FieldItem>
        </Col>
        {idAddressDetailEnable && (
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
        )}
      </Row>
    </div>
  );
};

export default withTemplate(LocationForm, "address");
