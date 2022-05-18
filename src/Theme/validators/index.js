import {flatten} from "lodash";
import font from "./font";
import color from "./color";
import button from "./button";
import view from "./view";
import cell from "./cell";
import dialogue from "./dialogue";
import input from "./input";
import label from "./label";
import segmentView from "./segmentView";
import style from "./style";

import {loadValidationHelpers} from "./helpers";

const validateThemeFile = async (theme) => {
  const helpers = loadValidationHelpers(theme);
  try {
    const finalParsingResults = await Promise.all([
      color(theme.colors),
      font(theme.fonts),
      button(helpers)(theme.elements.buttons),
      view(helpers)(theme.elements.views),
      cell(helpers)(theme.elements.cells),
      dialogue(helpers)(theme.elements.dialogues),
      input(helpers)(theme.elements.inputs),
      label(helpers)(theme.elements.labels),
      segmentView(helpers)(theme.elements.segmentViews),
      style(helpers)(theme.styles),
    ]);
    const themeFileProblems = flatten(finalParsingResults);
    if (themeFileProblems.length) {
      throw JSON.stringify(themeFileProblems, null, 4);
    }
  } catch (err) {
    return err;
  }
};

export {validateThemeFile};

export default validateThemeFile;
