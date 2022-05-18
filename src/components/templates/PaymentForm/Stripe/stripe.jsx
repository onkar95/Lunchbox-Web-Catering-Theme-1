import React from "react";
import {Route, Switch} from "react-router-dom";
import {withTheme} from "styled-components";
import {withTemplate} from "components/hocs";
import {Condition as If} from "components/elements";
import {useResource, useScript} from "hooks";
import {Loader, FooterButton, Confirm} from "components/fragments";
import {axios as axiosInstance, Copy, Routes} from "utils";
import {RouteWithProps} from "components/fragments/Routes";
import CheckoutForm from "./checkoutForm";
import {CheckoutCardList} from "./CheckoutCardList";
import {CARD_ROUTES} from "../../../../pages/Profile/utils";
import css from "./stripe.module.scss";

const {axios} = axiosInstance;

const Stripe = (props) => {
  const {
    style: {cells},
    onSuccess,
  } = props;

  const {resource: locationCreds, fetching} = useResource({
    data: {},
    method: "get",
    path: "/location/credentials",
  });

  const {resource = []} = useResource({
    data: {isCateringEnabled: 1},
    path: Routes.FETCH_CARDS,
  });

  const {loaded, error} = useScript("https://js.stripe.com/v3/");

  if (!loaded) {
    return null;
  }

  if (error) {
    console.error("Unable to load Payment Form");
    return <></>;
  }

  const toAddCard = () => props.history.push(CARD_ROUTES.ADD_CARD);

  const deleteCard = async (id) => {
    try {
      await axios({
        method: "DELETE",
        path: `/cards/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Route>
      <Switch>
        <RouteWithProps
          path={CARD_ROUTES.ADD_CARD}
          render={() => (
            <>
              <If is={fetching}>
                <Loader />
              </If>
              <If is={locationCreds.publicKey}>
                <CheckoutForm {...props} apiKey={locationCreds.publicKey} />
              </If>
            </>
          )}
          order={{}}
          onSuccess={props.history.goBack}
        />
        <RouteWithProps
          path={CARD_ROUTES.DELETE_CARD}
          render={({match}) => (
            <Confirm
              isNegativeConfirm
              message={Copy.PROFILE_STATIC.DELETE_CARD_CONFIRM_MESSAGE}
              confirmText={Copy.PROFILE_STATIC.CONFIRM_BUTTON_TEXT}
              cancelText={Copy.PROFILE_STATIC.CANCEL_BUTTON_TEXT}
              onConfirm={async () => {
                await deleteCard(match.params.cardId);
                props.history.goBack();
              }}
              onCancel={props.history.goBack}
            />
          )}
        />
        <RouteWithProps
          path={Routes.FETCH_CARDS}
          render={() => {
            if (resource.length) {
              return (
                <div className={css.stripeForm}>
                  <div className={css["stripeForm-container"]}>
                    <CheckoutCardList
                      resource={resource}
                      cells={cells}
                      onSuccess={onSuccess}
                      history={props.history}
                    />
                  </div>
                  <FooterButton
                    id="my-submit"
                    onClick={toAddCard}
                    type={cells.bottom}
                  >
                    {Copy.PROFILE_STATIC.ADD_CARD_BUTTON_TEXT}
                  </FooterButton>
                </div>
              );
            }
            return (
              <>
                <If is={fetching}>
                  <Loader />
                </If>
                <If is={locationCreds.publicKey}>
                  <CheckoutForm {...props} apiKey={locationCreds.publicKey} />
                </If>
              </>
            );
          }}
        />
      </Switch>
    </Route>
  );
};

export default withTheme(withTemplate(Stripe, "payment"));
