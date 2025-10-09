import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import FieldRenderer from "../../CustomRender/FieldRenderer";
import { useCreateUser } from "../hooks/useCreateUser";
import type { UserFormConfig } from "../hooks/useDataSection";

interface IAddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal = ({ open, onClose, onSuccess }: IAddUserModalProps) => {
  const { formDetailConfig, updateInfo, error, handleChange, handleSubmit } =
    useCreateUser({
      onClose,
      onSuccess,
    });

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {error && <Typography>{error}</Typography>}
        <Button variant="outlined" onClick={handleSubmit}>
          확인
        </Button>
      </Box>
    );
  }, [handleSubmit]);

  const renderContent = useCallback(() => {
    return (
      <>
        {formDetailConfig?.map(
          (fields, index) =>
            !fields.visible && (
              <Box key={index}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fields.label}
                </Typography>

                {fields.fields.map((field, fieldIndex) => (
                  <>
                    <FieldRenderer
                      key={fieldIndex}
                      type={field.type}
                      value={updateInfo[field.id as keyof UserFormConfig] ?? ""}
                      disabled={field.disabled}
                      options={field.options}
                      onChange={(val) =>
                        handleChange(field.id as keyof UserFormConfig, val)
                      }
                    />
                    <Typography>{error}</Typography>
                  </>
                ))}
              </Box>
            )
        )}
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
