import React, {Fragment, useState, useRef, useEffect} from "react";
import debounce from "lodash/debounce";
import {useOnClickOutside} from "hooks";
import classnames from "classnames";
import {ElementsThemed} from "components";
import {axios, Copy} from "utils";
import styles from "./liveSearch.module.css";

const {ThemeButton, Field} = ElementsThemed;
const {
  methods: {get},
} = axios;
const {Input} = Field;

const render = (items, type, onSelect) => {
  if (!items.length) {
    return <SearchResult type={type}>Location Not found</SearchResult>;
  }
  return items.map((i, index) => {
    return (
      <Fragment key={index}>
        <SearchResult type={type} key={i.text} onClick={() => onSelect(i)}>
          {i.text}
        </SearchResult>
        {index < items.length - 1 && <hr className={styles.divider} />}
      </Fragment>
    );
  });
};

const LiveSearch = ({orderType, ...props}) => {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [visible, setVisible] = useState(false);

  const ref = useRef();
  const dropdownRef = useRef();

  const hide = () => {
    setVisible(false);
  };
  const show = () => {
    if (text.trim().length || props.recentAddresses.length) {
      setVisible(true);
    }
  };

  const onChange = ({target: {value}}) => {
    setText(value);
    props.inputProps.onChange(value);
  };

  const onSelect = (company) => {
    props.onSelect(company);
    setVisible(false);
  };

  const debouncedfetch = useRef(
    debounce(async (searchValue) => {
      setFetching(false);
      try {
        const {data} = await get("/address", {
          address: searchValue,
          orderType,
        });
        setItems(data);
        setVisible(true);
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    }, 300),
  );

  useEffect(() => {
    if (text.trim().length) {
      debouncedfetch.current(text.trim());
    } else {
      hide();
    }
  }, [text]);

  // useEffect(() => {
  //   const current = ref.current;
  //   current.addEventListener("focusout", hide);
  //   return () => current.addEventListener("focusout", hide);
  // }, []);

  useOnClickOutside(dropdownRef, hide);

  const {inputProps} = props;

  const searchResultsClasses = classnames(
    styles["search-results"],
    visible ? styles.visible : undefined,
  );

  const searchResultsList = text
    ? items
    : props.recentAddresses.filter(
        (recentAddress) => recentAddress.text !== "" && recentAddress.id !== "",
      );

  return (
    <div className={styles["search-container"]}>
      <div className={styles["search-dropdown"]}>
        <Input
          inputRef={ref}
          {...inputProps}
          type={props.type}
          className={styles.input}
          onChange={onChange}
          onBlur={hide}
          onFocus={show}
        />

        <div ref={dropdownRef} className={searchResultsClasses}>
          {fetching ? (
            <p>{Copy.LIVE_SEARCH_STATIC.MESSAGE}</p>
          ) : (
            render(searchResultsList, props.resultType, onSelect)
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};

const SearchResult = ({className, type, children, onClick}) => {
  const classes = classnames(styles["search-result"], className);
  return (
    <ThemeButton
      type={type}
      Component="div"
      className={classes}
      onMouseDown={onClick}
    >
      {children}
    </ThemeButton>
  );
};

export {LiveSearch};
export default LiveSearch;
