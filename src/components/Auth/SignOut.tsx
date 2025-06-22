import { useMutation, useQueryClient } from "@tanstack/react-query";
// import * as apiClient from "../../context/AuthContext";
// import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const SignOut = () => {
  const queryClient = useQueryClient();
  //   const { showToast } = useAppContext();
  const { user, logout } = useAuth();
  //   const mutation = useMutation(logout(), {
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries("validadeUser");
  //       toast.success("Signed Out Successfully!");
  //     //   showToast({ message: "Signed Out!", type: "SUCCESS" });
  //     },
  //     onError: (error: Error) => {
  //     //   showToast({ message: error.message, type: "ERROR" });
  //     toast.error(`Sign Out Failed: ${error.message}`);
  //     },
  //   });

  const handleClick = () => {
    // mutation.mutate();
    if (user === null) {
      toast.error("You are not logged in!");
      return;
    }
    logout();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 "
    >
      Sign Out
    </button>
  );
};

export default SignOut;
