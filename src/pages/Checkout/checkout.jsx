import React from "react";
import {
  Layouts,
  Fragments,
  ElementsThemed,
  Elements,
  Providers,
  HOCs,
} from "components";
import {usePatronContext} from "components/providers/patron";
import {useResource} from "hooks";
import {Copy, config} from "utils";
import styles from "./checkout.module.css";
import CheckoutRoutes from "./Routes";

const {
  Condition,
  Layout: {Flex},
} = Elements;
const {ThemeText, View} = ElementsThemed;
const {
  Image: {Image},
  Empty,
} = Fragments;

const {Layout1} = Layouts;

const {withTemplate} = HOCs;

const mapMods = (mods) => {
  const uniqueOptions = mods.reduce((accu, i) => {
    if (accu[i.option]) {
      accu[i.option].push({
        item: i.item,
        mods: mapMods(i.modifications),
      });
    } else {
      accu[i.option] = [
        {
          item: i.item,
          mods: mapMods(i.modifications),
        },
      ];
    }
    return accu;
  }, {});
  return Object.entries(uniqueOptions).map(([key, value]) => ({
    items: value,
    option: key,
  }));
};

const onClose = (isCatering, history, location) => {
  isCatering ? history.push(`/`) : history.push(`/location/${location.slug}`);
};

const Checkout = ({style: {labels, views}, match, history}) => {
  const {isLoggedIn} = usePatronContext();
  const {
    resource: res,
    fetching,
    error,
  } = useResource({
    path: `/cart/${match.params.id}`,
  });

  if (fetching) {
    return null;
  }

  const {
    orderType,
    deliveryInfo,
    needsEatingUtensils,
    needsServingUtensils,
    numberOfGuests,
    scheduledAt,
    notes,
    patronCompany,
    taxExemptId,
    placeId,
    address,
    discount,
  } = res;

  const items = (res && res.items ? res.items : []).map((i) => {
    const mods = mapMods(i.modifications);
    return {
      group: i.group,
      item: i.item.id,
      mods,
      name: i.name,
      price: i.price,
    };
  });

  const initOrderData = {
    address,
    discount,
    needsEatingUtensils,
    needsServingUtensils,
    notes,
    numberOfGuests,
    patronCompany,
    placeId,
    scheduledAt: +new Date(scheduledAt) / 1000,
    taxExemptId,
  };

  if (orderType === "delivery") {
    initOrderData.deliveryInfo = deliveryInfo;
  }

  return (
    <Layout1>
      <View type={views.background} Component={Flex} className={styles.content}>
        <div>
          <Image
            className={`${styles.logo}`}
            src={config?.images?.art_logo_1}
            alt="Logo"
          />
          <div className={styles.title}>
            <ThemeText type={labels.secondary}>
              {Copy.CART_STATIC.COMPLETE_ORDER_MESSAGE}
            </ThemeText>
          </div>
        </div>

        {Object.keys(error).length ? (
          <View
            type={views.background}
            Component={Flex}
            justify="center"
            className={styles.content}
          >
            <Empty img="empty">
              <ThemeText type={labels.emptyCart}>
                {Copy.CART_STATIC.CART_NOT_FOUND_MESSAGE}
              </ThemeText>
            </Empty>
          </View>
        ) : (
          <Providers.Order.OrderStore
            persist={false}
            location={res.location}
            items={items}
            orderType={orderType}
            order={initOrderData}
            isCart
          >
            {(order) => (
              <Providers.Menu.MenuStore
                persist={false}
                location={res.location}
                orderType={orderType}
              >
                {({fetching}) => (
                  <Condition is={!fetching}>
                    <CheckoutRoutes
                      order={order}
                      cart={res.id}
                      isLoggedIn={isLoggedIn}
                      close={() => onClose(true, history, res.location)}
                    />
                  </Condition>
                )}
              </Providers.Menu.MenuStore>
            )}
          </Providers.Order.OrderStore>
        )}
      </View>
    </Layout1>
  );
};

export default withTemplate(Checkout, "cart");
