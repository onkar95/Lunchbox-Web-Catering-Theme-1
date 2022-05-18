import {constants, config, helpers} from "utils";

const {
  ORDER_TYPES: {PICKUP, DELIVERY},
} = constants;

const {formatAddress, roundFloat} = helpers;

const getFinalAmount = ({ tipAmount = 0, totalAmount = 0, delivery = 0 }) => {
  let finalTip = parseFloat(tipAmount);
  finalTip = Number.isNaN(finalTip) ? 0 : finalTip;

  return roundFloat(totalAmount + finalTip + delivery);
}


const flattenItems = (mods) => {
  return mods.reduce((accu, {items, option}) => {
    return [
      ...accu,
      ...items.map(({item, mods: nestedMods}) => ({
        item,
        modifiers: flattenItems(nestedMods),
        option,
      })),
    ];
  }, []);
};
const mapItems = (items) =>
  items.map((i) => ({
    group: i.group,
    item: i.item,
    modifiers: flattenItems(i.mods),
    notes: i.notes || "",
  }));
const mapOrder = (orderContext) => {
  const toReturn = {
    code: orderContext.order.code || undefined,
    deliveryInfo:
      orderContext.order.orderType === "delivery"
        ? {
            city: orderContext.order.deliveryInfo.city,
            lat: orderContext.order.deliveryInfo.lat,
            long: orderContext.order.deliveryInfo.long,
            state: orderContext.order.deliveryInfo.state,
            street1: orderContext.order.deliveryInfo.street1,
            street2: orderContext.order.deliveryInfo.street2,
            zip: orderContext.order.deliveryInfo.zip,
          }
        : undefined,
    designatedLocationId: orderContext.order.designatedLocationId,
    discount: orderContext.order.discount || undefined,
    items: mapItems(orderContext.items),
    orderType: orderContext.order.orderType,
    placeId: orderContext.order.placeId,
    promotionCodeId: orderContext.order.promotionCodeId || undefined,
    promotionId: orderContext.order.promotionId || undefined,
    scheduledAt: orderContext.order.scheduledAt,
    subtotal: orderContext.order.subtotal,
  };

  return toReturn;
};

const mapCateringDetails = ({order}) => {
  return {
    address: order.address,
    deliveryContactName: order.contactName,
    deliveryContactPhone: order.contactPhone,
    needsEatingUtensils: order.needsEatingUtensils,
    needsServingUtensils: order.needsServingUtensils,
    notes: order.notes,
    numberOfGuests: order.numberOfGuests,
    patronCompany: order.patronCompany || "N/A",
    placeId: order.placeId,
    taxExemptId: order.taxExemptId,
  };
};

const mapOrderValidation = (orderContext) => {
  const {subtotal, ...rest} = mapOrder(orderContext);
  const toReturn = {
    ...rest,
    discount: orderContext.order.discount || undefined,
  };

  return toReturn;
};

const mapPixelItems = (items) =>
  items.map((i) => ({
    id: i.item,
    item_price: i.price,
    name: i.name,
    quantity: 1,
  }));
const mapPixelContentIds = (items) => items.map((i) => i.item);

const headerText = (isDelivery, isCatering, address, name) => {
  let labelText;
  let labelValue;
  if (isDelivery) {
    if (isCatering) {
      labelText = "Catering Delivery";
      labelValue = `to ${formatAddress(address)}`;
    } else {
      labelText = `Delivery From ${name}`;
      labelValue = `to ${formatAddress(address)}`;
    }
  } else {
    labelText = isCatering
      ? `Catering Pickup from ${name}`
      : `Pickup from ${name}`;
  }
  return [labelText, labelValue];
};

const orderModsAsObject = (mods) => {
  return mods.reduce(
    (accu, i) => ({
      ...accu,
      [i.option]: i.items.map((i) => ({
        item: i.item,
        mods: orderModsAsObject(i.mods),
      })),
    }),
    {},
  );
};

const getAvailableTipByOrderType = (orderType) => {
  const orderTypeToTipAvailableOptions = {
    [DELIVERY]: config?.delivery?.tip_available_options,
    [PICKUP]: config?.pickup?.tip_available_options,
  };
  return (
    orderTypeToTipAvailableOptions[orderType] ??
    config?.pickup?.tip_available_options ??
    []
  );
};

export {
  mapItems,
  mapOrder,
  mapCateringDetails,
  mapPixelItems,
  mapPixelContentIds,
  mapOrderValidation,
  headerText,
  orderModsAsObject,
  getAvailableTipByOrderType,
  getFinalAmount
};
export default {
  headerText,
  mapCateringDetails,
  mapItems,
  mapOrder,
  mapOrderValidation,
  mapPixelContentIds,
  mapPixelItems,
  orderModsAsObject,
  getAvailableTipByOrderType,
  getFinalAmount
};
