import {
  Box,
  Typography,
  FormControl,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { memo, useCallback, useState } from "react";
import { KeyOutlined, LockOpenOutlined } from "@mui/icons-material";
import { useChangePasswordInProfile } from "../../context/Api/usePostApi";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";
import theme from "../../scss/theme";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { ResponseCode } from "../../utils/response";

interface FormDataType {
  userId?: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordInProfile = () => {
  const { refetchChangePassword, errorChangePassword } =
    useChangePasswordInProfile();
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const userId = user?.id;

  const [value, setValue] = useState<FormDataType>({
    userId,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = useCallback(
    (field: keyof FormDataType, newValue: string) => {
      setValue((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    },
    []
  );

  const onSubmit = useCallback(async () => {
    if (!userId) {
      console.error("UserId không hợp lệ");
      return;
    }

    try {
      const response = await refetchChangePassword({ ...value, userId });
      if (response?.resultCode === ResponseCode.SUCCESS) {
        toast(response?.resultMessage || "Đổi mật khẩu thanh cong");
      } else {
        toast(response?.resultMessage || "Đổi mật khẩu thất bại", "error");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }, [value, userId, refetchChangePassword]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: "8px 12px",
          border: `1px solid ${theme.palette.grey[200]}`,
          marginBottom: 1,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Change Password
        </Typography>

        <Grid container spacing={1}>
          <Grid size={6}>
            <Typography sx={{ mb: 1 }}>{t("currentPassword")}</Typography>
            <FormControl fullWidth>
              <InputTextField
                type="password"
                showEyeIcon
                value={value.currentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                onChange={(e) => handleChange("currentPassword", e)}
              />
            </FormControl>
          </Grid>

          {/* New Password */}
          <Grid size={6}>
            <Typography sx={{ mb: 1 }}>{t("newPassword")}</Typography>
            <FormControl fullWidth>
              <InputTextField
                type="password"
                showEyeIcon
                value={value.newPassword}
                error={!!errorChangePassword}
                placeholder="Nhập mật khẩu mới"
                onChange={(e) => handleChange("newPassword", e)}
              />
            </FormControl>
          </Grid>

          <Grid size={6}>
            <Typography sx={{ mb: 1 }}>{t("confirmPassword")}</Typography>
            <FormControl fullWidth>
              <InputTextField
                type="password"
                showEyeIcon
                value={value.confirmPassword}
                error={!!errorChangePassword}
                placeholder="Nhập lại mật khẩu mới"
                onChange={(e) => handleChange("confirmPassword", e)}
              />
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button variant="contained" sx={{ mt: 2 }} onClick={onSubmit}>
              {t("submit")}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          p: 2,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <KeyOutlined color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            MFA LOGIN SETUP
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            // p: 1.5,
            borderRadius: 2,
            backgroundColor:
              user?.mfaEnabledYn === "N"
                ? theme.palette.grey[50]
                : theme.palette.success.light + "22",
            transition: "background-color 0.3s ease",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              color: "#fff",
              bgcolor:
                user?.mfaEnabledYn === "N"
                  ? theme.palette.grey[500]
                  : theme.palette.success.main,
            }}
          >
            <LockOpenOutlined sx={{ fontSize: "1.75rem" }} />
          </Avatar>

          {user?.mfaEnabledYn === "N" ? (
            <>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t("title_mfa")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                maxWidth={400}
                mx="auto"
              >
                {t("not_auth_mfa")}
              </Typography>
            </>
          ) : (
            <Typography variant="subtitle1" fontWeight={600}>
              {t("has_auth_mfa")}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            mt: 1.5,
            pt: 2,
            display: "flex",
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
          <Button variant="contained" type="submit">
            {t("submit")}
          </Button>
          <Button type="reset" variant="outlined">
            {t("reset")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default memo(ChangePasswordInProfile);
