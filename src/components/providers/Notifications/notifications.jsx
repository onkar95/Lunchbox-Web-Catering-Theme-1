/* eslint-disable react/destructuring-assignment */
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  Children,
} from "react";
import Elements from "components/elements";
import posed, {PoseGroup} from "react-pose";
import styles from "./notification.module.css";

const {Portal} = Elements;
const NotificationContext = createContext();

const reducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD":
      return [...state, {...payload, id: +new Date()}];
    case "REMOVE":
      return state.filter((i) => payload.id !== i.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

const NotificationStore = ({children}) => {
  const [notifications, dispatch] = useReducer(reducer, []);

  const add = (content) => {
    dispatch({
      payload: {
        content,
      },
      type: "ADD",
    });
  };
  const remove = (id) => {
    dispatch({
      payload: {
        id,
      },
      type: "REMOVE",
    });
  };

  useEffect(() => {
    if (notifications.length) {
      const needsTimeout = notifications.filter((i) => !i.interval);
      needsTimeout.forEach((i) => {
        i.interval = setTimeout(() => {
          remove(i.id);
        }, 3000);
      });
    }
  }, [notifications]);

  const contextValues = {
    add,
    notifications,
    remove,
  };

  return (
    <NotificationContext.Provider value={contextValues}>
      {typeof children === "function"
        ? Children.only(children(contextValues))
        : Children.only(children)}

      <Portal className={styles.wrapper}>
        <div
          style={{
            pointerEvents: notifications.length ? null : "none",
          }}
        >
          <PoseGroup>
            {notifications.map((i) => {
              const notificationProps = {
                className: styles.item,
                key: i.id,
              };
              switch (typeof i.content) {
                case "object":
                  notificationProps.children = i.content;
                  break;
                case "function":
                  notificationProps.children = i.content({remove});
                  break;
                case "string":
                  notificationProps.children = i.content;
                  break;
                default:
                  return null;
              }
              return <Notice {...notificationProps} />;
            })}
          </PoseGroup>
        </div>
      </Portal>
    </NotificationContext.Provider>
  );
};

const Notice = posed.div({
  enter: {
    opacity: 1,
    transition: {
      ease: [0.35, 0, 0.25, 1],
    },
    x: "0px",
  },
  exit: {
    opacity: 0,
    x: "100px",
  },
});

const useNotification = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw Error(
      "The `useNotification` hook must be called from a descendent of the `Notification Provider`.",
    );
  }

  return {
    add: ctx.add,
    notifications: ctx.notifications,
    remove: ctx.remove,
  };
};
export default {
  Context: NotificationContext,
  NotificationStore,
  useNotification,
};
