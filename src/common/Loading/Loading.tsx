// import { Backdrop, Box, CircularProgress } from "@mui/material";
// import { useApi } from "../../context/ApiContext";
// import { memo } from "react";
// interface ILoadingProps {
//   size?: keyof typeof sizeMap; // hoặc "small" | "medium" | "large";
// }

// const sizeMap: Record<"small" | "medium" | "large", number> = {
//   small: 24,
//   medium: 48,
//   large: 72,
// };

// export const Loading = memo(({ size = "large" }: ILoadingProps) => {
//   const { loading } = useApi();
//   console.log("Loading value:", loading);

//   return (
//     <Backdrop
//       open={loading}
//       onClick={(e) => e.stopPropagation()}
//       sx={(theme) => ({
//         zIndex: theme.zIndex.drawer + 1,
//         backgroundColor: "rgba(255, 255, 255, 0.4)",
//       })}
//     >
//       <CircularProgress
//         sx={{
//           width: sizeMap[size] ?? sizeMap.small,
//           height: sizeMap[size] ?? sizeMap.small,
//         }}
//         color="secondary"
//         disableShrink
//       />
//     </Backdrop>
//   );
// });
import { Backdrop, CircularProgress } from "@mui/material";
import { useApi } from "../../context/ApiContext";

export const Loading = () => {
  const { loading } = useApi();
  return (
    <Backdrop
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "#f7f9f8",
      })}
      open={loading}
      onClick={(e) => e.stopPropagation()}
    >
      <CircularProgress color="secondary" disableShrink />
    </Backdrop>
  );
};
