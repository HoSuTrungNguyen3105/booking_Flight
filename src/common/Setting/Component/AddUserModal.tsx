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

  const renderActions = useCallback(
    () => (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleSubmit}>
          Confirm
        </Button>
      </Box>
    ),
    [handleSubmit, error]
  );

  const renderContent = useCallback(
    () => (
      <>
        {formDetailConfig?.map(
          (section, index) =>
            !section.visible && (
              <Box key={index} mb={2}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {section.label}
                </Typography>

                {section.fields.map((field, fieldIndex) => (
                  <Box key={fieldIndex} mb={1}>
                    <FieldRenderer
                      type={field.type}
                      value={updateInfo[field.id as keyof UserFormConfig] ?? ""}
                      disabled={field.disabled}
                      options={field.options}
                      placeholder={field.placeholder}
                      onChange={(val) =>
                        handleChange(field.id as keyof UserFormConfig, val)
                      }
                    />
                  </Box>
                ))}
              </Box>
            )
        )}
      </>
    ),
    [formDetailConfig, updateInfo, handleChange]
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="User Information"
      subtitle="Fill in the details"
      fullWidth={true}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AddUserModal);
