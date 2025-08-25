import { Box, Grid, Typography } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import { Button } from "../../Button/Button";
import type { Detail, IDataHistoryProps } from "../DataSecure";
import TableSection from "../TableSection";
import type { GridRowDef } from "../../DataGrid";
import BaseModal from "../../Modal/BaseModal";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  detailData: Detail | null;
  selectedRows: IDataHistoryProps | null;
}

const customLabels: Record<keyof Detail, string> = {
  TITLE: "제목", // Tiêu đề
  status: "상태", // Trạng thái
  time: "시간", // Thời gian
  inspection: "검사", // Kiểm tra
  datStatus: "DAT 상태", // Tình trạng DAT
  computerTime: "컴퓨터 시간", // Giờ máy tính
  checklist: "체크리스트", // Danh sách kiểm tra
  itemsStatus: "항목 상태", // Trạng thái mục
  itemsScope: "항목 범위", // Phạm vi mục
};

type DataExample = GridRowDef & {
  category: string;
  fileName: string;
};

const DetailedInformationModal = ({
  open,
  onClose,
  onSuccess,
  selectedRows,
  detailData,
}: IModalStatisticalDataLearningProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button
          appearance="contained"
          priority="normal"
          label="삭제"
          onClick={() => {}}
          // disabled={true}
        />
      </Box>
    );
  }, []);

  const renderContent = useCallback(() => {
    const columnsSubFileList = useMemo(
      () => [
        { field: "category", headerName: "유형", flex: 1 },
        { field: "fileName", headerName: "파일 이름", flex: 1 },
      ],
      []
    );

    const DATA_ROWS: DataExample[] = Array.from({ length: 5 }, (_, index) => ({
      category: "원본 데이터",
      fileName: "원본데이터.csv",
      id: (index + 1).toString(),
    }));

    const renderRows = (data: Detail | null) => {
      if (!data) return null;
      return (
        <Box>
          <Grid container spacing={1}>
            {detailData &&
              Object.entries(data).map(([key, value]) => (
                <Grid container size={12} key={key}>
                  <Grid size={4}>
                    <Typography variant="body2" color="grey.500">
                      {customLabels[key as keyof Detail]}
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <Typography variant="body2">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Box>
      );
    };

    return (
      <Box maxHeight="30rem">
        <Box>
          <Typography component="p" variant="body2">
            기본 정보
          </Typography>
          {renderRows(detailData)}
          <Typography component="p" variant="body2">
            임시 비밀번호
          </Typography>
          <Box gap="8px">
            <Box paddingRight="0px">
              <TableSection
                columns={columnsSubFileList}
                rows={DATA_ROWS}
                setRows={() => {}}
                isLoading={false}
                nextRowClick={false}
                handleRowClick={() => {}}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }, [selectedRows, detailData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq${selectedRows?.sequence} 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(DetailedInformationModal);
