import {
  MethodType,
  type DetailResponseMessage,
  type ResponseMessage,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

export interface UnlockRequest {
  id: number;
  userId: number;
  reason: string;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
  user: {
    id: number;
  };
}

export const useGetUnlockRequests = () => {
  const { data: getUnlockRequests, refetch: refetchGetUnlockRequests } =
    useFetch<DetailResponseMessage<UnlockRequest>, null>({
      url: "/auth/unlock-requests",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getUnlockRequests,
    refetchGetUnlockRequests,
  };
};

export const useApproveUnlock = () => {
  const { data: dataApproveUnlock, refetch: refetchApproveUnlock } = useFetch<
    ResponseMessage,
    { id: number }
  >({
    url: "sys/users/approve-unlock",
    autoFetch: false, // chỉ gọi khi cần
    config: postMethod,
  });

  return { dataApproveUnlock, refetchApproveUnlock };
};

export const useRejectUnlock = () => {
  const { data: dataRejectUnlock, refetch: refetchRejectUnlock } = useFetch<
    ResponseMessage,
    { id: number }
  >({
    url: "sys/users/reject-unlock",
    autoFetch: false, // chỉ gọi khi cần
    config: postMethod,
  });

  return { dataRejectUnlock, refetchRejectUnlock };
};

export interface RequestUnlock {
  userId: number;
  reason: string;
}

export const useRequestUnlockAccount = () => {
  const { data: requestUnlockAccount, refetch: refetchRequestUnlockAccount } =
    useFetch<ResponseMessage, RequestUnlock>({
      url: "/sys/users/request-unlock",
      defaultValue: { resultCode: "", resultMessage: "" },
      autoFetch: false,
      config: postMethod,
    });
  return {
    requestUnlockAccount,
    refetchRequestUnlockAccount,
  };
};

export type MyRequestUnlockProps = {
  id: number;
  status: string;
  createdAt: string;
  reason: string;
};

export const useGetMyRequestUnlock = (id?: number) => {
  const { data: dataGetMyRequestUnlock, refetch: refetchGetMyRequestUnlock } =
    useFetch<DetailResponseMessage<MyRequestUnlockProps>, void>({
      url: `/sys/users/my_request-unlock/${id}`,
      autoFetch: !!id,
      config: getMethod,
    });

  return {
    dataGetMyRequestUnlock,
    refetchGetMyRequestUnlock,
  };
};

export const useDeleteRequestUnlockById = () => {
  const { data: requestUnlockAccount, refetch: refetchRequestUnlockAccount } =
    useFetch<ResponseMessage, { id: number }>({
      url: "/sys/users/request-unlock/delete",
      autoFetch: false,
      config: postMethod,
    });
  return {
    requestUnlockAccount,
    refetchRequestUnlockAccount,
  };
};
