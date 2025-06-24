import { styled, Switch, Typography, Box } from "@mui/material";
// import { styled, Switch, type Theme } from "@mui/material";
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
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <CustomSwitch
        className="custom-switch"
        customColor={color}
        hasLabel={hasLabel}
        onChange={onChange}
        labelOn={labelOn}
        checked={checked}
        labelOff={labelOff}
        {...combinedSwitchProps}
      />
      {label && (
        <Typography variant="caption" sx={{ marginLeft: 1 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

const CustomSwitch = styled(Switch, {
  shouldForwardProp: (prop) =>
    ![
      "customColor",
      "hasLabel",
      "labelOn",
      "labelOff",
      "onChange",
      "checked",
    ].includes(prop as string),
})<{
  customColor?: string;
  hasLabel?: boolean;
  labelOn?: string;
  labelOff?: string;
  checked?: boolean;
}>(({ theme, customColor, hasLabel, labelOn, labelOff }) => ({
  padding: 8,
  width: hasLabel
    ? `${Math.max(labelOff?.length || 0, labelOn?.length || 0) + 6}ch`
    : "50px",

  "& .MuiButtonBase-root.MuiSwitch-switchBase": {
    margin: "4px",
    top: 5,
    left: 2,
  },

  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    height: hasLabel ? 24 : 16,
    width: hasLabel
      ? `${Math.max(labelOff?.length || 0, labelOn?.length || 0) + 6}ch`
      : "33px",
    backgroundColor: theme.palette.grey[400],
    transition: "background-color 0.3s ease",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "42%",
      transform: "translateY(-50%)",
      width: hasLabel ? 24 : 16,
      height: hasLabel ? 24 : 16,
    },
    "&::before": {
      ...(hasLabel && labelOn
        ? {
            width: `${labelOn?.length + 3.6}ch`,
            backgroundImage: "none",
            content: `"${labelOn}"`,
            right: "auto",
            marginTop: 4,
            left: 10,
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: theme.palette.getContrastText(customColor || "#8bbae8"),
          }
        : {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
              theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 8.5,
          }),
    },
    "&::after": {
      ...(hasLabel && labelOff
        ? {
            width: `${labelOff?.length + 3.6}ch`,
            content: `"${labelOff}"`,
            // left: 20,
            // top: 3,
            left: "auto",
            marginTop: 4,
            right: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: theme.palette.getContrastText(theme.palette.grey[400]),
          }
        : {}),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: customColor || "#8bbae8",
    opacity: 1,
    "&::before":
      hasLabel && labelOn
        ? {
            display: "flex",
          }
        : {},
    "&::after":
      hasLabel && labelOff
        ? {
            display: "none",
          }
        : {},
  },
  "& .MuiSwitch-thumb": {
    position: "absolute",
    // top: hasLabel ? 10 : 6,
    left: 3,
    width: hasLabel ? 20 : 16,
    height: hasLabel ? 20 : 16,
    marginTop: hasLabel ? 8 : 0,
    boxShadow: "none",
    pointerEvents: "auto",
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
  "& .MuiSwitch-switchBase.Mui-checked": {
    transform: `translateX(${
      hasLabel
        ? (Math.max(labelOff?.length || 0, labelOn?.length || 0) + 3.6) * 7 - 1
        : 17
    }px) !important`,
    "& .MuiSwitch-thumb": {
      "&::before": {
        borderColor: customColor || "#8bbae8",
      },
      "&::after": {
        borderColor: customColor || "#8bbae8",
      },
    },
  },
}));
export const AndroidSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  width: 65,
  height: 44,
  "& .Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgrey !important",
    opacity: 1.8,
  },
  "& .Mui-checked .MuiSwitch-thumb": {
    backgroundColor: "#ffffff !important",
  },
  "& .MuiSwitch-track": {
    borderRadius: 22 / 1,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 18,
      height: 18,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18.5" width="18.5" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#000"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      left: 12,
      top: 22,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18.5" width="18.5" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      right: 14,
      top: 21,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 21,
    height: 21,
    margin: 2,
    marginLeft: 3,
    marginTop: 2.2,
  },
}));
export default Android12Switch;
