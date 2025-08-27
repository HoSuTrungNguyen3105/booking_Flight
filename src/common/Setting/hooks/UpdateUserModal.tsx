import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import FieldRenderer from "../../CustomRender/FieldRenderer";
import { useUpdateUser } from "./useUpdateUser";
import type { UserData } from "../../../utils/type";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: UserData;
}

const UpdateUserModal = ({
  data,
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const { formDetailConfig, formData, handleChange, handleSubmit } =
    useUpdateUser({
      onClose,
      onSuccess,
      data,
    });
  // const handleSubmit = () => {}
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleSubmit}>
          확인
        </Button>
      </Box>
    );
  }, [handleSubmit]);

  const renderContent = useCallback(() => {
    const renderRows = () => {
      return (
        <Stack>
          <Typography variant="body1">데이터 목록</Typography>
          {formDetailConfig
            .filter((fieldItem) => !fieldItem.disabled)
            .map(({ disabled, fields }) => (
              <Box key={fields.id}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fields.label}
                </Typography>

                <FieldRenderer
                  {...fields}
                  value={formData[fields.id as keyof typeof formData] ?? ""}
                  onChange={(val) => handleChange(fields.id, val)}
                />
              </Box>
            ))}
        </Stack>
      );
    };

    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        {renderRows()}
      </Box>
    );
  }, [formDetailConfig, formData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq$ 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(UpdateUserModal);
