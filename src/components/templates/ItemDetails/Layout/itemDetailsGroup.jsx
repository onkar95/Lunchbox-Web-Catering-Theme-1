/* eslint-disable react/destructuring-assignment */

import React, {useEffect, useState, useRef, useMemo} from "react";
import {MemoryRouter, Route, Redirect, Switch} from "react-router-dom";
import _cloneDeep from "lodash/cloneDeep";
import ClampLines from "react-clamp-lines";
import {BackButton, FooterButton, Image, Routes} from "components/fragments";
import {useMenuContext} from "components/providers/Menu/menu";
import {withTemplate, withPixelClick} from "components/hocs";
import {View, ThemeText, Cell} from "components/elementsThemed";
import {Condition} from "components/elements";
import {useSegment} from "hooks";
import {helpers, config} from "utils";
import {
  mapModifications,
  mergeModifications,
  mapItemTabs,
  onlyRequiredEntities,
  mergeUniqueItems,
  generateSource,
  recursiveErrorChecking,
} from "../utils";
import styles from "../itemDetails.module.scss";
import {ItemDetailsStore} from "../itemDetailsContext";
import TabSelector from "../Tabs";
import GroupSelector from "../Group";
import QuantitySelector from "../quantitySelector";
import useModification from "../useModification";

const {RouteWithProps} = Routes;

const AddToCart = withPixelClick(FooterButton, "AddToCart");

const {hardcodes} = config;

const ItemDetails = React.memo(
  ({id, item, mods, style, isViewOnly, showClose, ...props}) => {
    const {groupsHash, optionsHash, itemsHash} = useMenuContext();
    const [selectedItem, setSelectedItem] = useState(item);
    const [modifications, setModifications] = useState(mods);
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState([]);

    const {segmentViews, views, cells, labels} = style;

    const group = groupsHash[id];
    const {images, name, description, items} = group;

    const onSelect = (itemId) => {
      setModifications({});
      setSelectedItem(itemId);
    };

    const incQuantity = () => setQuantity(quantity + 1);
    const decQuantity = () =>
      setQuantity(quantity > 1 ? quantity - 1 : quantity);

    const validateMods = () => {
      let newErrors = [];
      if (!selectedItem) {
        newErrors.push({message: "Select 1", optionId: null, type: "item"});
      } else {
        newErrors = recursiveErrorChecking(
          itemsHash[selectedItem].options,
          modifications,
          optionsHash,
          itemsHash,
          [],
        );
      }
      // if we have errors set the errors to show to user
      setErrors(newErrors);
      return newErrors;
    };

    React.useEffect(() => {
      setErrors([]);
    }, [selectedItem, modifications]);

    const totalPrice = useMemo(() => {
      if (!selectedItem) {
        return "";
      }
      const {price = 0} = itemsHash[selectedItem];
      const total = mergeModifications(modifications).reduce((accu, x) => {
        return accu + itemsHash[x].price;
      }, price || 0);
      return total;
    }, [itemsHash, modifications, selectedItem]);

    const addToCart = () => {
      if (!Object.keys(errors).length) {
        props.onConfirm(
          {
            item: selectedItem,
            mods: mapModifications(modifications),
            name,
            price: totalPrice,
          },
          quantity,
        );
        setModifications({});
        props.close();
      }
    };

    const buttonText = () => {
      if (errors.length) {
        return "Oops! Please check your selections!";
      }
      return (
        <span>
          {totalPrice ? (
            <>
              {helpers.formatPrice(totalPrice * quantity)} <br />
              {props.buttonText}
            </>
          ) : (
            props.buttonText
          )}
        </span>
      );
    };

    const image = {
      backgroundImage: `url(${
        images[0] ?? config?.images?.art_item_placeholder
      })`,
    };
    return (
      <ItemDetailsStore>
        {() => (
          <View type={views.background} className={styles.container}>
            <Condition is={showClose}>
              <div className={styles.back}>
                <BackButton onClick={props.close} />
              </div>
            </Condition>
            <Cell
              type={cells.header}
              render={({views: cellViews, labelTextStyles}) => (
                <View type={cellViews.background} className={styles.header}>
                  <div>
                    <ThemeText type={labelTextStyles.primary}>{name}</ThemeText>
                  </div>
                  <div title={description}>
                    <ThemeText type={labelTextStyles.secondary}>
                      <ClampLines
                        id={id}
                        buttons={false}
                        text={description}
                        lines={1}
                        ellipsis="..."
                      />
                    </ThemeText>
                  </div>
                </View>
              )}
            />
            <div id="itemDetailsContainer" className={styles.content}>
              <div className={styles.img} style={image} />

              <GroupSelector
                items={items}
                types={{
                  default: cells.primary,
                  group: cells.group,
                  selected: cells.primarySelected,
                }}
                error={errors.find((i) => i.type === "item")}
                labelType={labels.warning}
                selected={selectedItem}
                onSelect={onSelect}
              />
              <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Route
                  render={() => (
                    <>
                      <Switch>
                        <RouteWithProps
                          path="/:id"
                          render={() => (
                            <Condition is={selectedItem}>
                              <Options
                                cells={cells}
                                type={segmentViews.standard}
                                item={itemsHash[selectedItem]}
                                modifications={modifications}
                                setModifications={setModifications}
                                errors={errors}
                              />
                            </Condition>
                          )}
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
            <div>
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
                      value: totalPrice * quantity,
                    });
                    props.close();
                  }
                }}
              >
                {isViewOnly ? "Viewing only" : buttonText()}
              </AddToCart>
            </div>
          </View>
        )}
      </ItemDetailsStore>
    );
  },
);

