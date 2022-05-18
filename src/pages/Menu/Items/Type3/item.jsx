import React from "react";
import ClampLines from "react-clamp-lines";
import LazyLoad from "react-lazy-load";
import useUserAgent from "use-user-agent";
import {Fragments, Templates, ElementsThemed, HOCs} from "components";
import {config, Copy} from "utils";
import styles from "./index.module.css";
import Diet from "../diet";

const {ThemeText, Cell, View} = ElementsThemed;

const {
  Drawer,
  Card: {CardBody},
  Errors,
} = Fragments;

const {withFacebookPixel} = HOCs;

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
  const {device} = useUserAgent();
  const imageURL = `url(${images[0] ?? config?.images?.art_item_placeholder})`;
  const Img = (viewType) => (
    <View
      type={viewType}
      className={styles["item-image"]}
      style={{backgroundImage: imageURL}}
    />
  );

  return (
    <Cell
      type={type}
      render={({labelTextStyles, views}) => (
        <View
          type={views.background}
          className={styles["item-card"]}
          onClick={onClick}
        >
          <div className={styles["item-info"]}>
            <CardBody className={styles["item-title"]}>
              <ThemeText type={labelTextStyles.primary}>
                <ClampLines
                  id={id}
                  buttons={false}
                  text={name || ""}
                  lines={2}
                  ellipsis="..."
                />
              </ThemeText>
              <span>
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
            </CardBody>

            <CardBody className={styles["item-description"]}>
              {description && (
                <ThemeText type={labelTextStyles.secondary} title={description}>
                  {["mobile"].includes(device.type) ? (
                    description
                  ) : (
                    <ClampLines
                      id={id}
                      buttons={false}
                      className={styles.description}
                      text={description}
                      lines={2}
                      ellipsis="..."
                    />
                  )}
                </ThemeText>
              )}
            </CardBody>

            <CardBody className={styles["item-description"]}>
              <div className={styles.stats}>
                <ThemeText type={labelTextStyles.tertiary}>{price}</ThemeText>
                {calories && (
                  <ThemeText
                    type={labelTextStyles.tertiary}
                  >{`${calories} cal`}</ThemeText>
                )}
              </div>
            </CardBody>
          </div>

          <div className={styles["item-image-container"]}>
            {device.type === "mobile" ? (
              <LazyLoad offset={250} height="100%" once>
                {Img(views.secondary)}
              </LazyLoad>
            ) : (
              Img(views.secondary)
            )}
          </div>
        </View>
      )}
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
