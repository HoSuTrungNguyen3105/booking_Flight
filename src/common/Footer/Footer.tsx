import { forwardRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Footer = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>(
  (props, ref) => {
    const dataFooter = useMemo(
      () => [
        {
          title: "Footer",
          child: "This is the footer section of the application.",
        },
        {
          title: "Contact Us",
          child: "For inquiries, please contact us at info@myflight.com",
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
    //   import { forwardRef } from "react";

    // export const Footer = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>((props, ref) => {
    //   return (
    //     <footer ref={ref} {...props}>
    //       {/* Footer content */}
    //     </footer>
    //   );
    // });
    return (
      <footer ref={ref} {...props}>
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
      </footer>
    );
  }
);
