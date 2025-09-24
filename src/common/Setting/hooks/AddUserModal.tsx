import { Box, Button, Divider, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import type { DataDetail } from "../type";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import FieldRenderer from "../../CustomRender/FieldRenderer";
import { useCreateUser } from "./useCreateUser";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal = ({
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const { formDetailConfig, updateInfo, handleChange, handleSubmit } =
    useCreateUser({
      onClose,
      onSuccess,
    });

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
        <>
          {formDetailConfig
            .filter((fieldItem) => !fieldItem.disabled)
            .map(({ disabled, fields }) => (
              <Box key={fields.id}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fields.label}
                </Typography>

                <FieldRenderer
                  {...fields}
                  disabled={disabled}
                  value={updateInfo[fields.id as keyof typeof updateInfo] ?? ""}
                  placeholder={fields.placeholder}
                  onChange={(val) => handleChange(fields.id, val)}
                />
              </Box>
            ))}
        </>
      );
    };

    return (
      <>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        {renderRows()}
      </>
    );
  }, [formDetailConfig, updateInfo]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="원본 데이터, 통계 데이터 학습 Seq$ 상세 정보"
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AddUserModal);
