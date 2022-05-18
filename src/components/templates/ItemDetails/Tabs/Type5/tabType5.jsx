/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, {useEffect, useRef} from "react";
import Styled from "styled-components";
import csx from "classnames";
import {View, ThemeButton as Button} from "components/elementsThemed";
import {useCell, useMutationObserver} from "hooks";
import {helpers} from "utils";
import Option from "./option";
import css from "./index.module.scss";

const {debounce, disableScroll, enableScroll, onWheelElementHandler} = helpers;

const findError = (errors, id) => {
  const match = errors.find((i) => i.optionId === id);
  if (match) {
    return match.message;
  }
  return null;
};

const deactivateNodes = (optionIds, excluded = []) => {
  optionIds.forEach((optionId) => {
    if (!excluded.includes(optionId)) {
      const node = document.getElementById(`nav-${optionId}`);
      if (node) {
        node.dataset.active = 0;
      }
    }
  });
};

const TabButton = Styled(({id, type, onClick, children, className}) => (
  <li id={`nav-${id}`} className={`${css["nav-item"]} ${className}`} data-active={0}>
    <Button className={`${css["item-button"]}`} type={type} onClick={onClick}>
      {children}
    </Button>
  </li>
))`
  ${(props) => {
    const {
      theme: {buttons},
    } = props;

    const color = buttons[props.type]
      ? buttons[props.type].stateTextStyles.selected.split("_")[1]
      : "#000";
    const hex = props.theme.colors[color];
    return `
      &[data-active="1"]{
        color: ${hex}
      }

      &[data-active="1"] span{
        color: ${hex}
      }`;
  }}
`;

const additionalOffset = 55;

