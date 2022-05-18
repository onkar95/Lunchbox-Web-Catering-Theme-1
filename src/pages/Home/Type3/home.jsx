import React, {useReducer, useEffect} from "react";
import {Lbc} from "@lunchboxinc/lunchbox-components";
import {Fragments, ElementsThemed, HOCs} from "components";
import {useOrderContext} from "components/providers/Order/order";
import {mapGoogleAddressComponents, formatAddress} from "utils/helpers";
import utils, {config, Copy} from "utils";
import {Condition as If} from "components/elements";
import {PickupTab, DeliveryTab} from "./TabContent";
import reducer from "../reducers";
import homeActions from "../actions";
import css from "./home.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;
const {ThemeText, Segment, View} = ElementsThemed;

const {withTemplate} = HOCs;
const {
  Tabs: Tabs1,
  Card: {Card, CardBody},
  Image: {Image},
  FooterButton,
  Footer,
} = Fragments;

const {
  axios: {
    methods: {get, post},
  },
  Schemas: {CateringSchema},
  constants: {ERRORS},
} = utils;

const bkgImg = {
  backgroundImage: `url(${config?.images?.art_catering_background})`,
};
const miscIcon = config?.images?.art_home_misc;

const contentProps = {
  lg: {span: "1-3"},
  sm: {span: "1-2"},
  xs: {span: "24-24"},
};
const pickupTabOptions = {
  diningOption: "pickup",
  form: (props) => <PickupTab {...props} />,
  name: "Pickup",
};
const deliveryTabOptions = {
  diningOption: "delivery",
  form: (props) => <DeliveryTab {...props} />,
  name: "Delivery",
};
const phrase = config.lang.home_title;
const {default_tab} = config;

const tabOrder =
  default_tab === "pickup"
    ? [pickupTabOptions, deliveryTabOptions]
    : [deliveryTabOptions, pickupTabOptions];

const sortLocationByDistance = (data) =>
  data.sort((a, b) => a.distanceInMiles - b.distanceInMiles);

