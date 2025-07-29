import { Box } from "@mui/material";
import type { FC } from "react";

type ImageThumbnailProps = {
  url?: string;
};

export const ImageThumbnail: FC<ImageThumbnailProps> = ({ url }) => {
  return url ? (
    <Box
      width="100%"
      height="100%"
      sx={{
        background: `url(${url}) no-repeat center`,
        backgroundSize: "contain",
      }}
    >
      <Box className="layout-img" />
    </Box>
  ) : null;
};
