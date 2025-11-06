import { useFetch } from "../use[custom]/useFetch";
import { MethodType, type CountryResponse } from "../../utils/type";

// Định nghĩa kiểu dữ liệu thật sự mà API trả về
// (RapidAPI GeoDB Distance API trả về object có trường "data.distance" v.v.)
interface GeoDistanceResponse {
  data: {
    id: string;
    distance: number;
    distanceUnit: string;
  };
}

export interface GeoLink {
  rel: string;
  href: string;
}

export interface GeoCity {
  id: number;
  wikiDataId: string;
  type: string; // "ADM2" | "CITY" | "ADM1" ...
  city: string;
  name: string;
  country: string;
  countryCode: string; // ví dụ "VN"
  latitude: number;
  longitude: number;
  population: number;
  distance: number;
}

export interface GeoMetadata {
  currentOffset: number;
  totalCount: number;
}

export interface GeoNearbyCitiesResponse {
  links: GeoLink[];
  data: GeoCity[];
  metadata: GeoMetadata;
}

export const useGetDistanceBetweenPlaces = (fromId: string, toId: string) => {
  const {
    data: dataDistance,
    refetch: refetchDistance,
    loading,
    error,
  } = useFetch<GeoDistanceResponse, void>({
    isFullUrl: true,
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/places/${fromId}/distance?toPlaceId=${toId}`,
    autoFetch: !!fromId && !!toId, // chỉ fetch khi đủ id
    config: {
      method: MethodType.GET,
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "d0f81ef94amsh2bf5537ea7d8bc6p182b9bjsn4e67a7051177",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    },
  });

  return { dataDistance, refetchDistance, loading, error };
};

export const useGetDistancesByLocationCode = (fromId: string) => {
  const {
    data: dataDistance,
    refetch: refetchDistance,
    loading,
    error,
  } = useFetch<CountryResponse, void>({
    isFullUrl: true,
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${fromId}`,
    autoFetch: !!fromId, // chỉ fetch khi đủ id
    config: {
      method: MethodType.GET,
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "d0f81ef94amsh2bf5537ea7d8bc6p182b9bjsn4e67a7051177",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    },
  });

  return { dataDistance, refetchDistance, loading, error };
};

export const useGetLocationCode = (lat: number, lng: number) => {
  const {
    data: dataLocation,
    refetch: refetchDistance,
    loading,
    error,
  } = useFetch<GeoNearbyCitiesResponse, void>({
    isFullUrl: true,
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${lat},${lng}/nearbyCities?limit=1`,
    // ✅ autoFetch chỉ bật khi có đủ lat & lng
    autoFetch: !!lat && !!lng,
    config: {
      method: MethodType.GET,
      headers: {
        // "Content-Type": "application/json",
        "X-RapidAPI-Key": "d0f81ef94amsh2bf5537ea7d8bc6p182b9bjsn4e67a7051177",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    },
  });

  return { dataLocation, refetchDistance, loading, error };
};
