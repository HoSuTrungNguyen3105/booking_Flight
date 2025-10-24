import { Box, Button, Stack, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import FieldRenderer from "../../CustomRender/FieldRenderer";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { UserData } from "../../../utils/type";
import type { UserFormConfig } from "../hooks/useDataSection";

interface IUpdateUserModalProps {
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
}: IUpdateUserModalProps) => {
  const { formDetailConfig, formData, error, handleChange, handleSubmit } =
    useUpdateUser({
      onClose,
      onSuccess,
      data,
    });

  console.log("formData", formData);
  console.log("formDetailConfig", formDetailConfig);

  const renderActions = useCallback(
    () => (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    ),
    [handleSubmit, error]
  );

  const renderContent = useCallback(
    () => (
      <Stack sx={{ maxHeight: "55vh", overflowY: "auto" }}>
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
                      readOnly={field.readOnly}
                      value={formData[field.id as keyof UserFormConfig] ?? ""}
                      disabled={field.disabled}
                      options={field.options}
                      onChange={(val) =>
                        handleChange(field.id as keyof UserFormConfig, val)
                      }
                    />
                  </Box>
                ))}
              </Box>
            )
        )}
      </Stack>
    ),
    [formDetailConfig, formData, handleChange]
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Update User Information"
      subtitle="Edit the details of the selected user."
      fullWidth={true}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(UpdateUserModal);
