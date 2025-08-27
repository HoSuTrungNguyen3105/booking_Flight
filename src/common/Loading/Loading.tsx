import { Backdrop, CircularProgress } from "@mui/material";
import { useApi } from "../../context/ApiContext";

export const Loading = () => {
  const { loading } = useApi();
  return (
    <Backdrop
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        // backgroundColor: "#f7f9f8",
        color: "#fff",
      })}
      open={loading}
      onClick={(e) => e.stopPropagation()}
    >
      <CircularProgress color="secondary" disableShrink />
    </Backdrop>
  );
};
