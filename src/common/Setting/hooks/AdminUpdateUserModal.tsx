import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import type { AdminUpdateUserForm, UserData } from "../../../utils/type";
import UpdateUserForm from "../../../components/Admin/component/UpdateUserForm";
import InputTextField from "../../Input/InputTextField";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: UserData;
}

const AdminUpdateUserModal = ({
  data,
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const [inputId, setInputId] = useState<string>("");
  const [isValidate, setIsValidate] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (String(data?.id) === inputId) {
      onSuccess();
      // onClose();
      setIsValidate(true);
    }
  }, [data?.id, inputId, onSuccess, onClose]);
  // if (isValidate) {
  //   return <UpdateUserForm data={data as AdminUpdateUserForm} />;
  // }
  // const handleSubmit = () => {}
  const renderActions = useCallback(() => {
    if (inputId !== String(data?.id)) {
      return null; // nhập sai thì không render nút
    }
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleSubmit}>
          확인
        </Button>
      </Box>
    );
  }, [handleSubmit]);

  const renderContent = useCallback(() => {
    const renderRows = () => {
      return (
        <Stack>
          <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
          <Typography variant="body1">
            Nhập ID <strong>{JSON.stringify(data)}</strong> để xác nhận xóa tài
            khoản.
          </Typography>
          <InputTextField
            value={inputId}
            onChange={setInputId}
            placeholder="Nhập ID tại đây"
            sx={{ mt: 2 }}
          />
        </Stack>
      );
    };

    return <>{renderRows()}</>;
  }, [inputId, data]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Update user from ADMIN`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AdminUpdateUserModal);
