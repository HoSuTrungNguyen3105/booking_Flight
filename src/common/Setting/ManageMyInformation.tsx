import { Box, Button, Stack } from "@mui/material";
// import DialogConfirm from 'components/atoms/DialogConfirm';
// import ErrorMessagePart from 'components/atoms/ErrorMessagePart';
// import Loading from 'components/atoms/Loading';
// import UserInfoSection from 'components/atoms/UserInfoSection';
// import ManagePathAdminSection from 'components/molecules/ManagePathAdminSection';
// import TransferAuthoritySection from 'components/molecules/TransferAuthoritySection';
// import DataAccessPermissionSection from 'components/molecules/DataAccessPermissionSection';
// import TimeInfoSection from 'components/molecules/TimeInfoSection';
import { useCallback } from "react";

const ManageMyInformation = () => {
  const [myInfo, setMyInfo] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toggleOpenModal, setToggleOpenModal] = useState(false);

  const handleRestore = useCallback(() => {
    // Logic to handle restore
  }, []);

  const handleUpdateMyInfo = useCallback(() => {
    // Logic to update myInfo
  }, [myInfo]);

  const handleRefresh = useCallback(() => {
    // Logic to refresh data
  }, []);

  const renderButtonSection = useCallback(() => {
    return (
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={handleRefresh}>
          Refresh
        </Button>
        <Button
          variant="outlined"
          disabled={!hasChanges}
          onClick={toggleOpenModal}
        >
          Save Changes
        </Button>
      </Stack>
    );
  }, [hasChanges]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: 1,
        borderColor: "divider",
      }}
    >
      <UserInfoSection info={myInfo} onChange={handleUpdateMyInfo} />
      <ManagePathAdminSection />
      <DataAccessPermissionSection />
      <TransferAuthoritySection
        info={myInfo}
        onOpenModal={() => setToggleOpenModal(!toggleOpenModal)}
      />
      <TimeInfoSection />
      {renderButtonSection()}
      <DialogConfirm
        icon="warning"
        open={toggleOpenModal}
        onClose={() => setToggleOpenModal(false)}
        onConfirm={async () => {
          // Confirm logic
          const response = await api.requestTransferAdmin({ data: myInfo });
          if (response.approve) {
            handleRefresh();
          }
        }}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        confirmLabel="Xác nhận"
      />
      {isFetching && <Loading />}
      {error && <ErrorMessagePart error={error} />}
    </Box>
  );
};

export default ManageMyInformation;
