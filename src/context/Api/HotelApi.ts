import {
  MethodType,
  type DetailResponseMessage,
  type Hotel,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

export const useGetAllHotels = () => {
  const { data: dataGetAllHotels, refetch: refetchGetAllHotels } = useFetch<
    DetailResponseMessage<Hotel>,
    void
  >({
    url: "/sys/hotels",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetAllHotels,
    refetchGetAllHotels,
  };
};

export const useGetHotelByHotelCode = (hotelCode: string) => {
  const { data: dataHotelByHotelCode, refetch: refetchGetHotelByHotelCode } =
    useFetch<DetailResponseMessage<Hotel>, void>({
      url: `/sys/hotels/find-by-hotel-code/${hotelCode}`,
      autoFetch: !!hotelCode,
      config: getMethod,
    });
  return {
    dataHotelByHotelCode,
    refetchGetHotelByHotelCode,
  };
};
