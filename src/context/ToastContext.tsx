import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  Activity,
} from "react";
import { Box, Typography } from "@mui/material";
import Animate from "react-smooth";
import { CheckCircle, ErrorOutline, InfoOutlined } from "@mui/icons-material";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<
  ((message: string, type?: ToastType) => void) | null
>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          zIndex: 1500,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <Animate
            key={toast.id}
            from={{ opacity: 0, transform: "translateY(-20px) scale(0.95)" }}
            to={{ opacity: 1, transform: "translateY(0) scale(1)" }}
            duration={200}
          >
            <Box
              sx={{
                minWidth: 250,
                maxWidth: 500,
                backgroundColor:
                  toast.type === "success"
                    ? "#065f46"
                    : toast.type === "error"
                    ? "#7f1d1d"
                    : "#0f172a",
                color: "#fff",
                borderRadius: 2,
                padding: "10px 8px", // "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                pointerEvents: "auto",
              }}
            >
              <Activity mode={toast.type === "success" ? "visible" : "hidden"}>
                <CheckCircle />
              </Activity>
              <Activity mode={toast.type === "info" ? "visible" : "hidden"}>
                <InfoOutlined />
              </Activity>
              <Activity mode={toast.type === "error" ? "visible" : "hidden"}>
                <ErrorOutline />
              </Activity>
              <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
                {toast.message}
              </Typography>
            </Box>
          </Animate>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};
