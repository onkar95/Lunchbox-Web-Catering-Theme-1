const jmespath = require("jmespath");
const _ = require("lodash");
const fs = require("fs");
const theme = require("./themeTemp.json");

const font = jmespath.search(theme, "fonts");
const colors = jmespath.search(theme, "colors");
const elements = jmespath.search(theme, "elements");
const buttons = jmespath.search(theme, "elements.buttons");
const views = jmespath.search(theme, "elements.views");
const styles = jmespath.search(theme, "styles");

const cellsArray = [
  "cardItem",
  "cartHeader",
  "cartItem",
  "dropdown",
  "footerButton",
  "form",
  "giftCardLeft",
  "giftCardRight",
  "history",
  "historyCard",
  "itemDetail",
  "location",
  "locationInfo",
  "loginHeader",
  "mapInformation",
  "menuFooter",
  "menuGroup",
  "optionHeader",
  "optionItem",
  "optionItemSelected",
  "orderHeader",
  "orderItem",
  "orderItemMobile",
  "packingGroup",
  "packingItem",
  "profileHeader",
  "quantitySelector",
  "receiptDetail",
  "searchResults",
  "tableInfo",
  "upsellItem",
  "walletCard",
];

const defaultCellLabelTextStyles = {
  primary: "body1_baseBlack",
  secondary: "body1_baseBlack",
  tertiary: "body1_baseBlack",
  quaternary: "body1_baseBlack",
  quinary: "body1_baseBlack",
};

const defaultCellButtons = {
  primary: "buttonDefault",
  secondary: "buttonDefault",
};

const defaultCellViews = {
  background: "viewDefault",
  primary: "viewDefault",
  secondary: "viewDefault",
  tertiary: "viewDefault",
};

const viewDefault = {
  cornerRadius: 0,
  border: null,
  backgroundColor: null,
};

const buttonDefault = {
  stateTextStyles: {
    unselected: "body1_baseBlack",
    selected: "body1_baseBlack",
    disabled: "body1_baseBlack",
  },
  stateBackgroundColors: {
    unselected: "baseWhite",
    selected: "baseWhite",
    disabled: "baseWhite",
  },
  view: "base",
};

const filterNull = (target) => _.omitBy(target, _.isNull);

const generateNewCellWithDefault = (cellName) => {
  const labelTextStyles = jmespath.search(
    theme,
    `elements.cells.${cellName}.labelTextStyles`,
  );
  const buttons = jmespath.search(theme, `elements.cells.${cellName}.buttons`);
  const views = jmespath.search(theme, `elements.cells.${cellName}.views`);

  const final = {
    labelTextStyles: labelTextStyles
      ? {...defaultCellLabelTextStyles, ...filterNull(labelTextStyles)}
      : defaultCellLabelTextStyles,
    buttons: buttons
      ? {...defaultCellButtons, ...filterNull(buttons)}
      : defaultCellButtons,
    views: views
      ? {...defaultCellViews, ...filterNull(views)}
      : defaultCellViews,
  };
  return final;
};

const cellOutPut = cellsArray.reduce((acc, cur) => {
  return {...acc, [cur]: generateNewCellWithDefault(cur)};
}, {});

const themeOutput = {
  fonts: {...font},
  colors: {...colors},
  elements: {
    ...elements,
    cells: cellOutPut,
    buttons: {...buttons, buttonDefault},
    views: {...views, viewDefault},
  },
  styles: {...styles},
};

const finalData = JSON.stringify(themeOutput);

fs.writeFile("theme.json", finalData, (err) => {
  if (err) throw err;
  console.log("Data written to file");
});
