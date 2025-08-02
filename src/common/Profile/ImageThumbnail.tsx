import { Box } from "@mui/material";
import type { FC } from "react";

type ImageThumbnailProps = {
  url?: string;
};

export const ImageThumbnail: FC<ImageThumbnailProps> = ({ url }) => {
  return url ? (
    <Box
      width={32}
      height={32}
      sx={{
        background: `url(${url}) no-repeat center`,
        backgroundSize: "cover",
        borderRadius: "50%", // Nếu muốn ảnh tròn
        border: "1px solid #ccc",
        flexShrink: 0,
      }}
    />
  ) : null;
};
