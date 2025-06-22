import { useMemo, useState } from "react";
import { Button as MuiButton, SvgIcon } from "@mui/material";
import "../../scss/form/_button.scss";
import type { ButtonProps } from "./type";

enum AppearanceEnum {
  Contained = "contained",
  Outlined = "outlined",
  Unfilled = "unfilled",
  UnfilledInverse = "unfilledInverse",
}

enum PriorityEnum {
  Primary = "primary",
  Normal = "normal",
}

enum SizeEnum {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

const MUIButtonBaseClassName = {
  priority: {
    [PriorityEnum.Primary]: "MuiButton-colorPrimary",
    [PriorityEnum.Normal]: "MuiButton-colorNormal",
  },
  size: {
    [SizeEnum.Small]: "MuiButton-sizeSmall",
    [SizeEnum.Medium]: "MuiButton-sizeMedium",
    [SizeEnum.Large]: "MuiButton-sizeLarge",
  },
};

const MUIButtonAppearanceClassName = {
  [AppearanceEnum.Contained]: "MuiButton-contained",
  [AppearanceEnum.Outlined]: "MuiButton-outlined",
  [AppearanceEnum.Unfilled]: "MuiButton-unfilled",
  [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInverse",
};

const MUIButtonPriorityClassName = {
  [PriorityEnum.Primary]: {
    [AppearanceEnum.Contained]: "MuiButton-containedPrimary",
    [AppearanceEnum.Outlined]: "MuiButton-outlinedPrimary",
    [AppearanceEnum.Unfilled]: "MuiButton-unfilledPrimary",
    [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInversePrimary",
  },
  [PriorityEnum.Normal]: {
    [AppearanceEnum.Contained]: "MuiButton-containedNormal",
    [AppearanceEnum.Outlined]: "MuiButton-outlinedNormal",
    [AppearanceEnum.Unfilled]: "MuiButton-unfilledNormal",
    [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInverseNormal",
  },
};

const MUIButtonSizeClassName = {
  [SizeEnum.Small]: {
    [AppearanceEnum.Contained]: "MuiButton-containedSmall",
    [AppearanceEnum.Outlined]: "MuiButton-outlinedSmall",
    [AppearanceEnum.Unfilled]: "MuiButton-unfilledSmall",
    [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInverseSmall",
  },
  [SizeEnum.Medium]: {
    [AppearanceEnum.Contained]: "MuiButton-containedMedium",
    [AppearanceEnum.Outlined]: "MuiButton-outlinedMedium",
    [AppearanceEnum.Unfilled]: "MuiButton-unfilledMedium",
    [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInverseMedium",
  },
  [SizeEnum.Large]: {
    [AppearanceEnum.Contained]: "MuiButton-containedLarge",
    [AppearanceEnum.Outlined]: "MuiButton-outlinedLarge",
    [AppearanceEnum.Unfilled]: "MuiButton-unfilledLarge",
    [AppearanceEnum.UnfilledInverse]: "MuiButton-unfilledInverseLarge",
  },
};
export const Button = ({
  appearance = "contained",
  disabled = false,
  iconPosition = "leading",
  iconSize = 20,
  onClick,
  priority = "primary",
  size = "small",
  icon,
  label,
  translate = true,
  className,
  sx,
  type,
  isHovered = false,
  isActivated = false,
}: ButtonProps) => {
  const [hovered, setHovered] = useState(isHovered);
  const [activated, setActivated] = useState(isActivated);
  const [iconInvisible, setIconInvisible] = useState(false);
  //const { t } = useTranslation();
  const buttonClassName = useMemo(() => {
    const baseClassName = `${MUIButtonBaseClassName.size[size]} ${MUIButtonBaseClassName.priority[priority]}`;
    const priorityClassName = MUIButtonPriorityClassName[priority][appearance];
    const sizeClassName = MUIButtonSizeClassName[size][appearance];
    const appearanceClassName = MUIButtonAppearanceClassName[appearance];

    //return `MuiButton-root  ${appearanceClassName}  ${sizeClassName} `;
    if (hovered) {
      return `button ${baseClassName} ${appearanceClassName} ${priorityClassName} ${sizeClassName} hovered`;
    } else if (activated) {
      return `button ${baseClassName} ${appearanceClassName} ${priorityClassName} ${sizeClassName} activated`;
    }
    return `button ${baseClassName} ${appearanceClassName} ${priorityClassName} ${sizeClassName}`;
  }, [appearance, priority, size, hovered, activated]);

  const iconPositionProps = icon
    ? {
        [iconPosition === "leading" ? "startIcon" : "endIcon"]: (
          <SvgIcon sx={{ fontSize: iconSize }}>{icon}</SvgIcon>
        ),
      }
    : {};

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
    setIconInvisible((current) => !current);
  };

  const btnlabel = useMemo(() => {
    return typeof label === "string" && translate ? label : label;
  }, [label, translate]);
  return (
    <MuiButton
      sx={{ padding: label ? "6px 10px" : 0, ...sx }}
      className={buttonClassName}
      {...iconPositionProps}
      disabled={disabled}
      onClick={handleClick}
      type={type}
    >
      {btnlabel}
    </MuiButton>
  );
};
