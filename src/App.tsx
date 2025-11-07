import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { AuthProvider } from "./context/AuthContext";
import { I18nextProvider } from "react-i18next";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
// import theme from "./scss/theme";
import i18n from "./i18n";
import theme from "./scss/theme";

function App() {
  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <ApiProvider>
            <AuthProvider>
              <CssBaseline />
              <GlobalStyles
                styles={{
                  "::selection": {
                    backgroundColor: "gray",
                    color: "white",
                  },
                }}
              />
              {/* <Button
                onClick={toggleTheme}
                sx={{
                  position: "fixed",
                  top: 12,
                  right: 12,
                  zIndex: 2000,
                  borderRadius: 5,
                  padding: "6px 12px",
                }}
                variant="contained"
                color="primary"
                startIcon={mode === "light" ? <Brightness4 /> : <Brightness7 />}
              >
                {mode === "light" ? "Dark Mode" : "Light Mode"}
              </Button> */}
              <RouterProvider router={router} />
            </AuthProvider>
          </ApiProvider>
        </I18nextProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
