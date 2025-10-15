import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../../utils/type";
import InputTextField from "../../Input/InputTextField";
import { usePermissionChangeRole } from "../../../components/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: UserData;
}

const PermissionRoleModal = ({
  data,
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const [employeeNo, setEmployeeNo] = useState<string>("");
  const { refetchPermissionChangeRole } = usePermissionChangeRole();
  const toast = useToast();
  const handleSubmit = useCallback(async () => {
    const res = await refetchPermissionChangeRole({
      id: data?.id || 0,
      employeeNo,
    });
    if (res?.resultCode === "00") {
      toast(res?.resultMessage);
      onSuccess();
    } else {
      toast(res?.resultMessage || "Có lỗi xảy ra!", "error");
    }
  }, [data?.id, employeeNo, toast, onSuccess, onClose]);

  const renderActions = useCallback(() => {
    if (employeeNo !== String(data?.employeeNo)) {
      return null;
    }
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    );
  }, [handleSubmit, employeeNo, data?.employeeNo]);

  const renderContent = useCallback(() => {
    const renderRows = () => {
      return (
        <Stack spacing={2}>
          <Typography variant="body1">
            Nhập ID xác nhận xóa tài khoản. Ex : {String(data?.id)}
          </Typography>
          <InputTextField
            value={employeeNo}
            onChange={setEmployeeNo}
            placeholder="Nhập ID tại đây"
            sx={{ mt: 2 }}
          />
        </Stack>
      );
    };

    return <>{renderRows()}</>;
  }, [data, employeeNo]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Update user from ADMIN`}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(PermissionRoleModal);
