import { useState } from "react";
import { Box, Button } from "@mui/material";
import CreateTerminalDialog from "../InfrastructureEntities/modal/CreateTerminalDialog";

const AirportManagementDetail = () => {
  const [createTerminalDialogOpen, setCreateTerminalDialogOpen] =
    useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        onClick={() => setCreateTerminalDialogOpen(true)}
        sx={{ mb: 3 }}
      >
        Tạo Terminal Mới
      </Button>

      {/* <FacilityManagement /> */}

      <CreateTerminalDialog
        open={createTerminalDialogOpen}
        onClose={() => setCreateTerminalDialogOpen(false)}
        onSuccess={() => {
          console.log("Terminal created successfully");
        }}
      />
    </Box>
  );
};

export default AirportManagementDetail;
