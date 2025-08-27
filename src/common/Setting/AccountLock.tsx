import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useLockAccount } from "./hooks/useLockAccount";
import type { UserData } from "../../utils/type";
import BaseModal from "../Modal/BaseModal";
import CheckBoxSelector from "./JobTypeSelector";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}
const jobOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "UI/UX Designer",
  "Project Manager",
  "QA Tester",
  "DevOps Engineer",
  "Data Scientist",
];
const AccountLockModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const {
    formData,
    userInfoLines,
    handleLockAccount,
    error,
    title,
    buttonTitle,
    subtitle,
  } = useLockAccount({
    onClose,
    onSuccess,
    user,
  });
  // const handleSubmit = () => {}
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleLockAccount}>
          {buttonTitle}
        </Button>
      </Box>
    );
  }, [buttonTitle, handleLockAccount]);
  // console.log("Đang gửi:", JSON.stringify(formData));

  const renderContent = useCallback(() => {
    // hook lấy từ net nhgko thấy mẫu cũ
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        <Typography variant="body1">데이터 목록</Typography>
        <CheckBoxSelector
          placeholder="Chọn loại công việc"
          value={selectedJobs}
          onChange={setSelectedJobs}
          valueInCheckBox={jobOptions}
        />
      </Box>
    );
  }, []);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AccountLockModal);
