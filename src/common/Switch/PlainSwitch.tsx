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

// import { styled, Switch, type SwitchProps } from "@mui/material";

// type ImageSwitchProps = {
//   img1?: string;
//   img2?: string;
// } & SwitchProps;

// export const PlainSwitch = styled(Switch, {
//   shouldForwardProp: (prop) => prop !== "img1" && prop !== "img2",
// })<ImageSwitchProps>(({ img1, img2 }) => ({
//   padding: 8,
//   width: 70,
//   height: 44,

//   "& .MuiSwitch-track": {
//     borderRadius: 22,
//     backgroundColor: "#ccc",
//     position: "relative",
//     "&::before, &::after": {
//       content: '""',
//       position: "absolute",
//       top: "50%",
//       transform: "translateY(-50%)",
//       width: 24,
//       height: 24,
//       backgroundSize: "cover",
//       backgroundRepeat: "no-repeat",
//     },
//     "&::before": {
//       left: 8,
//       backgroundImage: img1 ? `url(${img1})` : "none",
//     },
//     "&::after": {
//       right: 8,
//       backgroundImage: img2 ? `url(${img2})` : "none",
//     },
//   },

//   "& .Mui-checked + .MuiSwitch-track::before": {
//     opacity: 0,
//   },
//   "& .Mui-checked + .MuiSwitch-track::after": {
//     opacity: 1,
//   },
//   "& .MuiSwitch-track::before": {
//     opacity: 1,
//   },
//   "& .MuiSwitch-track::after": {
//     opacity: 0,
//   },

//   "& .Mui-checked .MuiSwitch-thumb": {
//     backgroundColor: "#fff",
//   },
//   "& .MuiSwitch-thumb": {
//     boxShadow: "none",
//     width: 22,
//     height: 22,
//     margin: 2,
//     marginLeft: 3,
//     marginTop: 2.2,
//     backgroundColor: "#fff",
//   },
// }));
