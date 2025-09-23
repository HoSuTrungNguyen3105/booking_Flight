import { Box, Button, FormControl, Stack, Typography } from "@mui/material";
import { useState } from "react";
import InputField from "../../common/Input/InputField";
import { useAuth } from "../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../common/Input/InputTextField";
import MfaSetup from "./MFA";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import RequestUnlock from "./RequestUnlock";
import FindAccount from "./components/FindAccount";
import TabPanel, { type ITabItem } from "../../common/Setting/TabPanel";
import theme from "../../scss/theme";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../common/Loading/Loading";

interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

type AuthType = "ID,PW" | "DEV" | "MFA";

export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS: { label: string; value: AuthType }[] = [
    { label: "ID,PW", value: "ID,PW" },
    { label: "MFA", value: "MFA" },
    { label: "DEV", value: "DEV" },
  ];

  const [formData, setFormData] = useState({
    authType: AUTH_TYPE_OPTIONS[0].value,
    email: "",
    password: "",
  });

  const [tabValue, setTabValue] = useState(0);
  const [mfaEmail, setMfaEmail] = useState(false);
  const [mfaEmailValue, setMfaEmailValue] = useState("");

  const tabs: ITabItem[] = [
    {
      label: "Login",
      value: "login",
      description: "로그인을 위해 아이디와 비밀번호를 입력해주세요.",
    },
    {
      label: "Change Password",
      value: "change-password",
      description: "비밀번호 변경을 위해 필요한 정보를 입력해주세요.",
    },
    {
      label: "Unlock Account",
      value: "unlock-account",
      description: "계정 잠금 해제를 요청합니다.",
    },
  ];

  const [changePassword, setChangePassword] = useState(false);
  const [unlockAccount, setUnlockAccount] = useState(false);
  const [registerUser, setRegisterUser] = useState(false);
  const { login } = useAuth();
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, watch, control } = useForm<ILoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: ILoginForm) => {
    const email = watch("email");
    setLoading(true);

    if (formData.authType === "MFA") {
      setMfaEmailValue(email);
      setLoading(false);
      setMfaEmail(true);
      return;
    }

    const loginRes = await login({
      email,
      password: data.password,
      remember: data.remember,
    });

    if (loginRes.requireUnlock) {
      setUnlockAccount(true);
      setUserId(loginRes.userId);
      setTabValue(2);
      return;
    }

    if (loginRes.requireChangePassword && loginRes.userId) {
      setChangePassword(true);
      setUserId(loginRes.userId);
      setTabValue(1);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleChangeFormInput = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Stack direction="column" spacing={3} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                인증 방법
              </Typography>
              <SelectDropdown
                value={formData.authType}
                onChange={(val) =>
                  handleChangeFormInput("authType", val as AuthType)
                }
                options={AUTH_TYPE_OPTIONS}
              />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                아이디
              </Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputField {...field} placeholder="아이디를 입력하세요." />
                )}
              />
            </FormControl>

            {formData.authType !== "MFA" && (
              <FormControl fullWidth>
                <Typography variant="body1" mb={0.5}>
                  비밀번호
                </Typography>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <InputTextField
                      {...field}
                      placeholder="비밀번호를 입력하세요."
                      type="password"
                    />
                  )}
                />
              </FormControl>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {loading
                  ? "Loading..."
                  : formData.authType === "MFA"
                  ? "Send Verification Code"
                  : "Submit"}
              </Button>
            </Box>
          </Stack>
        );

      case 1:
        return <FindAccount onClose={() => setTabValue(0)} />;

      case 2:
        return <RequestUnlock userId={userId} onClose={() => setTabValue(0)} />;

      default:
        return null;
    }
  };

  if (mfaEmail) {
    return <MfaSetup email={mfaEmailValue} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        sx={{
          width: "456px",
          mx: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Typography variant="h4" component="h4" align="center">
            Service
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "common.white", px: 4.5, py: 4 }}>
          <TabPanel
            activeTab={tabValue}
            tabs={tabs}
            onChangeTab={setTabValue}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />

          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
};
