import {object, string} from "yup";

const base = object().nullable();
const nullableObject = (keys = {}) => {
  return Object.keys(keys).length ? base.shape(keys) : base;
};
const requiredStyle = (keys) => {
  return object().shape(keys).required();
};

const styleSchema = (types) => {
  const labelTypes = string().matches(types.labelTypes);
  const viewTypes = string().matches(types.viewTypes);
  const buttonTypes = string().matches(types.buttonTypes);
  const cellTypes = string().matches(types.cellTypes);
  const dialogueTypes = string().matches(types.dialogueTypes);
  const inputTypes = string().matches(types.inputTypes);
  const segmentViewTypes = string().matches(types.segmentViewTypes);

  return object().shape({
    normal: object().shape({
      address: requiredStyle({
        buttons: object().shape({
          bottom: buttonTypes,
          searchResults: buttonTypes,
        }),
        cells: nullableObject({
          notification: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      cart: requiredStyle({
        buttons: object().shape({
          clear: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          header: cellTypes,
          primary: cellTypes,
          secondary: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          emptyCart: labelTypes,
          error: labelTypes,
          priceSubtotals: labelTypes,
          priceTotals: labelTypes,
          primary: labelTypes,
          secondary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
          header: viewTypes,
        }),
      }),
      catering: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
          footer: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          error: labelTypes,
          primary: labelTypes,
          secondary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject({
          standard: segmentViewTypes,
        }),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      checkout: requiredStyle({
        buttons: object().shape({
          cash: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          primary: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          cash: labelTypes,
          disclaimer: labelTypes,
          discount: labelTypes,
          error: labelTypes,
          priceSubtotals: labelTypes,
          priceTotals: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      confirm: requiredStyle({
        buttons: object().shape({
          cancel: buttonTypes,
          confirm: buttonTypes,
          negConfirm: buttonTypes,
        }),
        cells: nullableObject(),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          title: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      confirmation: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          primary: labelTypes,
          secondary: labelTypes,
          tertiary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
          body: viewTypes,
          title: viewTypes,
        }),
      }),
      discount: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      email: requiredStyle({
        buttons: nullableObject({
          alternate: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      empty: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject(),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          description: labelTypes,
        }),
        navigationViews: nullableObject({
          standard: string(),
        }),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      itemDetails: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
          group: cellTypes,
          header: cellTypes,
          primary: cellTypes,
          quantity: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: nullableObject({
          description: labelTypes,
        }),
        navigationViews: nullableObject({
          standard: string(),
        }),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      link: requiredStyle({
        buttons: nullableObject({
          clear: buttonTypes,
          link: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          link: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          primary: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
          primary: labelTypes,
          secondary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
          header: viewTypes,
        }),
      }),
      location: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
          link: cellTypes,
        }),
        dialogues: nullableObject({
          confirmation: dialogueTypes,
        }),
        inputs: nullableObject(),
        labels: object().shape({
          primary: labelTypes,
          secondary: labelTypes,
          tertiary: string()
            .ensure()
            .matches(types.labelTypes, {excludeEmptyString: true}),
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject({
          standard: segmentViewTypes,
        }),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      logout: requiredStyle({
        buttons: nullableObject({
          cancel: buttonTypes,
          confirm: buttonTypes,
        }),
        cells: nullableObject(),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          title: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      loyalty: requiredStyle({
        buttons: nullableObject({
          alternate: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          walletCard: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          description: labelTypes,
          title: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
          bar: viewTypes,
          borderedBackground: viewTypes,
          progress: viewTypes,
          secondary: viewTypes,
          trail: viewTypes,
        }),
      }),
      main: requiredStyle({
        buttons: nullableObject({
          dropdown: buttonTypes,
        }),
        cells: nullableObject(),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          primary: labelTypes,
          secondary: labelTypes,
          tertiary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      menu: requiredStyle({
        buttons: nullableObject({
          locationNotFound: buttonTypes,
        }),
        cells: nullableObject({
          footer: cellTypes,
          group: cellTypes,
          item: cellTypes,
          itemMobile: cellTypes,
          location: cellTypes,
          nav: cellTypes,
        }),
        dialogues: nullableObject({
          addItem: dialogueTypes,
        }),
        inputs: nullableObject(),
        labels: object().shape({
          locationNotFound: labelTypes,
          unavailable: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      orderDetails: requiredStyle({
        buttons: object().shape({
          radioButton: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          primary: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
          textarea: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
          formLabel: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      packingInstructions: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
          group: cellTypes,
          item: cellTypes,
        }),
        dialogues: nullableObject(),
        labels: nullableObject({
          primary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: object()
          .nullable()
          .shape({
            background: viewTypes,
            secondary: string()
              .ensure()
              .matches(types.viewTypes, {excludeEmptyString: true}),
          }),
      }),
      password: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      payment: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          error: labelTypes,
          primary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      phone: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      pincode: requiredStyle({
        buttons: nullableObject({
          alternate: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      profile: requiredStyle({
        buttons: nullableObject({
          alternate: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          cards: cellTypes,
          form: cellTypes,
          header: cellTypes,
        }),
        dialogues: nullableObject({
          confirm: dialogueTypes,
        }),
        inputs: nullableObject(),
        labels: object().shape({
          error: labelTypes,
          section: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
          secondary: viewTypes,
        }),
      }),
      scheduledAt: requiredStyle({
        buttons: nullableObject({
          alternate: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          description: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject(),
        views: nullableObject({
          background: viewTypes,
        }),
      }),
      signin: requiredStyle({
        buttons: nullableObject({
          link: buttonTypes,
        }),
        cells: nullableObject({
          bottom: cellTypes,
          form: cellTypes,
          header: cellTypes,
        }),
        dialogues: nullableObject({
          success: dialogueTypes,
        }),
        inputs: nullableObject({
          standard: inputTypes,
        }),
        labels: object().shape({
          error: labelTypes,
          terms: labelTypes,
          title: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject({
          standard: segmentViewTypes,
        }),
        views: nullableObject({
          background: viewTypes,
          secondary: viewTypes,
        }),
      }),
      template: string().matches(/StandardWeb|StandardStickysWeb|Theme3/),
      upsells: requiredStyle({
        buttons: nullableObject(),
        cells: nullableObject({
          bottom: cellTypes,
          primary: cellTypes,
        }),
        dialogues: nullableObject(),
        inputs: nullableObject(),
        labels: object().shape({
          error: labelTypes,
          primary: labelTypes,
        }),
        navigationViews: nullableObject(),
        pageControls: nullableObject(),
        segmentViews: nullableObject({
          standard: segmentViewTypes,
        }),
        views: nullableObject({
          background: viewTypes,
          header: viewTypes,
        }),
      }),
      version: string().equals(["1.0.0"]),
    }),
  });
};

const styleValidator = (helpers) => async (styleData) => {
  const {errors} = await styleSchema(helpers)
    .validate(styleData, {abortEarly: false})
    .catch((err) => {
      console.log(err);
      return err;
    });

  // if there are no errors, the validation is successful
  return errors || [];
};

export default styleValidator;
