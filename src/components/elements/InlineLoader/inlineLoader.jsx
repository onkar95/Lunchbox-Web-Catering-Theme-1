import React from "react";
import PropTypes from "prop-types";
import styled, {keyframes} from "styled-components";

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: .2;
  }

  50% {
    opacity: .8;
  }
`;

const StyledCircle = styled.circle.attrs({
  cy: 2,
  fill: "currentColor",
  r: 2,
})``;

const StyledTypingSvg = styled.svg.attrs((props) => ({
  height: props.size * 0.25,
  viewBox: "0 0 16 4",
  width: props.size,
}))`
  color: ${({color}) => color};

  ${StyledCircle} {
    opacity: 0.2;

    &:nth-child(1) {
      animation: ${pulseAnimation} 1s infinite;
      animation-delay: 0.4s;
    }

    &:nth-child(2) {
      animation: ${pulseAnimation} 1s infinite;
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation: ${pulseAnimation} 1s infinite;
      animation-delay: unset;
    }
  }
`;

/**
 * All other props are spread onto the root `<svg>` element
 *
 * @param root0
 * @param root0.size
 * @param root0.color
 */
const InlineLoader = ({size, color, ...other}) => (
  <StyledTypingSvg size={size} color={color} {...other}>
    <StyledCircle cx="14" />
    <StyledCircle cx="8" />
    <StyledCircle cx="2" />
  </StyledTypingSvg>
);

InlineLoader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};

InlineLoader.defaultProps = {
  color: "inherit",
  size: 16,
};

export default InlineLoader;
