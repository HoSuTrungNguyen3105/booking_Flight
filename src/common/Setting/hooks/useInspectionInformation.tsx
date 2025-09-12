import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DateFormatEnum, formatDateKR } from "../../../hooks/format";
import type { IDataDetail } from "../type";
import type { IDetailItem } from "../../DetailSection";

type DataDetailProps = {
  data: IDataDetail;
  type: string;
};

export const useInspectionInformation = ({ data, type }: DataDetailProps) => {
  const [showEvaluationHistory, setShowEvaluationHistory] = useState(false);
  const getIsDeletedLabel = useCallback(
    (value: boolean) => (value ? "Y" : "N"),
    []
  );
  const [isLoading] = useState(false);

  // Thông tin inspectionData
  const inspectionData = useState<IDataDetail>({
    id: 1,
    dataName: data.dataName,
    managementId: data.managementId,
    dataType: data.dataType,
    dataSource: data.dataSource,
    collectionMethod: data.collectionMethod,
    evaluationHistoryLink: "평가 이력 보기",
    collectionTime: data.collectionTime,
    description: data.description,
    isDeleted: data.isDeleted,
    hash: "hash...",
    metadataDescription: data.metadataDescription,
    version: data.version,
    datasource: data.datasource,
  })[0];

  // Chi tiết Data
  const detailsData: IDetailItem[] = useMemo(
    () => [
      { title: "데이터 이름", description: inspectionData.dataName },
      { title: "관리 ID", description: inspectionData.managementId },
      { title: "데이터 형태", description: inspectionData.dataType },
      { title: "출처 시스템", description: inspectionData.dataSource },
      {
        title: "평가 이력",
        description: (
          <Box
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setShowEvaluationHistory(true)}
          >
            <Typography variant="body2">
              {inspectionData.evaluationHistoryLink}
            </Typography>
          </Box>
        ),
      },
      { title: "수집 시간", description: inspectionData.collectionTime },
      { title: "수집 방법", description: inspectionData.collectionMethod },
      {
        title: "삭제 여부",
        description: getIsDeletedLabel(inspectionData.isDeleted),
      },
      { title: "HASH", description: inspectionData.hash },
      {
        title: "메타데이터 (Description)",
        description: inspectionData.metadataDescription,
      },
    ],
    [inspectionData, getIsDeletedLabel]
  );

  // Chi tiết Rag
  const detailsRag: IDetailItem[] = useMemo(
    () => [
      { title: "데이터 이름", description: inspectionData.dataName },
      { title: "관리 ID", description: inspectionData.managementId },
      { title: "데이터 형태", description: inspectionData.dataType },
      { title: "출처 시스템", description: inspectionData.dataSource },
      { title: "버전", description: inspectionData.version },
      { title: "수집 방법", description: inspectionData.collectionMethod },
      {
        title: "삭제 여부",
        description: getIsDeletedLabel(inspectionData.isDeleted),
      },
      { title: "HASH", description: inspectionData.hash },
      {
        title: "메타데이터 (Description)",
        description: inspectionData.metadataDescription,
      },
    ],
    [inspectionData, getIsDeletedLabel]
  );

  // Subfile List columns
  const columnsSubfileList: GridColDef[] = useMemo(
    () => [
      { field: "fileName", headerName: "파일 이름", flex: 1 },
      { field: "type", headerName: "파일 경로", flex: 1 },
      {
        field: "createDate",
        headerName: "수정 날짜",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">
            {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
          </Typography>
        ),
      },
      {
        field: "uploaderId",
        headerName: "유형",
        flex: 1,
      },
      {
        field: "fileSize",
        headerName: "Size",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">{value || "-"}MB</Typography>
        ),
      },
    ],
    []
  );

  // Data History columns
  const columnsDataHistory = useMemo(
    () => [
      { field: "collectionDate", headerName: "수집 일자", flex: 1 },
      { field: "sequence", headerName: "Seq.", flex: 1 },
      { field: "collectionMethod", headerName: "수집 방법", flex: 1 },
      { field: "dataId", headerName: "데이터 관리 번호", flex: 1 },
      { field: "dataName", headerName: "데이터 이름", flex: 1 },
      { field: "creationUser", headerName: "생성일자/사용자", flex: 1 },
    ],
    []
  );

  // Related Check Items columns
  const columnsRelatedCheckItems = useMemo(
    () => [
      { field: "itemName", headerName: "항목 이름", flex: 1 },
      { field: "itemType", headerName: "항목 타입", flex: 1 },
      { field: "integrationMethod", headerName: "연동 방법", flex: 1 },
      { field: "target", headerName: "점검 대상", flex: 1 },
      { field: "inspectorId", headerName: "점검자", flex: 1 },
      { field: "status", headerName: "검토 유무", flex: 1 },
      { field: "inspectionTime", headerName: "점검 시간", flex: 1 },
    ],
    []
  );

  return {
    inspectionData,
    detailsData,
    detailsRag,
    columnsSubfileList,
    columnsDataHistory,
    columnsRelatedCheckItems,
    isLoading,
    showEvaluationHistory,
    setShowEvaluationHistory,
  };
};
