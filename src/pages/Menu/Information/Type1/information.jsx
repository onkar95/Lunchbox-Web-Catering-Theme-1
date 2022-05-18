import React from "react";
import {ElementsThemed} from "components";
import {helpers, Copy} from "utils";
// import { useResource } from '../../hooks';
import styles from "./index.module.scss";

const {Cell, View, ThemeText} = ElementsThemed;

const LocationInfo = React.memo(({type, location}) => {
  const {address = {}, name, phone, hours = []} = location;
  const day = new Date().getDay();
  const hour = hours.find((i) => i.day === day) || {};
  const onlineOpen = hour.deliveryOpen;
  const onlineClose = hour.deliveryClose;
  const storeOpen = hour.pickupOpen;
  const storeClose = hour.pickupClose;

  return (
    <Cell
      type={type}
      render={({labelTextStyles, views}) => (
        <View type={views.secondary} className={styles["location-info-card"]}>
          <View>
            <ThemeText type={labelTextStyles.primary}>{name}</ThemeText>
          </View>
          <div className={styles["location-info"]}>
            <div>
              <ThemeText type={labelTextStyles.secondary}>
                {helpers.formatPhoneNumber(phone.value)}
              </ThemeText>
            </div>
            <div>
              <ThemeText type={labelTextStyles.secondary}>
                {helpers.formatAddress(address)}
              </ThemeText>
            </div>
            <div className={styles.hours}>
              <span>
                <ThemeText type={labelTextStyles.secondary}>
                  {Copy.LOCATION_LIST_STATIC.DINING_OPTION_DELIVERY_LABEL}
                </ThemeText>
              </span>
              &nbsp;
              <span>
                {onlineOpen && onlineClose && (
                  <ThemeText
                    type={labelTextStyles.secondary}
                  >{`${helpers.toCivilianTime(
                    onlineOpen,
                  )}-${helpers.toCivilianTime(onlineClose)}`}</ThemeText>
                )}
              </span>
            </div>
            <div className={styles.hours}>
              <span>
                <ThemeText type={labelTextStyles.secondary}>
                  {Copy.LOCATION_LIST_STATIC.DINING_OPTION_PICKUP_LABEL}
                </ThemeText>
              </span>
              &nbsp;
              <span>
                {storeOpen && storeClose && (
                  <ThemeText
                    type={labelTextStyles.secondary}
                  >{`${helpers.toCivilianTime(
                    storeOpen,
                  )}-${helpers.toCivilianTime(storeClose)}`}</ThemeText>
                )}
              </span>
            </div>
          </div>
        </View>
      )}
    />
  );
});

export default LocationInfo;
