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
      <ApiProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <CssBaseline />
              <GlobalStyles
                styles={{
                  "::selection": {
                    backgroundColor: "gray",
                    color: "white",
                  },
                }}
              />
              <RouterProvider router={router} />
            </I18nextProvider>
          </ThemeProvider>
        </AuthProvider>
      </ApiProvider>
    </ToastProvider>
  );
}

export default App;
