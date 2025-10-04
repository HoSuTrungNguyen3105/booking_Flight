import { Backdrop, Box, Stack } from "@mui/material";
import { useApi } from "../../context/ApiContext";
import LoadingFlight from "../../svgs/Clone.gif";

export const Loading = () => {
  const { loading } = useApi();
  return (
    <Backdrop
      sx={(theme) => ({
        zIndex: theme.zIndex.modal + 1,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(1px)",
      })}
      open={loading}
      onClick={(e) => e.stopPropagation()}
    >
      <Stack alignItems="center" gap={3}>
        <Box
          component="img"
          src={LoadingFlight}
          alt="Loading..."
          sx={{
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            borderRadius: 1,
            display: { xs: "block", md: "block" },
          }}
        />
      </Stack>
    </Backdrop>
  );
};
