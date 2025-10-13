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
  const toast = useToast();
  const tabs: ITabItem[] = [
    {
      label: "Login",
      value: "login",
      description: "Login .",
    },
    {
      label: "Register",
      value: "register",
      description:
        "Please enter the information required to change your password.",
    },
  ];

  const [changePassword, setChangePassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [unlockAccount, setUnlockAccount] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState(false);
  const { refetchMfaCheck } = useCheckMfaAvailable();
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
      const res = await refetchMfaCheck({ email });

      console.log("res", res);
      if (res?.resultCode !== "00") {
        setLoading(false);
        toast(res?.resultMessage || "Error");
        return;
      }
      setMfaEmail(true);
      return;
    }

    const loginRes = await login({
      email,
      password: data.password,
    });

    if (loginRes.requireUnlock) {
      setUnlockAccount(true);
      setUserId(loginRes.userId);
      //setTabValue(2);
      return;
    }

    if (loginRes.requireVerified) {
      // setTabValue(3);
      setVerifiedAccount(true);
      return;
    }

    if (loginRes.requireChangePassword && loginRes.userId) {
      setChangePassword(true);
      setUserId(loginRes.userId);
      // setTabValue(1);
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
                Authentication Method
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

            {formData.authType !== "MFA" && (
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

            <Button variant="text">
              <Typography
                variant="body2"
                color="primary"
                onClick={() => setForgotPassword(true)}
              >
                Forget password ?
              </Typography>
            </Button>

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
        return <Registration email="" onClose={() => setTabValue(0)} />;
    }
  };

  if (mfaEmail) {
    return (
      <MfaSetup onClose={() => setMfaEmail(false)} email={mfaEmailValue} />
    );
  }

  if (verifiedAccount) {
    return <AccountYn mode="verify" onClose={() => setTabValue(0)} />;
  }

  if (changePassword) {
    return <AccountYn mode="change" onClose={() => setChangePassword(false)} />;
  }

  if (forgotPassword) {
    return <ForgetPassword />;
  }

  if (unlockAccount) {
    return (
      <RequestUnlock userId={userId} onClose={() => setUnlockAccount(false)} />
    );
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
