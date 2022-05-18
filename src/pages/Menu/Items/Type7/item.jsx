/* eslint-disable react/no-multi-comp */
import React, {useEffect, useState} from "react";
import {Lbc, Hooks} from "@lunchboxinc/lunchbox-components";
import ClampLines from "react-clamp-lines";
import LazyLoad from "react-lazy-load";
import useUserAgent from "use-user-agent";
import {Fragments, Templates, ElementsThemed, HOCs} from "components";
import {MenuCard as MenuCardComponent} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import {helpers, config, Copy} from "utils";
import Diet from "../diet";

const withMenuItem = (Component) => (props) => {
  const {
    calories,
    cellType,
    datatest,
    description,
    dietaryRestrictions,
    id,
    images,
    name,
    onClick,
    price,
  } = props;

  const {width} = useWindowSize({debounce: 200});
  const {name: breakPoint} = helpers.determineBreakPoint(width);
  const enableImageOptimization =
    process.env.BUILD_ENV === "stage" && config.enableImageOptimization;
  const originalImageSrc = images?.[0] ?? config.images?.art_item_placeholder;
  // if image optimization is enabled, prepend the URL
  const imageSrc = enableImageOptimization
    ? `https://res.cloudinary.com/lunchbox/image/fetch/f_auto/${originalImageSrc}`
    : originalImageSrc;
  const clamped = config.theme.menu.item_card_clamped || true;
  const themeType = config.theme.menu.item_card || "Type1";

  const dietOrder = config.diet_order;
  const dietIcons = dietOrder.reduce((accu, x) => {
    if (dietaryRestrictions && dietaryRestrictions?.indexOf(x) !== -1) {
      accu.push(<Diet key={x} diet={x} />);
    }
    return accu;
  }, []);

  return (
    <div style={{height: "100%"}} datatest={datatest}>
      <Component
        calories={calories}
        cellType={breakPoint === "xs" ? cellType.mobile : cellType.desktop}
        description={description}
        dietIcons={dietIcons}
        fallbackSrc={originalImageSrc}
        id={id}
        imageSrc={imageSrc}
        name={name}
        onClick={onClick}
        placeholderSrc={config.images?.art_item_placeholder}
        price={price}
        themeType={themeType}
        clamped={clamped}
      />
    </div>
  );
};

const MenuCard = withMenuItem(MenuCardComponent);

const {useWindowSize} = Hooks;

const {ThemeText, Cell, View} = ElementsThemed;

const {
  Drawer,
  Card: {Card, CardBody},
} = Fragments;

const {withFacebookPixel} = HOCs;

const {
  Grid: {Row, Col},
} = Lbc;

const {ItemDetails} = Templates;

const ItemCard = ({
  id,
  images,
  name,
  dietaryRestrictions,
  description,
  price,
  calories,
  onClick,
  type,
}) => {
  return (
    <MenuCard
      calories={calories}
      description={description}
      dietaryRestrictions={dietaryRestrictions}
      id={id}
      images={images}
      name={name}
      price={price}
      key={id}
      cellType={type}
      onClick={onClick}
    />
  );
};

const Item = React.memo(
  ({
    id,
    images,
    name,
    dietaryRestrictions,
    description,
    price,
    calories,
    type,
    isGroup = false,
    tracker,
    isViewOnly,
    ...props
  }) => {
    const {width} = useWindowSize({debounce: 300});
    const [drawerWidth, setWidth] = useState();

    const newWidth = (breakPoint) => {
      switch (breakPoint) {
        case "sm":
          setWidth("80vw");
          break;
        case "md":
          setWidth("50vw");
          break;
        case "lg":
        case "xl":
        case "xxl":
          setWidth("40vw");
          break;
        default:
          setWidth("100vw");
      }
    };

    const {name: breakPoint} = helpers.determineBreakPoint(width);

    useEffect(() => {
      newWidth(breakPoint);
    }, [breakPoint]);

    return (
      <Drawer.ResponsiveDrawer
        trigger={
          <ItemCard
            id={id}
            type={type}
            images={images}
            name={name}
            dietaryRestrictions={dietaryRestrictions}
            description={description}
            price={price}
            calories={calories}
          />
        }
        drawerProps={{
          destroyOnClose: true,
          onChange: (isOpen) => {
            if (isOpen) {
              tracker({
                content_category: id,
                content_name: name,
                content_type: isGroup ? "Subgroup" : "Item",
              });
            }
          },
          width: drawerWidth,
        }}
      >
        {(drawerProps) => (
          <ItemDetails
            isGroup={isGroup}
            id={id}
            isViewOnly={isViewOnly}
            showClose
            onConfirm={props.onAdd}
            close={() => drawerProps.close()}
            buttonText={Copy.MENU_STATIC.ADD_TO_CART_BUTTON_TEXT}
          />
        )}
      </Drawer.ResponsiveDrawer>
    );
  },
);

export default withFacebookPixel(Item, "ViewContent");
