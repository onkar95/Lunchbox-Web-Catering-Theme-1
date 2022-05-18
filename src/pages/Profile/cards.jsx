/* eslint-disable no-nested-ternary */

import React from "react";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import {
  Elements,
  ElementsThemed,
  Fragments,
  Providers,
  Templates,
} from "components";
import {useResource} from "hooks";
import {axios as axiosInstance, Copy, Routes} from "utils";
import {cardFormat, CARD_ROUTES} from "./utils";
import css from "./cards.module.css";

const {axios} = axiosInstance;
const {
  Condition,
  Layout: {Flex},
} = Elements;
const {ThemeText, View, Cell, ThemeButton, Dialogue} = ElementsThemed;
const {
  Loader,
  FooterButton,
  Routes: {RouteWithProps},
  Confirm,
  Empty,
  BackButton,
} = Fragments;
const {PaymentForm} = Templates;
const {
  Notifications: {useNotification},
} = Providers;

const Cards = ({style: {cells, labels, views}, history}) => {
  const {
    resource = [],
    fetching,
    error,
  } = useResource({
    data: {isCateringEnabled: 1},
    path: Routes.FETCH_CARDS,
  });

  if (Object.keys(error).length) {
    throw error;
  }

  if (fetching) {
    return <Loader />;
  }

  let render = null;
  if (!resource.length) {
    render = (
      <Empty img="error">
        <ThemeText type={labels.error}>
          {Copy.PROFILE_STATIC.NO_CARDS}
        </ThemeText>
      </Empty>
    );
  } else {
    render = resource.map((i) => (
      <Cell key={i.id} type={cells.cards}>
        {({views: cellViews, labelTextStyles, buttons}) => {
          const {mappedLast4, mappedBrand} = cardFormat(
            i.brand,
            i.last4,
            i.expMonth,
            i.expYear,
          );
          return (
            <View
              type={cellViews.background}
              className={css["card-item"]}
              Component={Flex}
              direction="row"
              justify="between"
            >
              <Flex grow="1" justify="between">
                <ThemeText type={labelTextStyles.primary} className={css.brand}>
                  {mappedBrand}
                </ThemeText>
                <ThemeText
                  type={labelTextStyles.secondary}
                  className={css.digits}
                >
                  {mappedLast4}
                </ThemeText>
              </Flex>
              <Flex direction="row" grow="1" justify="end" align="center">
                <Condition is={!i.primaryCard}>
                  <ThemeButton
                    type={buttons.primary}
                    onClick={() => history.push(`/primary/${i.id}`)}
                  >
                    {Copy.PROFILE_STATIC.MAKE_PRIMARY_BUTTON_TEXT}
                  </ThemeButton>
                </Condition>
                <Condition is={i.primaryCard}>
                  <ThemeText type={labelTextStyles.tertiary}>
                    {Copy.PROFILE_STATIC.PRIMARY_SELECTION_TEXT}
                  </ThemeText>
                </Condition>
                &nbsp;
                <ThemeButton
                  type={buttons.primary}
                  onClick={() => history.push(`/delete/${i.id}`)}
                >
                  {Copy.PROFILE_STATIC.DELETE_CARD_BUTTON_TEXT}
                </ThemeButton>
              </Flex>
            </View>
          );
        }}
      </Cell>
    ));
  }
  return (
    <View
      type={views.secondary}
      Component={Flex}
      grow="1"
      className={css.container}
    >
      <Flex grow="1" className={css.content}>
        {render}
      </Flex>
      <FooterButton
        type={cells.bottom}
        onClick={() => history.push(CARD_ROUTES.ADD_CARD)}
      >
        {Copy.PROFILE_STATIC.ADD_CARD_BUTTON_TEXT}
      </FooterButton>
    </View>
  );
};

const renderNotification = (type, title, message) => (
  <Dialogue type={type}>
    {({labelTextStyles, view}) => (
      <View type={view} style={{padding: "10px"}}>
        <div>
          <ThemeText type={labelTextStyles.secondary}>{title}</ThemeText>
        </div>
        <div>
          <ThemeText type={labelTextStyles.primary}>{message}</ThemeText>
        </div>
      </View>
    )}
  </Dialogue>
);

const CardRoutes = ({style}) => {
  const {add} = useNotification();

  const onClickBack = (memory) => () =>
    memory.location.pathname !== "/" ? memory.history.goBack() : null;

  const notice = (title, message) => {
    add(renderNotification(style.dialogues.confirm, title, message));
  };

  const deleteCard = async (id) => {
    try {
      await axios({
        method: "DELETE",
        path: `/cards/${id}`,
      });
      notice(
        Copy.PROFILE_STATIC.SUCCESS_HEADER,
        Copy.PROFILE_STATIC.CARD_DELETED_MESSAGE,
      );
    } catch (error) {
      console.error(error);
      notice(
        Copy.PROFILE_STATIC.ERROR_HEADER,
        Copy.PROFILE_STATIC.ERROR_MESSAGE,
      );
    }
  };

  const updateCard = async (id, data) => {
    try {
      await axios({
        data,
        method: "PUT",
        path: `/cards/${id}`,
      });
      notice(
        Copy.PROFILE_STATIC.SUCCESS_HEADER,
        Copy.PROFILE_STATIC.PRIMARY_CARD_UPDATED,
      );
    } catch (error) {
      console.error(error);
      notice(
        Copy.PROFILE_STATIC.ERROR_HEADER,
        Copy.PROFILE_STATIC.ERROR_MESSAGE,
      );
    }
  };

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <Route
        render={({location, history}) => (
          <>
            {!["/"].includes(location.pathname) && (
              <div className={css.navigation}>
                <BackButton onClick={onClickBack({history, location})} />
              </div>
            )}
            <Flex direction="col" grow="1">
              <Switch>
                <RouteWithProps
                  exact
                  path="/"
                  style={style}
                  component={Cards}
                />
                <RouteWithProps
                  path={CARD_ROUTES.ADD_CARD}
                  component={PaymentForm}
                  order={{}}
                  onSuccess={() => history.goBack()}
                />
                <RouteWithProps
                  path="/primary/:id"
                  render={({match}) => (
                    <Confirm
                      message={Copy.PROFILE_STATIC.SET_AS_PRIMARY_PAYMENT}
                      confirmText={Copy.PROFILE_STATIC.CONFIRM_BUTTON_TEXT}
                      cancelText={Copy.PROFILE_STATIC.CANCEL_BUTTON_TEXT}
                      onConfirm={async () => {
                        await updateCard(match.params.id, {isPrimary: true});
                        history.goBack();
                      }}
                      onCancel={history.goBack}
                    />
                  )}
                />
                <RouteWithProps
                  path="/delete/:id"
                  render={({match}) => (
                    <Confirm
                      isNegativeConfirm
                      message={Copy.PROFILE_STATIC.DELETE_CARD_CONFIRM_MESSAGE}
                      confirmText={Copy.PROFILE_STATIC.CONFIRM_BUTTON_TEXT}
                      cancelText={Copy.PROFILE_STATIC.CANCEL_BUTTON_TEXT}
                      onConfirm={async () => {
                        await deleteCard(match.params.id);
                        history.goBack();
                      }}
                      onCancel={history.goBack}
                    />
                  )}
                />
              </Switch>
            </Flex>
          </>
        )}
      />
    </MemoryRouter>
  );
};

export default CardRoutes;
