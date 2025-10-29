import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../../hooks/socket";

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

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      if (userId) {
        socket.emit("register_user", userId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [userId]);

  // // Listen event chính
  useEffect(() => {
    if (!autoListen) return;

    const handleEvent = (response: T) => {
      if (!isMounted.current) return;
      console.log(`Received event ${event}:`, response);
      setData(response);
      setSuccess(true);
      setLoading(false);
      onSuccess?.(response);
    };

    const handleError = (err: any) => {
      if (!isMounted.current) return;
      console.error(`Error in event ${event}:`, err);
      setError(err);
      setLoading(false);
      onError?.(err);
    };
    if (autoListen) setLoading(true);
    socket.on(event, handleEvent);
    socket.on(`${event}_error`, handleError);

    return () => {
      socket.off(event, handleEvent);
      socket.off(`${event}_error`, handleError);
    };
  }, [event, autoListen, onSuccess, onError]);

  // Emit function
  const emit = useCallback(
    (emitData?: any, callback?: (response: any) => void) => {
      if (!socket.connected) {
        console.error("Socket not connected");
        setError("Socket not connected");
        socket.connect();
        return;
      }

      setLoading(true);
      setError(null);

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
