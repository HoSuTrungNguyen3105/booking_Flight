import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";

export const Footer = () => {
  const dataFooter = useMemo(
    () => [
      {
        title: "Contact Us",
        child: "For inquiries",
      },
    ],
    []
  );
  const renderFooterCard = useMemo(() => {
    return dataFooter.map((item, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {item.title}
        </Typography>
        <Typography variant="body2">{item.child}</Typography>
      </Box>
    ));
  }, [dataFooter]);

  return (
    <Stack component={"footer"}>
      <Box
        sx={{
          backgroundColor: "#f8f9fa",
          padding: 2,
          textAlign: "center",
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        {renderFooterCard}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Privacy Policy
        </Typography>
      </Box>
    </Stack>
  );
};
