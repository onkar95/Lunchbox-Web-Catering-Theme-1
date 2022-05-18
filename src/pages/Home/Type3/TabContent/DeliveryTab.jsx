import React from "react";
import {LocationForm, DatePickForm} from "components/templates";
import {Fragments} from "components";
import {config} from "utils";
import styles from "./TabContent.module.scss";

const {
  Image: {Image},
} = Fragments;

const DeliveryTab = ({
  recentAddresses,
  diningOption,
  onLocationSelect,
  scheduledAt,
  onGeoUpDate,
  address,
  street2,
  onChangeStreet2,
  onSelectTime,
  activeLocation,
}) => {
  const handleLocationSelect = (location) => {
    onLocationSelect(location);
  };

  const deliveryImg = config?.images?.art_catering_logo_drawer;

  return (
    <div className={styles["tabContent-container"]}>
      <LocationForm
        recentAddresses={recentAddresses}
        diningOption={diningOption}
        onLocationSelect={handleLocationSelect}
        onGeoUpdate={onGeoUpDate}
        address={address}
        street2={street2}
        onChangeStreet2={onChangeStreet2}
        idAddressDetailEnable
        isAutoFetchIPEnable={false}
      />
      <DatePickForm
        locationId={activeLocation.id}
        template="address"
        diningOption={diningOption}
        onSelectTime={onSelectTime}
        scheduledAt={scheduledAt}
      />
      {diningOption === "delivery" && (
        <div className={styles["image-container"]}>
          <Image className={styles["nothing-image"]} src={deliveryImg} />
        </div>
      )}
    </div>
  );
};

export default DeliveryTab;
