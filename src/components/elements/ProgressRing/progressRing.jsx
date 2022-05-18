import React from "react";
import {withTheme} from "styled-components";

const ProgressRing = ({progress, radius, stroke, ...props}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={props.theme.colors.accentLight}
        fill={props.theme.colors.alternateGray}
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{strokeDashoffset}}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default withTheme(ProgressRing);
