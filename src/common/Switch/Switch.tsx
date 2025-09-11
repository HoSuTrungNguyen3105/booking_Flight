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
    width: 65,
    height: 44,
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "lightgrey !important",
      opacity: 1,
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#ffffff !important",
    },
    // "& .MuiSwitch-track": {
    //   borderRadius: 22,
    //   backgroundColor: "#ccc",
    // },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 21,
      height: 21,
      margin: 2,
      marginLeft: 3,
      marginTop: 2.2,
      backgroundColor: "#fff",
    },
  };
});

export default Android12Switch;
