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
  const socketRef = useRef(socket);

  const isMounted = useRef(true);

  useEffect(() => {
    if (autoListen && !socketRef.current.connected) {
      socketRef.current.connect();
    }

    return () => {
      if (socketRef.current.connected) {
        socketRef.current.disconnect();
      }
    };
  }, [autoListen]);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      if (userId) socket.emit("register_user", userId);
    };

    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [userId]);

  // Lắng nghe event chính
  const listen = useCallback(() => {
    const handleEvent = (response: T) => {
      if (isMounted.current) {
        setData(response);
        setSuccess(true);
        setLoading(false);
        onSuccess?.(response);
      }
    };

    const handleError = (err: any) => {
      if (isMounted.current) {
        setError(err);
        setLoading(false);
        onError?.(err);
      }
    };

    socket.on(event, handleEvent);
    socket.on(`${event}_error`, handleError);

    return () => {
      socket.off(event, handleEvent);
      socket.off(`${event}_error`, handleError);
    };
  }, [event, onSuccess, onError]);

  // Dọn dẹp khi unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Emit sự kiện
  const emit = useCallback(
    (emitData?: any, callback?: (response: any) => void) => {
      if (!socket.connected) {
        console.error("Socket not connected");
        setError("Socket not connected");
        return;
      }

      setLoading(true);
      setError(null);

      socket.emit(event, emitData, (response: any) => {
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
    [event, onError]
  );

  const state = useMemo(
    () => ({
      data,
      loading,
      success,
      error,
      isConnected,
      emit,
      listen,
    }),
    [data, loading, success, error, isConnected, emit, listen]
  );

  return state;
};
