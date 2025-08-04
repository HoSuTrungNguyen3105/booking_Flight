import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import type { GridRowDef } from "../../DataGrid";
import type { DataDetail, IDataHistoryProps, ISubfileListProps } from "../type";
import TableSection from "../TableSection";
import BaseModal from "../../Modal/BaseModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  detailData: ISomeDataDataHistory | null;
  selectedRows: IDataHistoryProps | null;
  subfileList: ISubfileListProps[];
}

type ISomeDataInSubfilelist = GridRowDef &
  Pick<ISubfileListProps, "type" | "fileName">;

export type ISomeDataDataHistory = Omit<
  DataDetail,
  "description" | "isDeleted" | "metadata"
> & {
  explanation?: string;
};

export const customLabelsInModal: Record<keyof ISomeDataDataHistory, string> = {
  dataName: "데이터 이름",
  managementId: "관리 ID",
  dataType: "데이터 형태",
  dataSource: "데이터 출처",
  collectionMethod: "수집 방법",
  collectionTime: "수집 시간",
  explanation: "설명",
  hash: "HASH",
  evaluationHistoryLink: "평가 이력 링크",
  metadataDescription: "메타데이터 설명",
};

const DataHistoryModal = ({
  open,
  onClose,
  selectedRows,
  detailData,
  subfileList,
}: IModalStatisticalDataLearningProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={() => {}}>
          확인
        </Button>
      </Box>
    );
  }, []);

  const renderContent = useCallback(() => {
    const columnsSubfileList = useMemo(
      () => [
        { field: "fileName", headerName: "파일 이름", flex: 1 },
        { field: "type", headerName: "유형", flex: 1 },
      ],
      []
    );

    const filteredDetailData: ISomeDataDataHistory | null = detailData
      ? {
          dataName: detailData.dataName,
          managementId: detailData.managementId,
          dataType: detailData.dataType,
          dataSource: detailData.dataSource,
          collectionMethod: detailData.collectionMethod,
          collectionTime: detailData.collectionTime,
          hash: detailData.hash,
          explanation: "{RAR}",
          evaluationHistoryLink: detailData.evaluationHistoryLink ?? "",
          metadataDescription: detailData.metadataDescription ?? "",
        }
      : null;

    // hook lấy từ net nhgko thấy mẫu cũ
    const renderRows = (data: ISomeDataDataHistory | null) => {
      if (!data) return null;

      return (
        <Grid container spacing={1}>
          {Object.entries(data).map(([key, value]) => (
            <Grid size={12} key={key}>
              <Grid size={4}>
                <Typography variant="body1" color="grey.500">
                  {customLabelsInModal[key as keyof ISomeDataDataHistory] ||
                    key}
                </Typography>
              </Grid>
              <Grid size={8}>
                <Typography variant="body1">{value}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
    };

    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        <Typography variant="body1">데이터 목록</Typography>
        {renderRows(filteredDetailData)}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TableSection
            columns={columnsSubfileList}
            rows={subfileList}
            setRows={() => {}}
            isLoading={false}
            nextRowClick={false}
            handleRowClick={() => {}}
            largeThan={true}
          />
          {/* {filteredDetailData.map((detail) => (
        <DetailItem key={detail.id} detail={detail} />
      ))} */}
        </Box>
      </Box>
    );
  }, []);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq$ 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={AddCircleOutlineIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(DataHistoryModal);
