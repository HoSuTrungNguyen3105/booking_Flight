import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { AuthProvider } from "./context/AuthContext";
import { I18nextProvider } from "react-i18next";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./scss/theme";
import i18n from "./i18n";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <ApiProvider>
            <AuthProvider>
              <ChatProvider>
                <CssBaseline />
                <RouterProvider router={router} />
              </ChatProvider>
            </AuthProvider>
          </ApiProvider>
        </I18nextProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
