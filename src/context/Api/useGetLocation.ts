import { axiosRapid } from "../../utils/axiosRapid";

// interface GeoDistanceResponse {
//   data: {
//     id: string;
//     distance: number;
//     distanceUnit: string;
//   };
// }

export interface CountryResponse {
  data: CountryData;
}

export interface CountryData {
  capital: string;
  code: string; // ví dụ "VN"
  callingCode: string; // ví dụ "+84"
  currencyCodes: string[]; // ví dụ ["VND"]
  flagImageUri: string;
  name: string; // ví dụ "Vietnam"
  numRegions: number; // ví dụ 63
  wikiDataId: string; // ví dụ "Q881"
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

export const refethDistancesToGetCallingCode = async (
  fromId: string
): Promise<CountryResponse | undefined> => {
  try {
    const res = await axiosRapid.get<CountryResponse>(
      `geo/countries/${fromId}`
    );
    console.log(" RapidAPI response:", res.data);
    return res.data;
  } catch (error) {
    console.error("RapidAPI error:", error);
    return undefined;
  }
};

export const refetchDistance = async (
  lat?: number,
  lng?: number
): Promise<GeoNearbyCitiesResponse | undefined> => {
  if (!lat || !lng) return;

  try {
    const res = await axiosRapid.get<GeoNearbyCitiesResponse>(
      `geo/locations/${lat}+${lng}/nearbyCities?limit=1`
    );
    console.log(" RapidAPI response:", res.data);
    return res.data;
  } catch (error) {
    console.error("RapidAPI error:", error);
    return undefined;
  }
};
