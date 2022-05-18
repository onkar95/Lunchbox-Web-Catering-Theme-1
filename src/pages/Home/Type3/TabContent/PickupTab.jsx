import React from "react";
import {ThemeText} from "components/elementsThemed";
import {LocationForm, LocationCard, DatePickForm} from "components/templates";
import {config} from "utils";
import {formatPhoneNumber} from "utils/helpers";
import {Loader} from "components/fragments";
import {Condition as If} from "components/elements";
import styles from "./TabContent.module.scss";

const PickupTab = (props) => {
  const {
    activeLocation,
    address,
    diningOption,
    fetching,
    isShowAll,
    locations,
    onActiveLocationSelected,
    onChangeStreet2,
    onGeoUpdate,
    onIsShowAllUpdate,
    onLocationSelect,
    onSelectTime,
    recentAddresses,
    scheduledAt,
    style,
  } = props;
  const {labels} = style;
  const handleLocationCardSelect = (location) => {
    onActiveLocationSelected(location);
    toggleShowAll();
  };

  const toggleShowAll = () => {
    onIsShowAllUpdate(!isShowAll);
  };

  const handleLocationSelected = (location) => {
    onLocationSelect(location);
  };

  return (
    <div className={styles["tabContent-container"]}>
      <LocationForm
        address={address}
        onChangeStreet2={onChangeStreet2}
        diningOption={diningOption}
        onGeoUpdate={onGeoUpdate}
        onLocationSelect={handleLocationSelected}
        isAutoFetchIPEnable
        locatorIcon={config?.images?.icon_geo}
        recentAddresses={recentAddresses}
      />
      <div className={styles["location-container"]}>
        <div className={styles["location-title"]}>
          <ThemeText type={labels.secondary}> Your Closest Location</ThemeText>
          <ThemeText
            className={styles["show-call-button"]}
            onClick={toggleShowAll}
            type={labels.tertiary}
          >
            {" "}
            {isShowAll ? "Collapse" : " See All Locations"}
          </ThemeText>
        </div>

        {fetching && <Loader />}

        <If is={isShowAll}>
          <div>
            {locations.map((location) => (
              <LocationCard
                onSelect={() => handleLocationCardSelect(location)}
                type="locationCard"
                id={location.id}
                name={location.name}
                address={location.address}
                formattedPhone={formatPhoneNumber(location.phone.value)}
              />
            ))}
          </div>
        </If>

        {!isShowAll && activeLocation && (
          <div className={styles["tabContent-card-container"]}>
            <div className={styles["tabContent-detail-scroll"]}>
              <div className={styles["tabContent-card-content"]}>
                <LocationCard
                  style={style}
                  type="locationCard"
                  id={activeLocation.id}
                  name={activeLocation.name}
                  address={activeLocation.address}
                  formattedPhone={formatPhoneNumber(activeLocation.phone.value)}
                />
                <DatePickForm
                  locationId={activeLocation.id}
                  template="address"
                  diningOption={diningOption}
                  onSelectTime={onSelectTime}
                  scheduledAt={scheduledAt}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupTab;
