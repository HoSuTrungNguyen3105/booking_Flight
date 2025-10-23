import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { memo, useCallback } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import FieldRenderer from "../../CustomRender/FieldRenderer";
import { useCreateUser } from "../hooks/useCreateUser";
import type { UserFormConfig } from "../hooks/useDataSection";
import { InfoOutlined } from "@mui/icons-material";

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
      <Grid container spacing={2}>
        {/* Form chính */}
        <Grid size={8}>
          {formDetailConfig?.map(
            (section, index) =>
              !section.visible && (
                <Box key={index} mb={2}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                    {section.label}
                  </Typography>

                  {section.fields.map((field, fieldIndex) => (
                    <Box key={fieldIndex} mb={1}>
                      <FieldRenderer
                        type={field.type}
                        value={
                          updateInfo[field.id as keyof UserFormConfig] ?? ""
                        }
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
        </Grid>

        <Grid size={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              <InfoOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
              Hướng dẫn
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Alert severity="info">
                <Typography fontWeight={600}>Gán bằng Email</Typography>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>Người dùng đã có tài khoản</li>
                  <li>Email hợp lệ và đã xác thực</li>
                  <li>Chưa có quyền nhân viên</li>
                </ul>
              </Alert>

              <Alert severity="success">
                <Typography fontWeight={600}>Tạo tài khoản thủ công</Typography>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>Nhập đầy đủ: họ tên, email, mật khẩu</li>
                  <li>
                    Mật khẩu mạnh: ≥ 8 ký tự, 1 chữ hoa & 1 ký tự đặc biệt
                  </li>
                </ul>
              </Alert>
            </Stack>
          </Card>
        </Grid>
      </Grid>
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
      maxWidth="lg"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AddUserModal);
