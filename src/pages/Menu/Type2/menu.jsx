import React from "react";
import {StickyContainer, Sticky} from "react-sticky";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Condition as If} from "components/elements";
import {ElementsThemed, Fragments, HOCs} from "components";
import {helpers, axios, Copy, config} from "utils";
import NavSelector from "../Nav";
import GroupSelector from "../Groups";
import InfoSelector from "../Information";
import styles from "./menu.module.scss";

const {withTemplate} = HOCs;
const {footer} = config.components;

const {ThemeText, View, Cell, ThemeButton} = ElementsThemed;
const {
  Loader,
  Image: {Image},
  Footer,
} = Fragments;

const {
  Grid: {Row, Col},
} = Lbc;

const {debounce, scrollWithOffset} = helpers;

const getElementTopOffsetsById = (ids) => {
  return ids
    .map((id) => {
      const element = document.getElementById(id);
      if (!element) {
        return null;
      }
      return {
        id,
        offsetBottom: element.offsetTop + element.offsetHeight,
        offsetTop: element.offsetTop,
      };
    })
    .filter((item) => item);
};

class Menu extends React.Component {
  handleScroll = debounce(() => {
    // 0 is down, 1 is up
    const scrollDirection = this.prevScrollY < window.scrollY ? 0 : 1;
    let group = this.groupOffsets.find((groupOffset) => {
      return (
        window.scrollY + 300 >= groupOffset.offsetTop &&
        window.scrollY + 300 < groupOffset.offsetBottom
      );
    });

    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      group = this.groupOffsets[this.groupOffsets.length - 1];
    }

    if (group) {
      const node = this.links[group.id];
      const navEl = document.getElementById("nav");
      if (!node.active && group.id) {
        node.active = true;
        node.setAttribute("active", 1);

        if (scrollDirection) {
          if (node.offsetLeft < navEl.scrollLeft) {
            navEl.scrollTo(navEl.scrollLeft - node.offsetWidth, 0);
          }
        } else if (node.offsetLeft + node.offsetWidth > window.innerWidth) {
          navEl.scrollTo(navEl.scrollLeft + node.offsetWidth, 0);
        }

        Object.entries(this.links).forEach((i) => {
          if (i[0] !== group.id) {
            // checking due to bug where nav name exists but doesnt have a node;
            // occurs when changing locations
            if (i[1]) {
              i[1].active = false;
              i[1].setAttribute("active", 0);
            }
          }
        });
      }
    }
    this.prevScrollY = window.scrollY;
  });

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      fetching: true,
      location: {},
      activeId: "",
    };
    this.prevScrollY = 0;
    this.groupOffsets = [];
    this.groups = {};
    this.links = {};
    this.onNavClick = this.onNavClick.bind(this);
  }

  componentDidMount() {
    if (this.props.location.hash) {
      const [_, hash] = decodeURI(this.props.location.hash).split("#");
      this.setState((prev) => ({...prev, activeId: hash}));
    }
    this.getLocation();
    this.calculateItemTopOffsets();
    window.addEventListener("scroll", this.handleScroll, {passive: true});
    window.addEventListener("resize", this.handleResize, {passive: true});
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (!this.state.fetching && prevState.fetching) ||
      (!this.props.menu.fetching && prevProps.menu.fetching)
    ) {
      this.calculateItemTopOffsets();
      // Ensure first link is active;
      const linkKeys = Object.keys(this.links);
      if (linkKeys.length && this.links[linkKeys[0]]) {
        // early return the scroll action if there is only 1 item in the array. This prevents the "scrolloffsetTop" error when double clicking the only navItem.
        if (linkKeys.length === 1) {
          return;
        }
        this.links[linkKeys[0]].active = true;
        this.links[linkKeys[0]].setAttribute("active", 1);
      }
    }
    if (this.state.activeId) {
      if (this.groups[this.state.activeId]) {
        setTimeout(() => {
          scrollWithOffset(this.groups[this.state.activeId], 200);
        }, 100);
      }
    }
    // change the highlighted nav element if the url hash changes
    if (prevProps.location.hash && !this.props.location.hash) {
      Object.entries(this.links).forEach(([node], index) => {
        if (node) {
          node.active = index === 0;
          node.setAttribute("active", index === 0 ? 1 : 0);
        }
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  }

  getHash(hash) {
    if (hash) {
      return decodeURI(this.props.location.hash).split("#")[1];
    }
    return "";
  }

  calculateItemTopOffsets = () => {
    this.groupOffsets = getElementTopOffsetsById(Object.keys(this.groups));
  };

  handleResize = () => {
    this.calculateItemTopOffsets();
    this.handleScroll();
  };

  /**
   * When a navitem is clicked
   * @param {*} id
   */
  onNavClick = (id) => {
    if (id) {
      this.setState((prev) => ({...prev, activeId: id}));
    }
  };

  getLocation = async () => {
    const {order, history} = this.props;
    const newState = {};
    if (order.location.id) {
      newState.location = order.location;
      this.setState({...newState, fetching: false});
    } else {
      try {
        const {data} = await axios.methods.post("/locations", {
          isCateringEnabled: 1,
        });
        if (data.length >= 1) {
          order.changeLocation(data[0]);
          const [location] = data;
          newState.location = location;
        } else {
          history.replace("/");
          order.changeLocation({});
        }
      } catch (error) {
        newState.error = error;
      } finally {
        this.setState({...newState, fetching: false});
      }
    }
  };

  render() {
    const {
      menu: {menus, groups, groupsHash, fetching},
      style,
      order,
      location,
      history,
    } = this.props;
    const {fetching: fetchingLocation, error} = this.state;
    const hash = decodeURI(location.hash).split("#")[1];
    if (error) {
      return (
        <div className={styles.loader}>
          <Row>
            <Col xs="1" sm={{span: "1"}}>
              <div className={styles["missing-menu"]}>
                <ThemeText type={style.labels.locationNotFound}>
                  {Copy.MENU_STATIC.LOCATION_NOT_EXIST}
                </ThemeText>
                <Image src={config?.images?.art_empty_cart} alt="Empty Menu" />
                <br />
                <ThemeButton
                  type={style.buttons.locationNotFound}
                  onClick={() => history.replace("/")}
                >
                  {Copy.MENU_STATIC.FIND_NEAREST_LOCATION}
                </ThemeButton>
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    if (fetching || fetchingLocation) {
      return (
        <div className={styles.loader}>
          <Loader />
        </div>
      );
    }

    const filteredGroups = menus
      .reduce((accu, menu) => {
        const menuGroups = menu.groups.reduce((accu1, group) => {
          const tempGroup = {...groupsHash[group.id]};
          tempGroup.subgroups = tempGroup.subgroups.reduce(
            (accu2, subgroup) => {
              if (groupsHash[subgroup.id]) {
                accu2.push(groupsHash[subgroup.id]);
              }
              return accu2;
            },
            [],
          );
          accu1.push(tempGroup);
          return accu1;
        }, []);

        return [...accu, ...menuGroups];
      }, [])
      .sort((a, b) => {
        return (
          groups.findIndex((i) => i.id === a.id) -
          groups.findIndex((i) => i.id === b.id)
        );
      })
      .filter((group) => !!group.items.length);

    return (
      <View type={style.views.background}>
        <StickyContainer>
          <Row>
            <Col xs="1">
              <div
                className={styles["header-image"]}
                style={{
                  backgroundImage: `url(${config?.images?.art_menu_catering_header})`,
                  backgroundSize: "cover",
                }}
              >
                <InfoSelector
                  type={style.cells.location}
                  location={this.state.location}
                />
              </div>
            </Col>
          </Row>
          <Sticky topOffset={225}>
            {(stickyProps) => (
              <div style={{...stickyProps.style, top: "4.5rem", zIndex: 9}}>
                <NavSelector
                  type={style.cells.nav}
                  navItems={filteredGroups}
                  activeLink={hash}
                  onNavClick={this.onNavClick}
                  innerRef={(node, name) => {
                    this.links[name] = node;
                  }}
                />
              </div>
            )}
          </Sticky>
          <div className={styles.groups}>
            {filteredGroups.length ? (
              filteredGroups.map((i) => (
                <div
                  id={i.name}
                  key={i.id}
                  className={styles["group-anchor"]}
                  ref={(node) => {
                    this.groups[i.name] = node;
                  }}
                >
                  <GroupSelector
                    type={style.cells.group}
                    isViewOnly={order.isViewOnly}
                    itemType={{
                      desktop: style.cells.item,
                      mobile: style.cells.itemMobile,
                    }}
                    onAdd={order.addToOrder}
                    {...i}
                  />
                </div>
              ))
            ) : (
              <Row>
                <Col xs="1" sm={{offset: "1-3", span: "1-3"}}>
                  <div className={styles["missing-menu"]}>
                    <ThemeText type={style.labels.unavailable}>
                      {Copy.MENU_STATIC.MENU_UNAVAILABLE}
                    </ThemeText>
                    <Image
                      src={config?.images?.art_empty_cart}
                      alt="Empty Menu"
                    />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </StickyContainer>

        <If is={footer && footer !== "fixed"}>
          <Footer type={style.cells.footer} version="Sticky" />
        </If>
        <If is={footer === "fixed"}>
          <Cell
            type={style.cells.footer}
            render={({labelTextStyles, views}) => (
              <View type={views.background} className={styles.footer}>
                <ThemeText type={labelTextStyles.primary}>
                  Powered By&nbsp;
                  <a
                    href="https://lunchbox.io"
                    className={styles["footer-link"]}
                  >
                    <ThemeText type={labelTextStyles.primary}>
                      Lunchbox
                    </ThemeText>
                  </a>
                </ThemeText>
              </View>
            )}
          />
        </If>
      </View>
    );
  }
}

export default withTemplate(Menu, "menu");
