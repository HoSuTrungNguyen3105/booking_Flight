import { useCallback } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import theme from "../../../scss/theme";
import InputTextField from "../../../common/Input/InputTextField";
import { useApproveUnlock } from "../../../context/Api/usePostApi";
import { useGetMyRequestUnlock } from "../../../context/Api/useGetApi";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { ResponseCode } from "../../../utils/response";

const AccountSettings = () => {
  const { user } = useAuth();
  const { dataGetMyRequestUnlock } = useGetMyRequestUnlock(user?.id);
  const { refetchApproveUnlock } = useApproveUnlock();
  const toast = useToast();

  const handleApproveMyUnlock = useCallback(async () => {
    const res = await refetchApproveUnlock({
      id: dataGetMyRequestUnlock?.data?.id || 0,
    });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage || "");
    } else {
      toast(res?.resultMessage || "Error !!!", "error");
    }
  }, [refetchApproveUnlock]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: "8px 12px",
        border: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: "8px",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        My Request Unlock
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <InputTextField value={dataGetMyRequestUnlock?.data?.reason} />
        <InputTextField value={dataGetMyRequestUnlock?.data?.status} />
        <Button
          variant="contained"
          onClick={handleApproveMyUnlock}
          sx={{ minWidth: 120 }}
        >
          Unlock
        </Button>
      </Stack>
    </Box>
  );
};

export default AccountSettings;
