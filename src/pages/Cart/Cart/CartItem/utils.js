import {helpers} from "utils";

export const populateMods = (mods, itemsHash) => {
  return mods
    .map((i) => ({
      ...i,
      items: i.items.reduce((accu, item) => {
        const itemId = item.item;
        if (itemsHash[itemId]) {
          const hasItemIndex = accu.findIndex((x) => x.id === itemId);
          if (hasItemIndex !== -1) {
            accu[hasItemIndex].quantity += 1;
          } else {
            accu.push({...itemsHash[itemId], quantity: 1});
          }
          return accu;
        }
        return accu;
      }, []),
    }))
    .filter((i) => i);
};

export const formatModifierPrice = (price, quantity = 1) => {
  let priceString = price ? `${helpers.formatPrice(price)}` : "";
  const sign = price && price < 0 ? "-" : "+";
  const quantityString = quantity > 1 ? ` x ${quantity}` : "";
  priceString = `${sign}${priceString}`;
  if (price) {
    return `(${priceString}${quantityString})`;
  }
  return quantityString;
};
