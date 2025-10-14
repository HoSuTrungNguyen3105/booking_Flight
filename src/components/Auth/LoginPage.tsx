import { Box, Button, FormControl, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../common/Input/InputTextField";
import MfaSetup from "./MFA";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import RequestUnlock from "./RequestUnlock";
import TabPanel, { type ITabItem } from "../../common/CustomRender/TabPanel";
import theme from "../../scss/theme";
import { Loading } from "../../common/Loading/Loading";
import AccountYn from "./AccountYn";
import Registration from "./Registration";
import ForgetPassword from "./ForgetPassword";
import { useToast } from "../../context/ToastContext";
import { useCheckMfaAvailable } from "../Api/usePostApi";

interface ILoginForm {
  email: string;
  password: string;
}

type AuthType = "ID,PW" | "DEV" | "MFA";
type ViewMode =
  | "login"
  | "register"
  | "mfa"
  | "verify"
  | "changePw"
  | "forgotPw"
  | "unlock";

export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS: { label: string; value: AuthType }[] = [
    { label: "ID,PW", value: "ID,PW" },
    { label: "MFA", value: "MFA" },
    { label: "DEV", value: "DEV" },
  ];

  const [authType, setAuthType] = useState<AuthType>("ID,PW");
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [mfaEmailValue, setMfaEmailValue] = useState("");
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { refetchMfaCheck } = useCheckMfaAvailable();
  const { login } = useAuth();

  const { handleSubmit, watch, control } = useForm<ILoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const tabs: ITabItem[] = [
    { label: "Login", value: "login", description: "Login ." },
    {
      label: "Register",
      value: "register",
      description:
        "Please enter the information required to change your password.",
    },
  ];

  const onSubmit = async (data: ILoginForm) => {
    setLoading(true);
    const email = watch("email");

    try {
      if (authType === "MFA") {
        setMfaEmailValue(email);
        const res = await refetchMfaCheck({ email });

        if (res?.resultCode !== "00") {
          toast(res?.resultMessage || "Error");
          return;
        }

        setViewMode("mfa");
        return;
      }

      const loginRes = await login({
        email,
        password: data.password,
        authType,
      });

      if (loginRes.requireUnlock) {
        setViewMode("unlock");
        setUserId(loginRes.userId);
        return;
      }

      if (loginRes.requireVerified) {
        setViewMode("verify");
        return;
      }

      if (loginRes.requireChangePassword && loginRes.userId) {
        setViewMode("changePw");
        setUserId(loginRes.userId);
        return;
      }
    } catch (error) {
      toast("Unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Stack direction="column" spacing={3} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                Authentication Method
              </Typography>
              <SelectDropdown
                value={authType}
                onChange={(val) => setAuthType(val as AuthType)}
                options={AUTH_TYPE_OPTIONS}
              />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                Email
              </Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputTextField {...field} placeholder="Email." />
                )}
              />
            </FormControl>

            {authType !== "MFA" && (
              <FormControl fullWidth>
                <Typography variant="body1" mb={0.5}>
                  Password
                </Typography>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <InputTextField
                      {...field}
                      placeholder="Password "
                      type="password"
                    />
                  )}
                />
              </FormControl>
            )}

            <Button variant="outlined" onClick={() => setViewMode("forgotPw")}>
              Forget password ?
            </Button>

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {loading
                  ? "Loading..."
                  : authType === "MFA"
                  ? "Send Verification Code"
                  : "Submit"}
              </Button>
            </Box>
          </Stack>
        );

      case 1:
        return <Registration email="" onClose={() => setTabValue(0)} />;
    }
  };

  if (loading) return <Loading />;

  switch (viewMode) {
    case "mfa":
      return (
        <MfaSetup
          authType={authType}
          onClose={() => setViewMode("login")}
          email={mfaEmailValue}
        />
      );
    case "verify":
      return <AccountYn mode="verify" onClose={() => setViewMode("login")} />;
    case "changePw":
      return <AccountYn mode="change" onClose={() => setViewMode("login")} />;
    case "forgotPw":
      return <ForgetPassword onClose={() => setViewMode("forgotPw")} />;
    case "unlock":
      return (
        <RequestUnlock userId={userId} onClose={() => setViewMode("login")} />
      );
    default:
      break;
  }

  // 🚀 Default: Login/Register
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
          width: "30rem",
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
