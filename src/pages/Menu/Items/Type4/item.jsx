/* eslint-disable react/no-multi-comp */
import React from "react";
import ClampLines from "react-clamp-lines";
import {Elements, Fragments, Templates, ElementsThemed, HOCs} from "components";
import {useCell} from "hooks";
import {config, Copy} from "utils";
import css from "./index.module.css";
import Diet from "../diet";

const {
  Layout: {Flex},
} = Elements;

const {ThemeText, View, ThemeButton} = ElementsThemed;

const {
  Drawer,
  Card: {Card},
  Empty,
  Errors,
} = Fragments;

const {withFacebookPixel, withErrorBoundary} = HOCs;

const {ItemDetails} = Templates;

const FallBack = () => (
  <Card className={css["item-card"]} hover>
    <div>
      <Empty img="error">{Copy.MENU_STATIC.ITEM_UNAVAILABLE}</Empty>
    </div>
  </Card>
);

const ItemCard = withErrorBoundary(
  ({
    id,
    images,
    name,
    description,
    price,
    calories,
    onClick,
    type,
    dietaryRestrictions,
  }) => {
    const {labelTextStyles, views, button} = useCell(type);
    const imageURL = `url(${
      images[0] ?? config?.images?.art_item_placeholder
    })`;
    const img = (
      <div className={css["item-image"]} style={{backgroundImage: imageURL}} />
    );

    return (
      <View
        type={views.background}
        className={css["item-card"]}
        onClick={onClick}
      >
        <Flex className={css["item-title"]}>
          <ThemeText type={labelTextStyles.primary}>
            <ClampLines
              id={id}
              buttons={false}
              text={name || ""}
              lines={2}
              ellipsis="..."
            />
          </ThemeText>
          <ThemeText type={labelTextStyles.tertiary} className={css.price}>
            {price}
          </ThemeText>
        </Flex>

        <Flex grow={1} justify="center" className={css["item-info"]}>
          <View type={views.secondary} className={css["item-description"]}>
            <ThemeText type={labelTextStyles.secondary} title={description}>
              {description} {calories || ""}
            </ThemeText>
          </View>
          <div className={css["item-image-container"]}>
            <span className={css.diet}>
              {config.diet_order.reduce((accu, x) => {
                if (
                  dietaryRestrictions &&
                  dietaryRestrictions.indexOf(x) !== -1
                ) {
                  accu.push(<Diet key={x} diet={x} />);
                }
                return accu;
              }, [])}
            </span>
            {img}
          </div>
          <ThemeButton type={button} className={css["item-add-to-cart"]}>
            Add To Cart
          </ThemeButton>
        </Flex>
      </View>
    );
  },
  FallBack,
);

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
    ...props
  }) => (
    <Drawer.ResponsiveDrawer
      trigger={({breakPoint}) => (
        <ItemCard
          id={id}
          type={breakPoint === "xs" ? type.mobile : type.desktop}
          images={images}
          name={name}
          dietaryRestrictions={dietaryRestrictions}
          description={description}
          price={price}
          calories={calories}
        />
      )}
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
      }}
    >
      {(drawerProps) => (
        <Errors message="An error occured">
          <ItemDetails
            isGroup={isGroup}
            id={id}
            showClose
            onConfirm={props.onAdd}
            close={() => drawerProps.close()}
            buttonText={Copy.MENU_STATIC.ADD_TO_CART_BUTTON_TEXT}
          />
        </Errors>
      )}
    </Drawer.ResponsiveDrawer>
  ),
);

export default withFacebookPixel(Item, "ViewContent");
