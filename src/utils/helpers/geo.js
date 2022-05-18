const addComma = (value) => `${value ? `${value},` : ""}`;

const formatAddress = (address) =>
  `${addComma(address.street1)}${addComma(address.street2)} ${addComma(
    address.city,
  )} ${address.state} ${address.zip}`;

const mapGoogleAddressComponents = (addressComponents) => {
  const ShouldBeComponent = {
    city: [
      "locality",
      "sublocality",
      "sublocality_level_1",
      "sublocality_level_2",
      "sublocality_level_3",
      "sublocality_level_4",
      // https://developers.google.com/places/supported_types#table3
      "administrative_area_level_3",
    ],
    country: ["country"],
    home: ["street_number"],
    state: [
      "administrative_area_level_1",
      "administrative_area_level_2",
      "administrative_area_level_4",
      "administrative_area_level_5",
    ],
    street1: ["street_address", "route"],
    zip: ["postal_code"],
  };

  let address = {
    city: "",
    country: "",
    home: "",
    state: "",
    street1: "",
    street2: "",
    zip: "",
  };

  addressComponents.forEach((component) => {
    Object.keys(ShouldBeComponent).forEach((shouldBe) => {
      if (ShouldBeComponent[shouldBe]?.indexOf(component.types[0]) !== -1) {
        if (["country", "state"].includes(shouldBe)) {
          address[shouldBe] = component.short_name;
        } else {
          address[shouldBe] = component.long_name;
        }
      }
    });
  });

  address = {
    ...address,
    home: undefined,
    street1: `${address.home} ${address.street1}`.trim(),
  };
  return address;
};

export {formatAddress, mapGoogleAddressComponents};

export default {
  formatAddress,
  mapGoogleAddressComponents,
};
