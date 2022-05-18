const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const argPass = process.argv.splice(2);

const clientName = argPass[0];

function replaceSpace(name) {
  return name.replace(/\s/g, "-");
}

const colorKey = {
  "Brand/Primary": "brandPrimary",
  "Brand/Secondary": "brandSecondary",
  "Brand/Decorative 1": "brandDecorative1",
  "Brand/Decorative 2": "brandDecorative2",
  "Base/Default": "baseDefault",
  "Base/Subdued": "baseSubdued",
  "Base/Hover": "baseHover",
  "Base/Pressed": "basePressed",
  "Base/Disabled": "baseDisabled",
  "Base/On Surface/Default": "baseOnSurface",
  "Base/On Surface/Subdued": "baseOnSurfaceSubdued",
  "Text/Default": "textDefault",
  "Text/Action": "textAction",
  "Text/Subdued": "textSubdued",
  "Text/Disabled": "textDisabled",
  "Text/Success": "textSuccess",
  "Text/Warning": "textWarning",
  "Text/Critical": "textCritical",
  "Text/Highlight": "textHighlight",
  "Border/Default": "borderDefault",
  "Border/Subdued": "borderSubdued",
  "Border/Hover": "borderHover",
  "Border/Pressed": "borderPressed",
  "Border/Disabled": "borderDisabled",
  "Action Primary/Default": "actionPrimary",
  "Action Primary/Hover": "actionPrimaryHover",
  "Action Primary/Pressed": "actionPrimaryPressed",
  "Action Primary/Disabled": "actionPrimaryDisabled",
  "Action Secondary/Default": "actionSecondary",
  "Action Secondary/Hover": "actionSecondaryHover",
  "Action Secondary/Pressed": "actionSecondaryPressed",
  "Action Secondary/Disabled": "actionSecondaryDisabled",
  "Interactive/Default": "interactiveDefault",
  "Interactive/Hover": "interactiveHover",
  "Interactive/Pressed": "interactivePressed",
  "Interactive/Disabled": "interactiveDisabled",
  "Interactive Critical/Default": "interactiveCritical",
  "Interactive Critical/Hover": "interactiveCriticalHover",
  "Interactive Critical/Pressed": "interactiveCriticalPressed",
  "Interactive Critical/Disabled": "interactiveCriticalDisabled",
};

(async () => {
  if (!clientName) throw new Error(`Client: Please enter a valid client name`);

  const themeJSONPath = path.resolve(
    __dirname,
    `../clients/${clientName.toLowerCase()}/theme.json`,
  );
  const themeFiles = await fs.readFile(themeJSONPath, "utf8");
  const clientThemeFile = JSON.parse(themeFiles);

  try {
    const resp = await axios.get(
      `${process.env.DELIVERY_API}?appId=${clientName}&platform=web`,
    );
    let { fonts, colors } = resp.data.theme;

    fonts = {
      fontDisplayXL: {
        name: replaceSpace(fonts.DisplayXLarge.fontName),
        size: fonts.DisplayXLarge.fontSize,
        weight: fonts.DisplayXLarge.fontWeight,
      },
      fontDisplayLg: {
        name: replaceSpace(fonts.DisplayLarge.fontName),
        size: fonts.DisplayLarge.fontSize,
        weight: fonts.DisplayLarge.fontWeight,
      },
      fontDisplayMd: {
        name: replaceSpace(fonts.DisplayMedium.fontName),
        size: fonts.DisplayMedium.fontSize,
        weight: fonts.DisplayMedium.fontWeight,
      },
      fontDisplaySm: {
        name: replaceSpace(fonts.DisplaySmall.fontName),
        size: fonts.DisplaySmall.fontSize,
        weight: fonts.DisplaySmall.fontWeight,
      },
      fontHeadingMd: {
        name: replaceSpace(fonts.HeadingMedium.fontName),
        size: fonts.HeadingMedium.fontSize,
        weight: fonts.HeadingMedium.fontWeight,
      },
      fontHeadingSm: {
        name: replaceSpace(fonts.HeadingSmall.fontName),
        size: fonts.HeadingSmall.fontSize,
        weight: fonts.HeadingSmall.fontWeight,
      },
      fontSubHeading: {
        name: replaceSpace(fonts.Subheading.fontName),
        size: fonts.Subheading.fontSize,
        weight: fonts.Subheading.fontWeight,
      },
      fontBody: {
        name: replaceSpace(fonts.Body.fontName),
        size: fonts.Body.fontSize,
        weight: fonts.Body.fontWeight,
      },
      fontCaption: {
        name: replaceSpace(fonts.Caption.fontName),
        size: fonts.Caption.fontSize,
        weight: fonts.Caption.fontWeight,
      },
      fontButton: {
        name: replaceSpace(fonts.Button.fontName),
        size: fonts.Button.fontSize,
        weight: fonts.Button.fontWeight,
      },
      fontButtonLink: {
        name: replaceSpace(fonts["button link"].fontName),
        size: fonts["button link"].fontSize,
        weight: fonts["button link"].fontWeight,
      },
    };

    let themeColor = {};

    Object.entries(colors).forEach(([figmaColorKey, figmaColorValue]) => {
      if (!colorKey[figmaColorKey]) return;

      themeColor = {
        ...themeColor,
        [colorKey[figmaColorKey]]: figmaColorValue
          .replace("#", "")
          .toUpperCase(),
      };
    });

    fonts = {
      ...clientThemeFile.fonts,
      ...fonts,
    };

    colors = {
      ...clientThemeFile.colors,
      ...themeColor,
    };

    clientThemeFile.fonts = fonts;
    clientThemeFile.colors = colors;

    await fs.writeFile(
      themeJSONPath,
      JSON.stringify(clientThemeFile, null, 2),
      "utf8",
    );
  } catch (error) {
    console.log(error);
  }
})();