const Options = ({
  type: segmentType,
  item,
  modifications,
  setModifications,
  errors,
  cells,
}) => {
  const {optionsHash} = useMenuContext();
  const {id, options} = item;

  const mapItemTabs = () => {
    if (!hardcodes.optionsTabs.length) {
      return options.map((i) => ({
        entities: [i],
        name: i.name,
      }));
    }
    const tabs = hardcodes.optionsTabs
      .map((tab) => {
        const entities = options
          .reduce((accu, option) => {
            const formatedName = option.name.toLowerCase().trim();

            // Find all options that match the hardcodes defined by the client
            const isAnOption = tab.optionNames.filter((optionName) =>
              formatedName.includes(optionName.toLowerCase()),
            ).length;
            if (tab.type === 0) {
              !isAnOption && accu.push(option.id);
            } else {
              isAnOption && accu.push(option.id);
            }
            return accu;
          }, [])
          .reduce((accu, optionId) => {
            // Filter out all optionItems that match diet if diet is selected
            const newOptions = _cloneDeep(optionsHash[optionId]);

            return [...accu, newOptions];
          }, []);

        return {
          entities: entities.filter((i) => i.items.length),
          name: tab.tabName,
        };
      })
      .filter((i) => i.entities.length);
    return tabs;
  };

  const tabs = mapItemTabs(id);

  return (
    <div className={styles["tab-container"]}>
      <Condition is={!tabs.length}>
        <div
          style={{
            backgroundImage: `url(${config?.images?.art_misc_1})`,
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            height: "100%",
          }}
        />
      </Condition>
      <Condition is={tabs.length}>
        <TabContainer
          key={id}
          segmentType={segmentType}
          tabs={tabs}
          modifications={modifications}
          scrollToErrors
          errors={errors}
          cells={cells}
          updateMod={(nestMods) => {
            setModifications(nestMods);
          }}
        />
      </Condition>
    </div>
  );
};

const TabContainer = ({
  segmentType,
  tabs,
  prefix = "",
  modifications: initMod,
  errors,
  cells,
  updateMod,
  source = "",
  scrollToErrors,
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
          tabs={tabs}
          parent={parent}
          prefix={prefix}
          scrollToErrors={scrollToErrors}
          errors={filterErrorRefs}
          cells={cells}
          addToMods={addNestedMod}
          removeMod={removeNestedMod}
          menuOptions={optionsHash}
          modifications={modifications}
        />
      </div>
      {Object.entries(modifications).map(([key, value]) => {
        const groupUniqueItems = mergeUniqueItems(value);
        return Object.entries(groupUniqueItems).map(([key1, value1]) => {
          const {options, name} = itemsHash[key1];
          const itemTabs = mapItemTabs(options, optionsHash, hardcodes).reduce(
            onlyRequiredEntities,
            [],
          );
          return itemTabs.length
            ? value1.map((x, idx) => (
                <div key={idx} style={{marginTop: "20px", padding: "0px 20px"}}>
                  <TabContainer
                    segmentType={segmentType}
                    tabs={itemTabs}
                    prefix={`${
                      value1 === 1 ? "" : helpers.toOrdinalNumber(idx + 1)
                    } ${name}`}
                    modifications={x.mods}
                    scrollToErrors={!parentHasErrorRefs}
                    errors={errors}
                    cells={cells}
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
};

ItemDetails.defaultProps = {
  mods: {},
  showClose: false,
};

export default withTemplate(ItemDetails, "itemDetails");