const Home = ({style, history}) => {
  const {order, setOrderDetails, changeLocation} = useOrderContext();
  const [state, dispatch] = useReducer(reducer, {
    activeLocation: "",
    address: "",
    addressComps: "",
    diningOption: default_tab,
    error: "",
    fetching: true,
    isShowAll: true,
    lat: "",
    locations: [],
    long: "",
    placeId: "",
    recentAddresses: order?.recentAddresses || [],
    scheduledAt: "",
    street2: "",
  });

  const {
    fetching,
    diningOption,
    scheduledAt,
    placeId,
    address,
    street2,
    error,
    lat,
    long,
    addressComps,
    locations,
    activeLocation,
    isShowAll,
    recentAddresses,
  } = state;

  const {
    onTabChange,
    onLocationSelect,
    onChangeStreet2,
    onSelectTime,
    onFetchChange,
    onError,
    onGeoUpdate,
    onLocationsLoaded,
    onActiveLocationSelected,
    onIsShowAllUpdate,
  } = homeActions(dispatch);

  const viewMenu = () => {
    changeLocation(activeLocation);
    history.push("/menu");
  };

  useEffect(() => {
    // fetch user input Geo location info when liveSearch placeID change and update
    onFetchChange(true);
    const getPlace = async () => {
      try {
        const res = await get(`/places/${placeId}`);
        onGeoUpdate({
          addressComps: mapGoogleAddressComponents(res.data.addressComponents),
          lat: res.data.lat,
          long: res.data.long,
        });
      } catch (err) {
        throw err;
      } finally {
        onFetchChange(false);
      }
    };
    getPlace();
  }, [placeId]);

  useEffect(() => {
    const getSortedLocations = async () => {
      onFetchChange(true);
      try {
        const reqBodyMap = {
          delivery: {address: {lat, long, ...addressComps}, diningOption},
          pickup: {
            diningOption,
            lat: lat || undefined,
            long: long || undefined,
          },
        };

        const {data} = await post("/locations", reqBodyMap[diningOption]);

        if (data.length === 0) {
          onError(
            "We don't have catering at any locations around your address.",
          );
          return;
        }
        const sortedLocations = sortLocationByDistance(data);
        onLocationsLoaded(sortedLocations);
        // pickup: set the closest location as the activated location
        // deliver: set the closest cateringGroup as the activated location
        onIsShowAllUpdate(!lat);
        onActiveLocationSelected(sortedLocations[0]);
      } catch (error) {
        console.error(error);
        onError("Please provide detailed address");
      } finally {
        onFetchChange(false);
      }
    };

    getSortedLocations();
  }, [lat, long, diningOption]);

  // TODO: locations should have returned the validated version; considering skip this step
  const onSubmit = async () => {
    onFetchChange(true);
    onError("");
    try {
      await CateringSchema.validate(
        {orderType: diningOption, placeId, scheduledAt},
        {abortEarly: true},
      );

      let deliveryAddress;
      if (diningOption === "delivery") {
        const {
          data: {address},
        } = await post("/catering/validate", {
          orderType: diningOption,
          placeId,
          scheduledAt,
        });
        deliveryAddress = address;
      }

      if (diningOption === "pickup") {
        await post("/catering/validate", {
          designatedLocationId: activeLocation.designatedLocationId,
          orderType: diningOption,
          scheduledAt,
        });
      }

      const deliverInfoMap = {
        // pass user input as delivery address
        delivery: {lat, long, placeId, ...deliveryAddress, street2},
        // pass selected res address as delivery address
        pickup: {...activeLocation.address},
      };

      changeLocation(activeLocation);
      setOrderDetails({
        address: formatAddress(activeLocation.address),
        cateringGroupId: activeLocation.id,
        deliveryInfo: deliverInfoMap[diningOption],
        designatedLocationId: activeLocation.designatedLocationId,
        location: {...activeLocation},
        orderType: diningOption,
        placeId,
        recentAddress: {
          id: placeId,
          text: address,
        },
        scheduledAt,
      });
      history.push("/menu/");
    } catch (err) {
      let msg = ERRORS.general;
      if (err.response) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      onError(msg);
    } finally {
      onFetchChange(false);
    }
  };

  const {labels, cells, segmentViews, views} = style;
  return (
    <div className={css.cateringHome} style={bkgImg}>
      <Col xs="1" flex style={{height: "100%"}}>
        <Row style={{height: "100%"}}>
          <Col {...contentProps} style={{height: "100%"}}>
            <Card className={css["cateringHome-content"]} shadow={false}>
              <div className={css["cateringHome-content-body"]}>
                <div className={css["cateringHome-content-title"]}>
                  <ThemeText type={labels.primary}>{phrase}</ThemeText>
                  <Image
                    className={css["cateringHome-misc-image"]}
                    src={miscIcon}
                    alt="alternate brand art"
                  />
                </div>
                <CardBody className={css["cateringHome-tab-container"]}>
                  <Segment
                    type={segmentViews.standard}
                    render={() => (
                      <Tabs1
                        destroyInactiveTabPane
                        type={segmentViews.standard}
                        activeKey={diningOption}
                        onTabChange={onTabChange}
                      >
                        {tabOrder.map((option) => (
                          <div key={option.diningOption} title={option.name}>
                            <Col xs="1">
                              {option.form({
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
                                street2,
                                style,
                              })}
                            </Col>
                          </div>
                        ))}
                      </Tabs1>
                    )}
                  />
                </CardBody>
              </div>
              <View
                type={views.background}
                className={css["cateringHome-footer"]}
              >
                <div className={css["cateringHome-footer-container"]}>
                  <If is={error}>
                    <div>
                      <ThemeText type={labels.error}>{error}</ThemeText>
                    </div>
                  </If>
                  <ThemeText
                    className={css["cateringHome-footer-cta"]}
                    type={labels.secondary}
                    style={{cursor: "pointer", margin: "10px"}}
                    onClick={viewMenu}
                  >
                    {Copy.LOCATIONS_STATIC.HOME_FOOTER_VIEW_MENU}
                  </ThemeText>
                </div>
                <If is={!isShowAll}>
                  <FooterButton
                    className={css["cateringHome-footer-button"]}
                    type={cells.bottom}
                    htmlType="button"
                    onClick={onSubmit}
                  >
                    {Copy.LOCATIONS_STATIC.HOME_FOOTER_BUTTON}
                  </FooterButton>
                </If>
              </View>
            </Card>
          </Col>
        </Row>
        <Footer
          className={css["cateringHome-footer-logo"]}
          type={cells.footer}
          version="Sticky"
          style={{width: "100%"}}
        />
      </Col>
    </div>
  );
};

export default withTemplate(Home, "catering");
