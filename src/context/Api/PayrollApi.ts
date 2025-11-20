import {
  MethodType,
  type DetailResponseMessage,
  type Payroll,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import type { ActionType } from "../../common/Dropdown/SelectDropdown.tsx";

const getMethod = {
  method: MethodType.GET,
};

export const useGetUserIdAndNameToDropdownGeneratePayroll = () => {
  const { refetch, data, loading } = useFetch<
    DetailResponseMessage<ActionType>,
    void
  >({
    url: "/sys/payrolls/getUserIdAndNameToDropdown",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetUserIdAndNameToDropdown: data,
    refetchGetUserIdAndNameToDropdown: refetch,
    loadingGetUserIdAndNameToDropdown: loading,
  };
};

export const useGetPayrollsById = (id: number) => {
  const { refetch, data, loading } = useFetch<
    DetailResponseMessage<Payroll>,
    void
  >({
    url: `/sys/payrolls/payroll/getById/${String(id)}`,
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    dataGetPayrollsById: data,
    refetchGetPayrollsById: refetch,
    loadingGetPayrollsById: loading,
  };
};

export const useExportPayrollExcel = () => {
  const { refetch, loading } = useFetch<DetailResponseMessage<string>, void>({
    url: "/sys/users/init/exportPayrollsToExcel",
    config: getMethod,
    autoFetch: false,
  });

  const exportExcel = async () => {
    const res = await refetch();
    if (res?.data) {
      const byteCharacters = atob(res.data); // decode base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "payroll.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return { exportExcel, loading };
};
