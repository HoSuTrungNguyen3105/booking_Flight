import { axiosRapid } from "../../utils/axiosRapid";

// interface GeoDistanceResponse {
//   data: {
//     id: string;
//     distance: number;
//     distanceUnit: string;
//   };
// }

export type LocaleConfig = {
  locale: string;
  language: {
    code: string;
    name: string;
  };
  currency: {
    code: string;
    symbol: string;
    displayName: string;
  };
  logo: {
    url: string;
    alt: string;
  };
  country: {
    country: string;
    flag: string;
  };
};

export interface CountryResponse {
  data: CountryData;
}

export interface CountryData {
  capital: string;
  code: string;
  callingCode: string;
  currencyCodes: string[];
  flagImageUri: string;
  name: string;
  numRegions: number;
  wikiDataId: string;
}

export interface GeoLink {
  rel: string;
  href: string;
}

export interface GeoCity {
  id: number;
  wikiDataId: string;
  type: string;
  name: string;
  country: string;
  countryCode: string;
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
    return res.data;
  } catch (error) {
    console.error("RapidAPI error:", error);
    return undefined;
  }
};
