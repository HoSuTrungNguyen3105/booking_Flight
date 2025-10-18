// import { useEffect, useState } from "react";

// interface IUseUpdateUserProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }
// export const useFlightManagement = ({
//   onClose,
//   onSuccess,
// }: IUseUpdateUserProps) => {
//   //   const api = useApi();
//   const [error, setError] = useState<string>("");

//   const [getValuePassenger, setGetValuePassenger] = useState(false);
//   const [passengerId, setPassengerId] = useState("");

//   const { dataAllPassenger } = useFindAllPassenger();

//   const onRowSelect = (rowData: GridRowDef) => {
//     setGetValuePassenger(true);
//     setPassengerId(rowData.id as string);
//   };

//   const rowData = useMemo(
//     () =>
//       dataAllPassenger?.list?.map((item) => ({
//         ...item,
//         id: item.id,
//       })) || [],
//     [dataAllPassenger]
//   );

//   const handleReturn = useCallback(() => {
//     setGetValuePassenger(false);
//   }, [setGetValuePassenger]);

//   const toast = useToast();

//   const formDetailConfig = useDataSection(updateInfo, "register");

//   const handleChange = (key: string, value: any) => {
//     setUpdateInfo((prev) => ({ ...prev, [key]: value }));
//   };
//   const { refetchCreateUser } = useCreateUserByAdmin();
//   const handleSubmit = async () => {
//     if (updateInfo.email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(updateInfo.email)) {
//         setError("Invalid email format");
//         return;
//       }
//     }
//     const payload: UserCreateProps = {
//       ...updateInfo,
//     };

//     const res = await refetchCreateUser(payload);

//     if (res?.resultCode === "00") {
//       toast(res.resultMessage, "success");
//       onSuccess();
//       onClose();
//     } else {
//       setError(res?.resultMessage || "Error not found");
//     }
//   };

//   return {
//     error,
//     formDetailConfig,
//     updateInfo,
//     handleChange,
//     handleSubmit,
//   } as const;
// };
