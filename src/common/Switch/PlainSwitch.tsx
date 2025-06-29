import { styled, Switch } from "@mui/material";

export const PlainSwitch = styled(Switch)(() => ({
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
  "& .MuiSwitch-track": {
    borderRadius: 22,
    backgroundColor: "#ccc",
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
}));
