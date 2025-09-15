import { Box, type SxProps } from "@mui/material";
import type { FC } from "react";

type ImageThumbnailProps = {
  url?: string;
  sx?: SxProps;
};

export const ImageThumbnail: FC<ImageThumbnailProps> = ({ url, sx }) => {
  return url ? (
    <Box
      component="img"
      src={url}
      width={32}
      height={32}
      sx={{
        borderRadius: "50%",
        border: "1px solid #ccc",
        flexShrink: 0,
        objectFit: "cover",
        ...sx,
      }}
    />
  ) : null;
};
