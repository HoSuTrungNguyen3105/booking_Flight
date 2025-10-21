import { styled, Switch, Typography, Box } from "@mui/material";
import type { Android12SwitchProps } from "./type";
import { memo } from "react";

const Android12Switch = ({
  color = "#1976d2",
  label,
  switchProps,
  hasLabel = false,
  onChange,
  labelOn = "On",
  labelOff = "Off",
  checked = false,
  disabled = false,
}: Android12SwitchProps) => {
  const inputProps = {
    "data-testid": "switch-input",
    ...((switchProps?.inputProps as React.InputHTMLAttributes<HTMLInputElement>) ||
      {}),
  };

  const combinedSwitchProps = {
    disabled,
    inputProps,
    onChange,
    checked,
    ...switchProps,
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <CustomSwitch
        customColor={color}
        hasLabel={hasLabel}
        labelOn={labelOn}
        labelOff={labelOff}
        {...combinedSwitchProps}
      />
      {label && <Typography variant="caption">{label}</Typography>}
    </Box>
  );
};

const CustomSwitch = styled(Switch, {
  shouldForwardProp: (prop) =>
    !["customColor", "hasLabel", "labelOn", "labelOff"].includes(
      prop as string
    ),
})<{
  customColor?: string;
  hasLabel?: boolean;
  labelOn?: string;
  labelOff?: string;
}>(({ customColor, hasLabel, labelOn, labelOff }) => {
  const labelWidth = `${
    Math.max(labelOff?.length || 0, labelOn?.length || 0) + 6
  }ch`;

  return {
    padding: 8,
    width: hasLabel ? `calc(65px + ${labelWidth})` : 65,
    height: 44,
    "& .MuiSwitch-track": {
      borderRadius: 22,
      backgroundColor: "#ccc",
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: customColor ?? "#1976d2",
      opacity: 1,
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#fff",
    },
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

export default memo(Android12Switch);
