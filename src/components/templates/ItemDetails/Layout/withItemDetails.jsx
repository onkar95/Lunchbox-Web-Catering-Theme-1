/* eslint-disable react/destructuring-assignment */

import React, {useEffect, useState, useRef} from "react";
import {useMenuContext} from "components/providers/Menu/menu";
import {helpers, config, Copy} from "utils";
import {Image} from "components/fragments";
import {useScrollPosition} from "hooks";
import {
  mapModifications,
  mergeModifications,
  mapItemTabs,
  recursiveErrorChecking,
} from "../utils";

// CONSTANT
const {hardcodes} = config;

const withItemDetails = (Component) => function(props) {
  const {id, mods, isCartItem, style, isGroup} = props;
  const {segmentViews, views, cells} = style;

  const optionRefs = useRef({});
  const scrollingRef = useRef();
  const itemImageRef = useRef();

  // ITEM
  const {groupsHash, optionsHash, itemsHash} = useMenuContext();
  const itemMap = {
    group: {
      info: groupsHash[id],
      tabs: () => [],
    },
    item: {
      info: itemsHash[id],
      tabs: (options) => mapItemTabs(options, optionsHash, hardcodes),
    },
  };
  const item = isGroup ? itemMap.group : itemMap.item;
  const {images = [], name, description, price, calories, options} = item.info;
  const tabs = item.tabs(options);

  const [errors, setErrors] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // scroll handler
  const handleScroll = (optionId, scrollCallBack) => {
    const refToScrollTo = optionRefs.current[optionId];
    const prevScrollTop = refToScrollTo.scrollTop;

    if (refToScrollTo) {
      const header = document.getElementById("header");

      document.getElementById("itemDetailsContainer").scrollTo({
        behavior: "smooth",
        top:
          refToScrollTo.node.offsetTop +
          refToScrollTo.node.offsetHeight -
          window.innerHeight +
          200,
      });
    }

    const newScrollTop = refToScrollTo.scrollTop;

    if (newScrollTop === prevScrollTop) {
      const node = document.getElementById(`nav-${optionId}`);
      if (node) {
        const modifierTabs = node.parentNode.childNodes;
        modifierTabs.forEach((child) => child.setAttribute("data-active", 0));
        node.setAttribute("data-active", 1);
      }
    }
  };

  // Modifiers
  // Only execute the default set for first render
  const [modifications, setModifications] = useState(() => {
    const modifiers = mods || {};
    if (!isCartItem && options) {
      // Only add default modifiers for new items
      return options
        .filter((i) => i.defaultModifiers && i.defaultModifiers.length) // Only items with defaultModifiers
        .reduce((acc, opt) => {
          const result = opt.defaultModifiers.reduce((acc, cur) => {
            return [...acc, {item: cur, mods: mods || {}}];
          }, []);
          const res = {[opt.id]: result};
          return {...acc, ...res};
        }, modifiers);
    }
    return modifiers;
  });

  // IMAGE
  const placeholderImage = images[0] ?? config?.images?.art_item_placeholder;
  const artMiscImageUrl = config?.images?.art_misc_1;

  // QUANTITY
  const incQuantity = () => setQuantity(quantity + 1);
  const decQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : quantity);

  //
  useEffect(() => {
    setErrors([]);
  }, [modifications]);

  const validateMods = () => {
    const newErrors = recursiveErrorChecking(
      options,
      modifications,
      optionsHash,
      itemsHash,
      [],
    );
    // if we have errors set the errors to show to user
    setErrors(newErrors);
    return newErrors;
  };

  const addToCart = () => {
    if (!Object.keys(errors).length) {
      props.onConfirm(
        {
          image: placeholderImage,
          item: id,
          mods: mapModifications(modifications),
          name,
          price: totalPrice(),
        },
        quantity,
      );
      setModifications({});
      props.close();
    }
  };

  const totalPrice = () => {
    const total = mergeModifications(modifications).reduce((accu, x) => {
      return accu + itemsHash[x].price;
    }, price || 0);
    return total;
  };

  const buttonText = () => {
    if (errors.length) {
      return Copy.ITEM_DETAILS_STATIC.BACK_SELECTION_ERROR;
    }
    return (
      <span>
        {totalPrice() ? (
          <>
            {helpers.formatPrice(totalPrice() * quantity)} 
            {' '}
            <br />
            {props.buttonText}
          </>
        ) : (
          props.buttonText
        )}
      </span>
    );
  };

  // if (config.theme.item_details.fixable) {
  const handleFix = (prevPos, currPos) => {
    const el = scrollingRef.current;
    if (!el) return;
    const imageHeight = itemImageRef.current.clientHeight;
    const isFixed = el.dataset.fixed === "true" ? 1 : 0;

    if (currPos.y + imageHeight < 0 && prevPos.y > currPos.y && !isFixed) {
      el.dataset.fixed = true;
    } else if (
      currPos.y + imageHeight > 0 &&
      prevPos.y < currPos.y &&
      isFixed
    ) {
      el.dataset.fixed = false;
    }
  };

  useScrollPosition(
    ({prevPos, currPos}) => {
      handleFix(prevPos, currPos);
    },
    [],
    itemImageRef,
    false,
    "#itemDetailsContainer",
    100,
  );

  const returnProps = {
    addToCart,
    artMiscImageUrl,
    buttonText,
    calories,
    cells,
    decQuantity,
    description,
    errors,
    handleScroll,
    hardcodes,
    incQuantity,
    itemImageRef,
    modifications,
    name,
    optionRefs,
    options,
    placeholderImage,
    price,
    quantity,
    scrollingRef,
    segmentViews,
    setModifications,
    tabs,
    totalPrice,
    validateMods,
    views,
  };

  return <Component {...props} {...returnProps} />;
};

withItemDetails.defaultProps = {
  mods: {},
  showClose: false,
};

export default withItemDetails;
