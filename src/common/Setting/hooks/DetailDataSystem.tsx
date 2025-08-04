import { Box, Grid, Typography } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "../../Button/Button";
import {
  customLabels,
  type Detail,
  type IDataHistoryProps,
} from "../DataSecure";
import TableSection from "../TableSection";
import type { GridRowDef } from "../../DataGrid";
import BaseModal from "../../Modal/BaseModal";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InputField from "../../Input/InputField";
import InputTextField from "../../Input/InputTextField";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  detailData: Detail | null;
  selectedRows: IDataHistoryProps | null;
  // files: {
  //   name: string[];
  // };
}

type DataExample = GridRowDef & {
  category: string;
  fileName: string;
};
const DetailDataSystemModal = ({
  open,
  onClose,
  onSuccess,
  // files,
  selectedRows,
  detailData,
}: IModalStatisticalDataLearningProps) => {
  // Action nút dưới modal
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button
          appearance="contained"
          priority="normal"
          label="삭제"
          onClick={() => {}}
        />
      </Box>
    );
  }, []);

  // Render các dòng key-value từ detailData
  const renderDetailRows = (data: Detail | null) => {
    if (!data) return null;
    return (
      <Grid container spacing={1}>
        {Object.entries(data).map(([key, value]) => (
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
    );
  };
  // const [formData, setFormData] = useState({
  //         User: ['user.tsx'],
  //         Admin: ['hasText.tsx'],
  //         Guest: ['hasText.tsx'],
  //       });

  type Role = "User" | "Admin" | "Guest";

  type FormDataType = {
    [key in Role]: string[];
  };

  const [formData, setFormData] = useState<FormDataType>({
    User: ["user.tsx"],
    Admin: ["hasText.tsx"],
    Guest: ["hasText.tsx"],
  });

  // Hiển thị danh sách file và ô nhập
  const renderFilesAndButton = (
    functionText: string,
    selectedRows: string[]
  ) => {
    return (
      <Box display="flex" flexDirection="column" minHeight="15vh">
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {functionText}
        </Typography>
        {/* <Box display="flex" flexDirection="row" width="100%">
          {files?.name?.length > 0 && (
            <Box display="flex" flexDirection="column" gap={1} flex={1} mr={2}>
              {files.name.map((item, i) => (
                <InputField key={i} value={item} />
              ))}
            </Box>
          )}
        </Box> */}
        <Grid container size={12}>
          <Grid size={4}>
            <Typography variant="body2" color="grey.500">
              점검 설명
            </Typography>
          </Grid>
          <Grid size={8}>
            {/* {selectedRows?.name?.length > 0 && ( */}
            <Box display="flex" flexDirection="column" gap={1}>
              {selectedRows?.map((item: any, i: any) => (
                <InputTextField key={i} value={item} />
              ))}
            </Box>
            {/* )} */}
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render nội dung chính của modal
  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="100%">
        <Typography component="p" variant="body2" fontWeight="bold" mb={1}>
          기본 정보
        </Typography>
        {renderDetailRows(detailData)}
        <Typography component="p" variant="body2" fontWeight="bold" mt={3}>
          임시 비밀번호
        </Typography>
        {renderFilesAndButton("User role files", formData.User)}
        <Box mt={1}>
          {renderFilesAndButton("Admin role files", formData.Admin)}
        </Box>
        <Box mt={1}>
          {renderFilesAndButton("Guest role files", formData.Guest)}
        </Box>
      </Box>
    );
  }, [detailData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq$ 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(DetailDataSystemModal);
