import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type TUseSocket<T> = {
  event: string;
  defaultValue?: T;
  autoListen?: boolean;
  onSuccess?: (res: T) => void;
  onError?: (error: any) => void;
  requireAuth?: boolean;
  userId?: number | string;
};

const baseURL = import.meta.env.VITE_REACT_APP_URL || "http://localhost:3000";

export const useSocket = <T>({
  event,
  defaultValue,
  autoListen = true,
  requireAuth = true,
  userId,
  onSuccess,
  onError,
}: TUseSocket<T>) => {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isMounted = useRef(true);

  // Kết nối socket
  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      setIsConnected(true);
      return socketRef.current;
    }

    // Tạo options kết nối
    const options = requireAuth
      ? {
          auth: {
            token: localStorage.getItem("token"),
          },
          transports: ["websocket"],
          query: userId ? { userId: userId.toString() } : {},
        }
      : {
          transports: ["websocket"],
          query: userId ? { userId: userId.toString() } : {},
        };

    // Kết nối tới server
    socketRef.current = io(baseURL, options);

    // Xử lý sự kiện kết nối
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);

      // Đăng ký user với server nếu có userId
      if (userId) {
        socketRef.current?.emit("register_user", userId);
      }
    });

    // Xử lý sự kiện ngắt kết nối
    socketRef.current.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
    });

    // Xử lý lỗi kết nối
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
      if (isMounted.current) {
        setError(err);
        setIsConnected(false);
        onError?.(err);
      }
    });

    return socketRef.current;
  }, [requireAuth, userId, onError]);

  // Lắng nghe sự kiện
  const listen = useCallback(() => {
    if (!socketRef.current) return;

    const handleEvent = (response: T) => {
      if (isMounted.current) {
        setData(response);
        setSuccess(true);
        setLoading(false);
        onSuccess?.(response);
      }
    };

    const handleError = (error: any) => {
      if (isMounted.current) {
        setError(error);
        setLoading(false);
        onError?.(error);
      }
    };

    // Lắng nghe sự kiện chính
    socketRef.current.on(event, handleEvent);

    // Lắng nghe sự kiện lỗi (nếu server gửi)
    socketRef.current.on(`${event}_error`, handleError);

    // Trả về hàm cleanup
    return () => {
      socketRef.current?.off(event, handleEvent);
      socketRef.current?.off(`${event}_error`, handleError);
    };
  }, [event, onSuccess, onError]);

  // Gửi sự kiện
  const emit = useCallback(
    (emitData?: any, callback?: (response: any) => void) => {
      if (!socketRef.current || !isConnected) {
        console.error("Socket not connected");
        setError("Socket not connected");
        return;
      }

      setLoading(true);
      setError(null);

      // Gửi sự kiện tới server
      socketRef.current.emit(event, emitData, (response: any) => {
        setLoading(false);

        if (response?.error) {
          setError(response.error);
          onError?.(response.error);
        } else {
          setSuccess(true);
          if (callback) callback(response);
        }
      });
    },
    [event, isConnected, onError]
  );

  // Ngừng lắng nghe
  const stopListening = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.off(event);
    socketRef.current.off(`${event}_error`);
  }, [event]);

  // Dọn dẹp khi unmount
  useEffect(() => {
    isMounted.current = true;

    if (autoListen) {
      connectSocket();
    }

    return () => {
      isMounted.current = false;
      stopListening();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [autoListen, connectSocket, stopListening]);

  // Thiết lập listener
  useEffect(() => {
    if (autoListen && socketRef.current) {
      const cleanup = listen();
      return cleanup;
    }
  }, [autoListen, listen]);

  const state = useMemo(
    () => ({
      data,
      loading,
      success,
      error,
      isConnected,
      emit,
      listen,
      stopListening,
      connect: connectSocket,
      disconnect: () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setIsConnected(false);
        }
      },
    }),
    [
      data,
      loading,
      success,
      error,
      isConnected,
      emit,
      listen,
      stopListening,
      connectSocket,
    ]
  );

  return state;
};
