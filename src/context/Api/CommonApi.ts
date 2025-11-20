import {
  MethodType,
  type CodeItem,
  type DetailResponseMessage,
  type FlightBaggageDetailApiResponse,
  type LocaleConfig,
} from "../../utils/type.ts";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

const getMethod = {
  method: MethodType.GET,
};

export interface SelectOptions {
  label: string;
  value: string;
}

export const mapStringToDropdown: (list: string[]) => SelectOptions[] = (
  list
) => {
  return list.map((item) => ({
    label: item,
    value: item,
  }));
};

export const mapToDropdown = (
  list: CodeItem[],
  key: keyof CodeItem,
  valueKey: keyof CodeItem = "code"
): DropdownOptions[] => {
  return list.map((item) => ({
    label: item[key] || "",
    value: item[valueKey] || "",
  }));
};

export const useGetBaggageData = () => {
  const { refetch: refetchBaggageData, data: dataBaggage } = useFetch<
    FlightBaggageDetailApiResponse,
    void
  >({
    url: "sys/bookings/baggage",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataBaggage,
    refetchBaggageData,
  };
};

export type LocaleTypeProps = {
  language: string;
  currency: string;
};

export const useFindLocaleConfig = () => {
  const { data: dataFindLocaleConfig, refetch: refetchFindLocaleConfig } =
    useFetch<DetailResponseMessage<LocaleConfig>, LocaleTypeProps>({
      url: "/sys/locale/config",
      autoFetch: true,
      config: postMethod,
    });
  return {
    dataFindLocaleConfig,
    refetchFindLocaleConfig,
  };
};
