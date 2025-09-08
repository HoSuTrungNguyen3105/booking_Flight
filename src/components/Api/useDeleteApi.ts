import { useFetch } from "../../context/use[custom]/useFetch";
import { MethodType } from "../../hooks/type";
import type { DetailResponseMessage, ResponseMessage } from "../../utils/type";

const deleteMethod = {
  method: MethodType.DELETE,
  headers: { "Content-Type": "application/json" },
};
// type DeleteUserProps = {
//   id: number;
// };
// export const useDeleteUserById = () => {
//   const { refetch: refetchDeleteUser } = useFetch<
//     ResponseMessage,
//     DeleteUserProps
//   >({
//     url: "/sys/users/deleteUser",
//     autoFetch: false,
//     config: deleteMethod,
//   });
//   return {
//     refetchDeleteUser,
//   };
// };
