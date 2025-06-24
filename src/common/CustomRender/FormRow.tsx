import React from "react";
import { Box, Typography } from "@mui/material";

interface FormRowProps {
  label: string;
  children: React.ReactElement;
  direction?: "row" | "column";
  mt?: number; // mặc định là 2 nếu không truyền vào
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  children,
  direction = "row",
  mt = 2,
}) => {
  return (
    <Box mt={mt}>
      <Box
        sx={{
          display: "flex",
          flexDirection: direction,
          alignItems: direction === "row" ? "center" : "flex-start",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            minWidth: direction === "row" ? 80 : "auto",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        <Box flex={1}>{children}</Box>
      </Box>
    </Box>
  );
};

export default FormRow;
