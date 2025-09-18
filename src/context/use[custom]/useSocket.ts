import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "./socket";

type TUseSocket<T> = {
  event: string;
  defaultValue?: T;
  autoListen?: boolean;
  onSuccess?: (res: T) => void;
  onError?: (error: any) => void;
  userId?: number | string;
};

export const useSocket = <T>({
  event,
  defaultValue,
  autoListen = true,
  userId,
  onSuccess,
  onError,
}: TUseSocket<T>) => {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const isMounted = useRef(true);
  const eventHandlers = useRef<{ event: string; handler: any }[]>([]);

  // Kết nối socket khi component mount
  useEffect(() => {
    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    return () => {
      // Chỉ disconnect nếu không có component nào khác sử dụng
      // Thông thường nên giữ kết nối và chỉ remove listeners
      console.log("Cleaning up socket listeners");

      // Remove all registered listeners
      eventHandlers.current.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
      eventHandlers.current = [];
    };
  }, [autoListen]);

  const handleFollowConnect = useCallback(() => {
    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (userId) {
        console.log("Registering user:", userId);
        socket.emit("register_user", userId);
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    // Lưu handlers để cleanup
    eventHandlers.current.push(
      { event: "connect", handler: handleConnect },
      { event: "disconnect", handler: handleDisconnect }
    );

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      // Remove from tracked handlers
      eventHandlers.current = eventHandlers.current.filter(
        (h) => h.handler !== handleConnect && h.handler !== handleDisconnect
      );
    };
  }, [eventHandlers]);

  // Theo dõi trạng thái kết nối và register user
  useEffect(() => {
    handleFollowConnect();
  }, [userId]);

  // Lắng nghe event chính - QUAN TRỌNG: sửa lại phần này
  useEffect(() => {
    if (!autoListen) return;

    const handleEvent = (response: T) => {
      if (isMounted.current) {
        console.log(`Received event ${event}:`, response);
        setData(response);
        setSuccess(true);
        setLoading(false);
        onSuccess?.(response);
      }
    };

    const handleError = (err: any) => {
      if (isMounted.current) {
        console.error(`Error in event ${event}:`, err);
        setError(err);
        setLoading(false);
        onError?.(err);
      }
    };

    // Đăng ký listeners
    socket.on(event, handleEvent);
    socket.on(`${event}_error`, handleError);

    // Lưu handlers để cleanup
    eventHandlers.current.push(
      { event: event, handler: handleEvent },
      { event: `${event}_error`, handler: handleError }
    );

    return () => {
      // Cleanup listeners
      socket.off(event, handleEvent);
      socket.off(`${event}_error`, handleError);

      // Remove from tracked handlers
      eventHandlers.current = eventHandlers.current.filter(
        (h) => h.handler !== handleEvent && h.handler !== handleError
      );
    };
  }, [event, autoListen, onSuccess, onError]);

  // Emit sự kiện
  const emit = useCallback(
    (emitData?: any, callback?: (response: any) => void) => {
      if (!socket.connected) {
        console.error("Socket not connected");
        setError("Socket not connected");

        // Tự động kết nối lại nếu chưa kết nối
        socket.connect();
        return;
      }

      setLoading(true);
      setError(null);
      console.log(`Emitting event ${event}:`, emitData);

      // Sửa lại để handle callback properly
      socket.emit(event, emitData, (response: any) => {
        if (!isMounted.current) return;

        setLoading(false);

        if (response?.error) {
          setError(response.error);
          onError?.(response.error);
        } else {
          setSuccess(true);
          callback?.(response);
        }
      });
    },
    [event, onError]
  );

  // Dọn dẹp khi unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const state = useMemo(
    () => ({
      data,
      loading,
      success,
      error,
      isConnected,
      emit,
    }),
    [data, loading, success, error, isConnected, emit]
  );

  return state;
};
