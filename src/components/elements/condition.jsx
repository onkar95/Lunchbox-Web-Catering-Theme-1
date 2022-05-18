import {PureComponent, Children} from "react";

class Condition extends PureComponent {
  static True = ({children}) => children;

  static False = ({children}) => children;

  render() {
    const {condition, is, children} = this.props;
    const finalCondition = is !== undefined ? is : condition;
    const trueRenders = [];
    const falseRenders = [];

    Children.forEach(children, (child) => {
      switch (child.type) {
        case this.True: {
          trueRenders.push(child);
          break;
        }
        case this.False: {
          falseRenders.push(child);
          break;
        }
        default: {
          finalCondition && trueRenders.push(child);
        }
      }
    });
    return finalCondition ? trueRenders : falseRenders;
  }
}

export {Condition};
export default Condition;
