import { styled, Switch, Typography, Box } from "@mui/material";
import type { Android12SwitchProps } from "./type";
import "../../scss/form/_switch.scss";

const Android12Switch = ({
  color,
  label,
  switchProps,
  hasLabel,
  onChange,
  labelOn,
  labelOff,
  checked,
  disabled,
}: Android12SwitchProps) => {
  const inputProps = {
    "data-testid": "switch-input",
    ...((switchProps?.inputProps as React.InputHTMLAttributes<HTMLInputElement>) ||
      {}),
  };

  const combinedSwitchProps = {
    disabled,
    inputProps,
    ...switchProps,
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <CustomSwitch
        className="custom-switch"
        customColor={color}
        hasLabel={hasLabel}
        labelOn={labelOn}
        labelOff={labelOff}
        onChange={onChange}
        checked={checked}
        {...combinedSwitchProps}
      />
      {label && <Typography variant="caption">{label}</Typography>}
    </Box>
  );
};

const CustomSwitch = styled(Switch, {
  shouldForwardProp: (prop) =>
    !["customColor", "hasLabel", "labelOn", "labelOff", "checked"].includes(
      prop as string
    ),
})<{
  customColor?: string;
  hasLabel?: boolean;
  labelOn?: string;
  labelOff?: string;
  checked?: boolean;
}>(({ theme, customColor, hasLabel, labelOn, labelOff }) => {
  const labelWidth = `${
    Math.max(labelOff?.length || 0, labelOn?.length || 0) + 6
  }ch`;
  return {
    padding: 8,
    width: hasLabel ? labelWidth : 50,
    "& .MuiButtonBase-root.MuiSwitch-switchBase": {
      margin: 4,
      top: 5,
      left: 2,
    },
    "& .MuiSwitch-track": {
      borderRadius: 11,
      height: hasLabel ? 24 : 16,
      width: hasLabel ? labelWidth : 33,
      backgroundColor: theme.palette.grey[400],
      transition: "background-color 0.3s ease",
      position: "relative",
      "&::before":
        hasLabel && labelOn
          ? {
              content: `"${labelOn}"`,
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              fontSize: 12,
              display: "none",
              color: theme.palette.getContrastText(customColor || "#8bbae8"),
            }
          : {
              content: '""',
              position: "absolute",
              top: "50%",
              left: 8.5,
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"16\" width=\"14\" viewBox=\"0 0 24 24\"><path fill=\"${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
              )}\" d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\"/></svg>')`,
            },
      "&::after":
        hasLabel && labelOff
          ? {
              content: `"${labelOff}"`,
              position: "absolute",
              top: "50%",
              right: 12,
              transform: "translateY(-50%)",
              fontSize: 12,
              display: "flex",
              color: theme.palette.getContrastText(theme.palette.grey[400]),
            }
          : {},
    },
    "& .MuiSwitch-thumb": {
      position: "absolute",
      width: 21,
      height: 21,
      margin: 2,
      marginLeft: 3,
      marginTop: 2.2,
      backgroundColor: theme.palette.background.paper,
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "3px solid transparent",
        pointerEvents: "none",
      },
      "&::before": {
        borderColor: "#707271",
        zIndex: 2,
      },
      "&::after": {
        borderColor: "#707271",
        zIndex: 1,
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: customColor || "#8bbae8",
      "&::before": hasLabel && labelOn ? { display: "flex" } : {},
      "&::after": hasLabel && labelOff ? { display: "none" } : {},
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: `translateX(${
        hasLabel
          ? (Math.max(labelOff?.length || 0, labelOn?.length || 0) + 3.6) * 7 -
            1
          : 17
      }px) !important`,
      "& .MuiSwitch-thumb::before, & .MuiSwitch-thumb::after": {
        borderColor: customColor || "#8bbae8",
      },
    },
  };
});

export default Android12Switch;
