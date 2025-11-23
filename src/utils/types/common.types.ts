export enum MethodType {
  DELETE = "DELETE",
  PATCH = "PATCH",
  PUT = "PUT",
  GET = "GET",
  POST = "POST",
}

export interface ReqUserIDProps {
  id?: number;
}

export type GetIDToDeleteData = {
  id: number | string;
};

export type DetailResponseMessage<T = null> = {
  data?: T;
  list?: T[];
  resultCode: string;
  resultMessage: string;
};

export type SocketResponseMessage<T = null> = {
  data?: {
    list?: T[];
    resultCode: string;
    resultMessage: string;
  };
};

export type ResponseMessage = {
  resultCode: string;
  resultMessage: string;
};

export interface TypeWithErrorResponse {
  code?: string;
  errorCode: string;
  errorMessage: string;
}

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

export type CodeItem = {
  code: string;
  codeName?: string;
  acodeName?: string;
};

export type Language = "en" | "ko" | "jp";
