import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const rotate = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Dot = styled("span")({
  width: 10,
  height: 10,
  backgroundColor: "#1976d2",
  borderRadius: "50%",
  position: "absolute",
});

const SpinnerOrbit = styled(Box)(() => ({
  width: 60,
  height: 60,
  position: "relative",
  animation: `${rotate} 1s linear infinite`,
}));

export const LoadingOrbit = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <SpinnerOrbit>
      <Dot sx={{ top: 0, left: "50%", transform: "translateX(-50%)" }} />
      <Dot sx={{ right: 0, top: "50%", transform: "translateY(-50%)" }} />
      <Dot sx={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }} />
      <Dot sx={{ left: 0, top: "50%", transform: "translateY(-50%)" }} />
      <Dot sx={{ top: 5, left: 5 }} />
      <Dot sx={{ top: 5, right: 5 }} />
      <Dot sx={{ bottom: 5, right: 5 }} />
      <Dot sx={{ bottom: 5, left: 5 }} />
    </SpinnerOrbit>
  </Box>
);
