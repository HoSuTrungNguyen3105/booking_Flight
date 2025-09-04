import { useState } from "react";
import OTPInput from "../../User/OTPInput";
import { Box, Button, Typography } from "@mui/material";

const VerifyOpt = () => {
  const [otpText, setOtpText] = useState<string>("");
  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={(theme) => ({
          width: "456px",
          mx: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
        })}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Typography variant="h4" component="h4" align="center">
            Service
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <OTPInput value={otpText} />
        </Box>
        <Box>
          <Button>Confirm</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOpt;
