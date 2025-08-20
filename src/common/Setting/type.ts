import type { GridRowDef } from "../DataGrid";

export type DataDetail = {
  dataName: string; // 데이터 이름
  managementId: string; // 관리 ID
  dataType: "데이터셋" | "파일" | string; // 데이터 형태
  dataSource: string; // 데이터 출처 (e.g., "SecuXperAI", "DAP", ...)
  collectionMethod: "자동 배치" | "수동"; // 수집 방법
  evaluationHistoryLink: string; // 평가 이력 링크
  collectionTime: string; // 수집 시간
  description: string; // 설명
  metadataDescription: string; // 메타데이터(Description)
  hash: string; // HASH
  isDeleted: boolean; // 삭제 여부 (true = Y, false = N)
};

export const customLabels: Record<keyof DataDetail, string> = {
  dataName: "데이터 이름",
  managementId: "관리 ID",
  dataType: "데이터 형태",
  dataSource: "데이터 출처",
  collectionMethod: "수집 방법",
  evaluationHistoryLink: "평가 이력",
  collectionTime: "수집 시간",
  description: "데이터 설명",
  metadataDescription: "메타데이터(Description)",
  hash: "HASH",
  isDeleted: "삭제 여부",
};

export interface IDataHistoryProps extends GridRowDef {
  collectionDate: string;
  sequence: number;
  collectionMethod: string;
  dataId: string;
  dataName: string;
  creationUser: string;
}

export interface IRelateCheckItemProps extends GridRowDef {
  itemName: string;
  checkItemName: string;
  checkItemType: string;
  checkItemStatus: string;
  checkItemResult: string;
  checkItemDate: string;
  fileName: string[];
}

export interface ISubfileListProps extends GridRowDef {
  fileName: string;
  fileSize: string;
  uploadTime: string;
  uploader: string;
  type: string;
}
// types.ts
export interface Meal {
  id: number;
}

export interface Aircraft {
  code: string;
  model: string;
  range: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  coordinates: string;
  timezone: string;
}

export type Flight = {
  flightId: number;
  flightNo: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  aircraftCode: string;
  actualDeparture?: string | null;
  actualArrival?: string | null;
  aircraft: Aircraft;
  departureAirportRel: Airport;
  arrivalAirportRel: Airport;
  meals: Meal[];
};
