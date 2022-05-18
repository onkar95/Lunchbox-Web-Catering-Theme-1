import { withTypeSelector } from "components/hocs";
import { config } from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";

const COMPONENTS_TAB = config.components.tab;

export default withTypeSelector(
  {
    Type1,
    Type2,
  },
  COMPONENTS_TAB,
  Type1
);
