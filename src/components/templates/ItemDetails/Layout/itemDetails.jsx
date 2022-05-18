/* eslint-disable react/destructuring-assignment */

import React, {useEffect, useRef} from "react";
import {
  MemoryRouter,
  Route,
  Redirect,
  Switch,
  withRouter,
} from "react-router-dom";
import {BackButton, FooterButton, Routes} from "components/fragments";
import {useMenuContext} from "components/providers/Menu/menu";
import {withTemplate, withPixelClick} from "components/hocs";
import {View} from "components/elementsThemed";
import {Condition} from "components/elements";
import {useSegment} from "hooks";
import {helpers, config} from "utils";
import BackButton2 from "../../../fragments/BackButton/backButton2";
import {
  mapItemTabs,
  onlyRequiredEntities,
  mergeUniqueItems,
  generateSource,
} from "../utils";
import styles from "../itemDetails.module.scss";
import TabSelector from "../Tabs";
import HeaderSelector from "../Header";
import QuantitySelector from "../quantitySelector";
import useModification from "../useModification";
import withItemDetails from "./withItemDetails";

const {RouteWithProps} = Routes;

const AddToCart = withPixelClick(FooterButton, "AddToCart");

const ItemDetails = React.memo(
  ({
    addToCart,
    artMiscImageUrl,
    buttonText,
    calories,
    cells,
    close,
    decQuantity,
    description,
    errors,
    hardcodes,
    id,
    incQuantity,
    isViewOnly,
    modifications,
    name,
    placeholderImage,
    price,
    quantity,
    segmentViews,
    setModifications,
    showClose,
    tabs,
    totalPrice,
    validateMods,
    views,
    optionRefs,
    handleScroll,
    scrollingRef,
    itemImageRef,
  }) => {
    return (
      <View
        id="itemDetails"
        type={views.background}
        className={styles.container}
        innerRef={scrollingRef}
      >
        <Condition is={showClose}>
          <div className={styles.back}>
            <BackButton2
              imgSrc={config?.images?.button_back_item_details}
              onClick={close}
            />
          </div>
        </Condition>
        <div id="itemDetailsContainer" className={styles.content}>
          <div
            ref={itemImageRef}
            className={styles.img}
            style={{
              backgroundImage: `url(${placeholderImage})`,
            }}
          />
          <div id="header" className={styles["itemDetails-header"]}>
            <div className={styles["itemDetails-header--container"]}>
              <HeaderSelector
                description={description}
                price={price}
                name={name}
                calories={calories}
                cells={cells}
              />
            </div>
          </div>

          <MemoryRouter initialEntries={["/"]} initialIndex={0}>
            <Route
              render={() => (
                <>
                  <Switch>
                    <RouteWithProps
                      path="/:id"
                      render={() =>
                        !tabs.length ? (
                          <div
                            style={{
                              backgroundImage: `url(${artMiscImageUrl})`,
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              height: "100%",
                            }}
                          />
                        ) : (
                          <TabContainer
                            segmentType={segmentViews.standard}
                            tabs={tabs}
                            optionRefs={optionRefs}
                            modifications={modifications}
                            scrollToErrors
                            errors={errors}
                            cells={cells}
                            hardcodes={hardcodes}
                            handleScroll={handleScroll}
                            updateMod={(nestedMods) => {
                              setModifications(nestedMods);
                            }}
                          />
                        )
                      }
                    />
                    <Route path="/">
                      <Redirect to={`/${id}`} />
                    </Route>
                  </Switch>
                </>
              )}
            />
          </MemoryRouter>
        </div>
        <div className={styles.footerContainer}>
          <Condition is={showClose && !isViewOnly}>
            <QuantitySelector
              type={cells.quantity}
              quantity={quantity}
              inc={incQuantity}
              dec={decQuantity}
            />
          </Condition>
          <AddToCart
            className="added-confirmation"
            type={cells.bottom}
            disabled={isViewOnly}
            onClick={(e, callback) => {
              const errorList = validateMods();
              if (!errorList.length) {
                addToCart();
                callback({
                  content_category: id,
                  content_name: name,
                  currency: "USD",
                  value: totalPrice() * quantity,
                });
                close();
              }
            }}
          >
            {isViewOnly ? "Viewing only" : buttonText()}
          </AddToCart>
        </div>
      </View>
    );
  },
);

const TabContainer = withRouter(
  ({
    segmentType,
    tabs,
    prefix = "",
    modifications: initMod,
    errors,
    cells,
    updateMod,
    source = "",
    scrollToErrors,
    hardcodes,
    optionRefs,
    handleScroll,
  }) => {
    const parent = useRef();
    const {optionsHash, itemsHash} = useMenuContext();
    const segment = useSegment(segmentType);
    const {
      modifications,
      addToMods: addNestedMod,
      removeMod: removeNestedMod,
      updateMod: updateNestedMod,
    } = useModification(initMod || {});

    useEffect(() => {
      updateMod && updateMod(modifications);
    }, [modifications]);

    const filterErrorRefs = errors.filter((i) => i.source === source);
    // Will only scroll to the closest error
    const parentHasErrorRefs = filterErrorRefs.length;

    return (
      <>
        <div className={styles["tab-container"]} ref={parent}>
          <TabSelector
            {...segment}
            optionRefs={optionRefs}
            tabs={tabs}
            parent={parent}
            prefix={prefix}
            scrollToErrors={scrollToErrors}
            errors={filterErrorRefs}
            cells={cells}
            addToMods={addNestedMod}
            removeMod={removeNestedMod}
            menuOptions={optionsHash}
            handleScroll={handleScroll}
            modifications={modifications}
          />
        </div>
        {Object.entries(modifications).map(([key, value]) => {
          const groupUniqueItems = mergeUniqueItems(value);
          return Object.entries(groupUniqueItems).map(([key1, value1]) => {
            const {options, name} = itemsHash[key1];
            const t = mapItemTabs(options, optionsHash, hardcodes).reduce(
              onlyRequiredEntities,
              [],
            );
            return t.length
              ? value1.map((x, idx) => (
                  <div
                    key={idx}
                    style={{marginTop: "20px", padding: "0px 20px"}}
                  >
                    <TabContainer
                      segmentType={segmentType}
                      tabs={t}
                      optionRefs={optionRefs}
                      prefix={`${
                        value1 === 1 ? "" : helpers.toOrdinalNumber(idx + 1)
                      } ${name}`}
                      modifications={x.mods}
                      scrollToErrors={!parentHasErrorRefs}
                      errors={errors}
                      cells={cells}
                      handleScroll={handleScroll}
                      updateMod={(nestedMods) => {
                        updateNestedMod({
                          itemIndex: x.originalIndex,
                          mods: nestedMods,
                          optionId: key,
                        });
                      }}
                      source={generateSource(source, key, x.originalIndex)}
                    />
                  </div>
                ))
              : null;
          });
        })}
      </>
    );
  },
);

export default withTemplate(withItemDetails(ItemDetails), "itemDetails");