const Type5 = (props) => {
  const {
    tabs,
    cells,
    errors,
    addToMods,
    removeMod,
    menuOptions,
    modifications,
    // fix,
    optionRefs,
    handleScroll,
  } = props;

  const {views, button} = useCell(cells.header);

  const scrollingTabRef = useRef();
  const errorRefs = useRef({});
  const tabList = useRef();

  const handleHighlight = useRef(
    (scrollTop, isScrolledToBottom, isScrolledToTop) => {
      const tabListHeight =
        tabList && tabList.current ? tabList.current.clientHeight : 0;
      const tabListOffset = tabList?.current?.offsetTop;

      const triggerPoint = scrollTop + tabListHeight + tabListOffset;
      const optionIds = Object.keys(optionRefs.current);

      const aboveMidway = [];
      const inTheView = [];


      for (const x in optionRefs.current) {
        const { node } = optionRefs.current[x];
        const offset = node?.offsetTop ?? 0;
        const nodeHeight = node?.clientHeight ?? 0;
        const nodeMidwayOffset = offset - nodeHeight / 2;

        if (offset <= triggerPoint) {
          const diffFromMidway = Math.abs(nodeMidwayOffset - triggerPoint);
          aboveMidway.push({
            diff: diffFromMidway,
            nodeMidwayOffset,
            option: x,
            option: optionRefs.current[x],
            scrollTop,
          });
        }

        if (offset - scrollTop - window.innerHeight + 300 < 0) {
          inTheView.push({
            nodeMidwayOffset,
            option: x,
            scrollTop,
          });
        }
      }

      if (isScrolledToBottom) {
        const menuOptionId = [...optionIds].pop();
        const tabNode = document.getElementById(`nav-${menuOptionId}`);
        // deactivate any tabs not the active tab
        deactivateNodes(optionIds, [menuOptionId]);
        if (tabNode?.dataset?.active !== undefined) {
          tabNode.dataset.active = 1;
        }
      } else if (isScrolledToTop) {
        const menuOptionId = [...optionIds].shift();
        const tabNode = document.getElementById(`nav-${menuOptionId}`);
        // deactivate any tabs not the active tab
        deactivateNodes(optionIds, [menuOptionId]);
        if (tabNode?.dataset?.active !== undefined) {
          tabNode.dataset.active = 1;
        }
      } else {
        const menuOptionId = inTheView[inTheView.length - 1].option;
        const tabNode = document.getElementById(`nav-${menuOptionId}`);
        deactivateNodes(optionIds, [menuOptionId]);

        if (tabNode?.dataset?.active !== undefined) {
          tabNode.dataset.active = 1;
        }
      }
      
      const menuOptionId = inTheView[inTheView.length - 1].option;
      const tabNode = document.getElementById(`nav-${menuOptionId}`);
      const navEl = scrollingTabRef.current;
      if (navEl) {
        const navWidth = navEl?.offsetWidth;
        const navCenterOfView = navWidth / 2;
        const nodeWidth = tabNode?.offsetWidth;
        const nodeCenterPosition = tabNode?.offsetLeft + nodeWidth / 2;
        navEl.scrollTo(nodeCenterPosition - navCenterOfView, 0);
      }
    },
  );


  const getScrollOffset = (node) => {
    if (!node) return 0;
    if (tabList.current) {
      const tabListHeight = tabList.current.clientHeight;
      return node.offsetTop - tabListHeight - additionalOffset;
    }
    return node.offsetTop - additionalOffset;
  };

  useEffect(() => {
    const el = document.getElementById("itemDetailsContainer");
    const handler = _.debounce(() => {
      const scrollPos = el.scrollTop;
      const isScrolledToBottom =
        el.scrollHeight - scrollPos === el.clientHeight;
      const isScrolledToTop = scrollPos === 0;
      handleHighlight.current(scrollPos, isScrolledToBottom, isScrolledToTop);
    }, 100);

    el.addEventListener("scroll", handler);

    return () => {
      if (el) {
        el.removeEventListener("scroll", handler);
      }
    };
  }, []);

  // used to scroll to any menu option that has invalid number of selection(s).
  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorOptionId = errors?.[0].optionId;
      const firstErrorRef = optionRefs?.current[errorOptionId];
      const tabListHeight = tabList?.current?.clientHeight;
      const el = document.getElementById("itemDetailsContainer");
      const triggerPoint = tabListHeight + additionalOffset;

      if (firstErrorRef?.node && firstErrorRef.node !== null) {
        el.scrollTo({
          behavior: "auto",
          top: firstErrorRef.node?.offsetTop - triggerPoint,
        });
      }
    }
  }, [errors.length]);

  useEffect(() => {
    const el = scrollingTabRef.current;
    if (!el) return;

    if (el.clientWidth < el.scrollWidth) {
      el.dataset.hasScroll = el.clientWidth < el.scrollWidth ? 1 : 0;
    }

    const storeScroll = debounce(() => {
      el.dataset.scroll = el.scrollLeft;
      el.dataset.atMax =
        el.scrollWidth - el.clientWidth === el.scrollLeft ? 1 : 0;
    });
    el.addEventListener("scroll", storeScroll, {passive: true});

    // eslint-disable-next-line consistent-return
    return function cleanup() {
      el.removeEventListener("scroll", storeScroll);
    };
  }, [scrollingTabRef.current]);

  // Used to hightlight the first tab on initial render
  useEffect(() => {
    if (
      tabs &&
      tabs.length &&
      tabs[0].entities &&
      tabs[0].entities.length &&
      tabs[0].entities[0]
    ) {
      const node = document.getElementById(`nav-${tabs[0].entities[0].id}`);
      if (node) {
        node.dataset.active = 1;
      }
    }
  }, []);

  useMutationObserver(
    (mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-fixed"
        ) {
          if (tabList.current) {
            const x = mutation.target.getAttribute(mutation.attributeName);
            tabList.current.dataset.fixed = x;
          }
        }
      }
    },
    {
      attributes: true,
      selector: "#itemDetails",
    },
  );

  return (
    <div className={css["itemDetails-tabs"]}>
      <div ref={tabList} className={csx(css["itemDetails-tabs-nav-container"])}>
        <View
          type={views.background}
          Component="ul"
          innerRef={scrollingTabRef}
          className={css.nav}
          data-scroll="0"
          onWheel={(e) => onWheelElementHandler(e, scrollingTabRef.current)}
          onMouseEnter={disableScroll}
          onMouseLeave={enableScroll}
        >
          {tabs.map((tab) =>
            tab.entities.map((option) => (
              <TabButton
                key={option.id}
                id={option.id}
                type={button}
                onClick={() => {
                  handleScroll(option.id);
                }}
              >
                {option.name}
              </TabButton>
            )),
          )}
        </View>
        <div className={css.left}>&lsaquo;</div>
        <div className={css.right}>&rsaquo;</div>
      </div>
      <div className={css["itemDetails-tabs-menu-options"]}>
        {tabs.map((i, tabIndex) =>
          i.entities.map((option, index) => (
            <Option
              key={option.id}
              navIndex={option.id}
              optionRef={(node) => {
                optionRefs.current[option.id] = {
                  index,
                  node,
                  optionId: option.id,
                  scrollToPosition: getScrollOffset(node),
                  tabIndex,
                };
              }}
              errorRef={(node) => {
                errorRefs.current[option.id] = {
                  index,
                  node,
                  optionId: option.id,
                  scrollToPosition: getScrollOffset(node),
                  tabIndex,
                };
              }}
              type={cells.group}
              optionItemTypes={{
                default: cells.primary,
                selected: cells.primarySelected,
              }}
              {...menuOptions[option.id]}
              error={findError(errors, option.id)}
              selectedMods={modifications[option.id] || []}
              onAddMod={addToMods}
              onRemoveMod={removeMod}
            />
          )),
        )}
      </div>
    </div>
  );
};

Type5.displayName = "TabType5";

export default Type5;
