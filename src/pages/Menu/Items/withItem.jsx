import React from "react";
import {Fragments, Templates} from "components";
import {usePixelTracker} from "hooks";

const {Drawer, Errors} = Fragments;

const {ItemDetails} = Templates;

const withItem = (Component) => ({
  id,
  images,
  name,
  dietaryRestrictions,
  description,
  price,
  calories,
  type,
  isGroup = false,
  onAdd,
}) => {
  const {tracker} = usePixelTracker("ViewContent");
  return (
    <Drawer.ResponsiveDrawer
      trigger={({breakPoint}) => (
        <Component
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
            id={id}
            onConfirm={onAdd}
            showClose
            showQuantity
            close={() => drawerProps.close()}
            buttonText="Add To Cart"
          />
        </Errors>
      )}
    </Drawer.ResponsiveDrawer>
  );
};

export default withItem;
