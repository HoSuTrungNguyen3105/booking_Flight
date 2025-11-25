import { Box, Button, FormControl, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../../common/Input/InputTextField";
import MfaSetup from "../MFA";
import SelectDropdown from "../../../common/Dropdown/SelectDropdown";
import RequestUnlock from "../RequestUnlock";
import TabPanel, {
  type ITabItem,
} from "../../../common/AdditionalCustomFC/TabPanel";
import theme from "../../../scss/theme";
import AccountYn from "../AccountSetting";
import Registration from "../Registration";
import { useToast } from "../../../context/ToastContext";
import { useCheckMfaAvailable } from "../../../context/Api/usePostApi";
import { useNavigate } from "react-router-dom";
import { ResponseCode } from "../../../utils/response";
import { getDeviceInfo } from "../../../hooks/format";

interface ILoginForm {
  email: string;
  password: string;
}

export type AuthType = "ID,PW" | "DEV" | "MFA" | "ADMIN" | "MONITER";
type ViewMode = "login" | "register" | "mfa" | "verify" | "changePw" | "unlock";

export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS: { label: string; value: AuthType }[] = [
    { label: "ID,PW", value: "ID,PW" },
    { label: "MFA", value: "MFA" },
    { label: "DEV", value: "DEV" },
    { label: "ADMIN", value: "ADMIN" },
    { label: "MONITER", value: "MONITER" },
  ];
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<AuthType>("ID,PW");
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [mfaEmailValue, setMfaEmailValue] = useState("");
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { refetchMfaCheck } = useCheckMfaAvailable();
  const { loginPassenger, loginAdmin } = useAuth();

  const { handleSubmit, watch, control, reset } = useForm<ILoginForm>({
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
    const deviceInfo = getDeviceInfo();

    const session = {
      ipAddress: (await deviceInfo).ipAddress,
      userAgent: (await deviceInfo).userAgent,
    };
    const email = watch("email")?.trim();
    try {
      // CASE 1: MFA
      if (authType === "MFA") {
        setMfaEmailValue(email);
        const res = await refetchMfaCheck({ email });

        if (res?.resultCode !== ResponseCode.SUCCESS) {
          toast(res?.resultMessage || "Error during MFA check!", "error");
        } else {
          setViewMode("mfa");
        }

        reset();
        return;
      }

      // CASE 2 & 3: ADMIN or ID,PW
      const isAdminTypes = ["ADMIN", "DEV", "MONITER"];
      const loginFn = isAdminTypes.includes(authType)
        ? loginAdmin
        : loginPassenger;

      const countryCode = localStorage.getItem("countryCode");

      const loginRes = await loginFn({
        email,
        password: data.password,
        authType,
        location: countryCode as string,
        ...session,
      });
      console.log("loginRes", loginRes);

      if (loginRes.requireUnlock) {
        setViewMode("unlock");
        setUserId(loginRes.userId);
      } else if (loginRes.requireVerified) {
        setViewMode("verify");
      } else if (loginRes.requireChangePassword && loginRes.userId) {
        setViewMode("changePw");
        setUserId(loginRes.userId);
      } else {
        reset({ password: "" });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
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
                      onError={(err) => console.error("err", err)}
                      placeholder="Password"
                      type="password"
                      showEyeIcon
                    />
                  )}
                />
              </FormControl>
            )}

            <Button
              variant="outlined"
              onClick={() => navigate("/init/change_password")}
            >
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
        return (
          <Registration authType={authType} onClose={() => setTabValue(0)} />
        );
    }
  };

  // if (loading) return <Loading />;

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
      return (
        <AccountYn
          authType={authType}
          mode="verify"
          onClose={() => setViewMode("login")}
        />
      );
    case "changePw":
      return <AccountYn mode="change" onClose={() => setViewMode("login")} />;
    // case "forgotPw":
    //   return <ForgetPassword onClose={() => setViewMode("forgotPw")} />;
    case "unlock":
      return (
        <RequestUnlock userId={userId} onClose={() => setViewMode("login")} />
      );
    default:
      break;
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
