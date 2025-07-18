import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useApi } from "../../context/ApiContext";
import { memo } from "react";
interface ILoadingProps {
  size?: keyof typeof sizeMap; // hoặc "small" | "medium" | "large";
}

const sizeMap: Record<"small" | "medium" | "large", number> = {
  small: 24,
  medium: 48,
  large: 72,
};

export const Loading = memo(({ size = "large" }: ILoadingProps) => {
  const { loading } = useApi();

  return (
    <Backdrop
      open={loading}
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <CircularProgress
        size={sizeMap[size]} // ✅ đúng cách
        color="secondary"
        disableShrink
      />
    </Backdrop>
  );
});
