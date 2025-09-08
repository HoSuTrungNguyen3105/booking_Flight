import React, { createContext, useContext, useRef, useState } from "react";
import { Box, SvgIcon, type SvgIconProps } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

const Success = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: "20px" }}>
    <circle cx="12" cy="12" r="12" fill="#ffffff" />{" "}
    <path
      fill="#0071E3"
      d="M10.8 17.1l-4.5-4.5 1.4-1.4 3.1 3.1 6.5-6.5 1.4 1.4-7.9 7.9z"
    />
  </SvgIcon>
);
const Warning = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: "20px" }}>
    <circle cx="12" cy="12" r="12" fill="#ffffff" />
    <path
      fill="#E53935"
      d="M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm0 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
    />
  </SvgIcon>
);
const Info = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: "20px" }}>
    <circle cx="12" cy="12" r="12" fill="#ffffff" />
    <path fill="#0288D1" d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2z" />
  </SvgIcon>
);
const ToastContext = createContext<(msg: string, type?: ToastType) => void>(
  () => {}
);
export const useToast = () => useContext(ToastContext);
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutMap = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutMap.current.delete(id);
    }, 2500);

    timeoutMap.current.set(id, timeoutId);
  };
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Box
        sx={{
          position: "fixed",
          top: "55px",
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
          zIndex: 1200,
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Box
                  key={toast.id}
                  sx={{
                    zIndex: 1300,
                    maxWidth: 500,
                    width: "fit-content", // tự co theo nội dung
                    padding: "8px 12px",
                    borderRadius: "20px",
                    border: "1px solid white",
                    backgroundColor:
                      toast.type === "success"
                        ? "#15803d"
                        : toast.type === "error"
                        ? "#b91c1c"
                        : "#0c4a6e",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pointerEvents: "auto",
                    mx: "auto", // căn giữa ngang toàn màn hình nếu cần
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {toast.type === "success" && <Success />}
                    {toast.type === "error" && <Warning />}
                    {toast.type === "info" && <Info />}
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {toast.message}
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
    </ToastContext.Provider>
  );
};
