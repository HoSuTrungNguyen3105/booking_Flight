import React, { createContext, useContext, useState } from "react";
type ToastType = "success" | "error" | "info";
import { Box, SvgIcon, type SvgIconProps } from "@mui/material";
import { Info, PermDeviceInformation, Warning } from "@mui/icons-material";
// import '../scss/_toast.scss'

// const SuccessGreen = (props: SvgIconProps) => (
//   <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: "20px" }}>
//     <circle cx="12" cy="12" r="12" fill="#ffffff" />
//     <path
//       fill="#0071E3" // 🌊 xanh biển (MUI blue[600]) D9EAFB 0288d1
//       d="M10.8 17.1l-4.5-4.5 1.4-1.4 3.1 3.1 6.5-6.5 1.4 1.4-7.9 7.9z"
//     />
//   </SvgIcon>
// );
const Success = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: "20px" }}>
    <circle cx="12" cy="12" r="12" fill="#ffffff" />{" "}
    <path
      fill="#0071E3"
      d="M10.8 17.1l-4.5-4.5 1.4-1.4 3.1 3.1 6.5-6.5 1.4 1.4-7.9 7.9z"
    />
  </SvgIcon>
);
type Toast = {
  id: number;
  message: string;
  type: ToastType;
};
const ToastContext = createContext<(msg: string, type?: ToastType) => void>(
  () => {}
);
export const useToast = () => useContext(ToastContext);
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          padding: "12px",
          gap: "8px",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <Box
            sx={{
              maxWidth: 500,
              minWidth: 280,
              padding: "8px 12px",
              borderRadius: "20px",
              border: "1px solid white",
              backgroundColor: toast.type === "success" ? "#1e293b" : "#7f1d1d",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pointerEvents: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {toast.type === "success" && <Success />}
              {toast.type === "error" && (
                <span style={{ fontSize: 20 }}>
                  <Warning />
                </span>
              )}
              {toast.type === "info" && (
                <span style={{ fontSize: 20 }}>
                  <Info />
                </span>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignContent: "center",
                  fontSize: 16,
                  maxWidth: 300,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  lineHeight: 1.5,
                }}
              >
                {toast.message}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};
