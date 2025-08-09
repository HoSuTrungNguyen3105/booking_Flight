import { useFetch } from "../../context/use[custom]/useFetch";
import { MethodType } from "../../hooks/type";
import type { DetailResponseMessage } from "../../utils/type";

const deleteMethod = {
  method: MethodType.DELETE,
  headers: { "Content-Type": "application/json" },
};
export const useDeleteUserById = (id?: number) => {
  const isValid = !!id;
  const { refetch: refetchDeleteUser } = useFetch<
    DetailResponseMessage,
    DetailResponseMessage
  >({
    url: isValid ? `/sys/users/${id}` : "",
    // params: {},
    autoFetch: false,
    config: deleteMethod,
    showToast: true,
  });
  return {
    refetchDeleteUser,
  };
};
