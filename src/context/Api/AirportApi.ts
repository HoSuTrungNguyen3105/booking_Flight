import {
  MethodType,
  type AirportResponseMessage,
  type TerminalLabelListResponse,
  type TerminalResponse,
  type DetailResponseMessage,
  type FacilyByTerminalIdResponseMessage,
  type ResponseMessage,
  type CreateTerminalDto,
  type AirportCreateResponseMessage,
  type CreateAirportReq,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
};

export const useGetAllAirportInfo = () => {
  const { data: getAirportInfo, refetch: refetchGetAirportInfo } = useFetch<
    AirportResponseMessage,
    null
  >({
    url: "/sys/flights/airports",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAirportInfo,
    refetchGetAirportInfo,
  };
};

export const useGetTerminalData = () => {
  const { data: getTerminalData, refetch: refetchGetTerminalData } = useFetch<
    TerminalResponse,
    void
  >({
    url: "/sys/flights/terminal",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTerminalData,
    refetchGetTerminalData,
  };
};

type GateCodeRes = {
  id: string;
  code: string;
};

export const useGetAllGateCode = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<GateCodeRes>,
    void
  >({
    url: "/sys/gates/findAllGateCode",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllGateCode: data,
    refetchGetAllGateCode: refetch,
    loadingAllGateCode: loading,
  };
};

export const useFindTerminalIDStatuses = () => {
  const { data, loading } = useFetch<TerminalLabelListResponse, void>({
    url: "/sys/gates/findTerminalID",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataTerminalIDStatuses: data,
    loadingFindTerminalIDStatuses: loading,
  };
};

export const useGetFaclilityByTerminalID = (terminalId: string) => {
  const { data, refetch } = useFetch<FacilyByTerminalIdResponseMessage, void>({
    url: `/sys/gates/by-terminal/${terminalId}`,
    autoFetch: !!terminalId,
    config: getMethod,
  });
  return {
    dataGetFaclilityByTerminalID: data,
    refetchGetFaclilityByTerminalID: refetch,
  };
};

export const useCreateTerminalBulk = () => {
  const { refetch: refetchCreateTerminalBulk } = useFetch<
    ResponseMessage,
    CreateTerminalDto[]
  >({
    url: "/sys/flights/createTerminal/bulk",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateTerminalBulk,
  };
};

export const useCreateBatchAirport = () => {
  const {
    refetch: refetchCreateBatchAirport,
    loading: loadingCreateBatchAirport,
  } = useFetch<AirportCreateResponseMessage, CreateAirportReq[]>({
    url: "/sys/flights/airport/batch",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateBatchAirport,
    loadingCreateBatchAirport,
  };
};

type DeleteAirportProps = { code: string };

export const useDeleteAirportById = () => {
  const { refetch: refetchDeleteAirport, loading: loadingDeleteAirport } =
    useFetch<ResponseMessage, DeleteAirportProps>({
      url: "/sys/flights/airports/delete",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchDeleteAirport,
    loadingDeleteAirport,
  };
};

export const useCreateAirport = () => {
  const { refetch: refetchCreateAirport, loading: loadingCreateAirport } =
    useFetch<ResponseMessage, CreateAirportReq>({
      url: "/sys/flights/airports",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchCreateAirport,
    loadingCreateAirport,
  };
};
