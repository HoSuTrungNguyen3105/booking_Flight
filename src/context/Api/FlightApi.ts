import {
  MethodType,
  type FlightDetailApiResponse,
  type FlightListApiResponse,
  type FlightResponse,
  type ReqUserIDProps,
  type TicketResponseMessage,
  type StatusResponseMessage,
  type FlightByDay,
  type DetailResponseMessage,
  type GetAllCodeResponseMessage,
  type ResponseMessage,
  type SearchFlightResponse,
  type CreateManyFlightResultItem,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import { useSecureFetch } from "../use[custom]/useSecureFetch.ts";
import type { FlightFormData } from "../../components/Admin/component/Flight/FlightManagementModal.tsx";
import type { SearchFlightDto } from "./../../components/Admin/component/Flight/Search_layout.tsx";
import type { CreateDiscountReq } from "../../components/Contact/DiscountBatchCreator.tsx";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

type FlightId = {
  id?: number;
};

export const useFlightById = ({ id }: FlightId) => {
  const isValid = !!id;
  const { data: fetchFlightId, refetch: refetchFlightId } = useFetch<
    FlightDetailApiResponse,
    FlightId
  >({
    url: isValid ? `/sys/flights/flights/${id}` : "",
    params: {},
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchFlightId,
    refetchFlightId,
  };
};

type DiscountCreateResult =
  | {
      code: string;
      resultCode: string;
      resultMessage: string;
    }
  | {
      resultCode: string;
      resultMessage: string;
    };

export const useCreateBatchDiscount = () => {
  const { refetch: refetchCreateBatchDiscount } = useFetch<
    DetailResponseMessage<DiscountCreateResult>,
    CreateDiscountReq[]
  >({
    url: "/sys/flights/discounts/create",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateBatchDiscount,
  };
};

export const useGetFlightData = () => {
  const {
    data: getFlightData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, null>({
    url: "/sys/flights",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getFlightData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useGetFlightAvailableDates = (airportCode: string) => {
  const {
    data: getFlightData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<DetailResponseMessage<FlightByDay>, void>({
    url: `/sys/flights/dates/${airportCode}`,
    autoFetch: true,
    config: getMethod,
  });

  return {
    getFlightData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useGetFlightByIDData = ({ id }: ReqUserIDProps) => {
  const {
    data: getFlightByIdData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, void>({
    url: id ? `/sys/flights/getFlight/${id}` : "",
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    getFlightByIdData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useCreateMultiFlight = () => {
  const { refetch: refetchCreateMultiFlight } = useFetch<
    DetailResponseMessage<CreateManyFlightResultItem>,
    FlightFormData[]
  >({
    url: "/sys/flights/bulk-create",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateMultiFlight,
  };
};

export const useGetAllInfoFlightByIDData = ({ id }: ReqUserIDProps) => {
  const {
    data: getAllInfoFlightByIdData,
    refetch: refetchGetAllInfoFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, void>({
    url: id ? `/sys/flights/getFlightAllInfo/${id}` : "",
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    getAllInfoFlightByIdData,
    refetchGetAllInfoFlightData,
    loadingFlightData,
  };
};

export const useGetAllFlightMainInfo = () => {
  const { data: getAllFlightInfoInfo, refetch: refetchGetAllFlightInfoInfo } =
    useFetch<FlightDetailApiResponse, null>({
      url: "/sys/flights/flight-info/main",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getAllFlightInfoInfo,
    refetchGetAllFlightInfoInfo,
  };
};

export const useGetAllFlightIds = () => {
  const { data: getAllFlightIds, refetch: refetchGetAllFlightIds } = useFetch<
    StatusResponseMessage,
    void
  >({
    url: "/sys/flights/flightIds/status",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAllFlightIds,
    refetchGetAllFlightIds,
  };
};

export const useExportFlightExcel = () => {
  const { refetch, loading } = useFetch<DetailResponseMessage<string>, void>({
    url: "/sys/users/init/exportFlightsToExcel",
    config: getMethod,
    autoFetch: false,
  });

  const exportExcel = async () => {
    const res = await refetch();
    if (res?.data) {
      const byteCharacters = atob(res.data);
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
      link.setAttribute("download", "flights.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return { exportExcel, loading };
};

export const useGetAllTicketInfo = () => {
  const {
    data: getTicketInfo,
    refetch: refetchGetTicketInfo,
    loading: loadingGetTicketInfo,
  } = useFetch<TicketResponseMessage, null>({
    url: "/sys/flights/tickets",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTicketInfo,
    refetchGetTicketInfo,
    loadingGetTicketInfo,
  };
};

export const useGetAllCode = () => {
  const { data: getAllCode, refetch: refetchGetAllCode } = useFetch<
    GetAllCodeResponseMessage,
    null
  >({
    url: "/sys/flights/getAllCode",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAllCode,
    refetchGetAllCode,
  };
};

export const useCreateFlight = () => {
  const { data: createFlightData, refetch: refetchCreateFlightData } = useFetch<
    FlightListApiResponse,
    Partial<FlightFormData>
  >({
    url: "/sys/flights",
    autoFetch: false,
    config: postMethod,
  });
  return {
    createFlightData,
    refetchCreateFlightData,
  };
};

export const useGetFlightNo = () => {
  const { data: getFlightNoData, refetch: refetchGetFlightNoData } = useFetch<
    ResponseMessage,
    any
  >({
    url: "/sys/flights/generateNewFlightCode",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    getFlightNoData,
    refetchGetFlightNoData,
  };
};

export const useDeleteManyFlightIds = () => {
  const { refetch: refetchDeleteManyFlightIds } = useFetch<
    ResponseMessage,
    number[]
  >({
    url: "/sys/flights/flightIds/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteManyFlightIds,
  };
};

export const useCreateRandomFlight = () => {
  const {
    refetch: refetchCreateRandomFlight,
    loading: loadingCreateRandomFlight,
  } = useFetch<ResponseMessage, void>({
    url: "/sys/airport/flight/random",
    autoFetch: true,
    config: postMethod,
  });

  return {
    refetchCreateRandomFlight,
    loadingCreateRandomFlight,
  };
};

export const useSearchFlight = () => {
  const {
    data: searchFlightList,
    refetch: refetchSearchFlightList,
    openModalConfirm,
    handlePasswordConfirm,
    handleCloseConfirmPassword,
    handleCancelPassword,
    loading,
    isValid,
    hasPendingRequest,
    resetAuthValidation,
  } = useSecureFetch<SearchFlightResponse, SearchFlightDto>({
    url: "/sys/flights/search",
    requirePassword: true,
    autoFetch: false,
    config: postMethod,
    resetAfterSuccess: false,
  });
  return {
    searchFlightList,
    refetchSearchFlightList,
    openModalConfirm,
    handlePasswordConfirm,
    handleCloseConfirmPassword,
    handleCancelPassword,
    hasPendingRequest,
    resetAuthValidation,
    loading,
    isValid,
  };
};

export const useFlightUpdate = ({ id }: ReqUserIDProps) => {
  const { data: updateFlightId, refetch: refetchUpdateFlightId } = useFetch<
    FlightDetailApiResponse,
    Partial<FlightFormData>
  >({
    url: `/sys/flights/updateFlight/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    updateFlightId,
    refetchUpdateFlightId,
  };
};

export const useSelectIdFlight = (id: string | number | undefined) => {
  const { data: selectIdFlight, refetch: refetchSelectIdFlight } = useFetch<
    FlightDetailApiResponse,
    boolean
  >({
    url: `/sys/flights/selectFlightById/${id}`,
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: postMethod,
  });
  return {
    selectIdFlight,
    refetchSelectIdFlight,
  };
};
