import { memo, useState } from "react";
import FlightManagementModal from "./FlightManagementModal";
import { Box, Button } from "@mui/material";

type FlightIdProps = {
  id?: number;
  onSuccess: () => void;
};

const FlightModalTriggerManagement = ({ id, onSuccess }: FlightIdProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <Box display="inline-flex">
        <Button component="span" variant="contained" onClick={handleClick}>
          {id ? "Update Flight" : "Create Flight"}
        </Button>
      </Box>

      {open && (
        <FlightManagementModal
          mode={id ? "update" : "create"}
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
          flightId={id}
          onCancel={() => setOpen(false)}
          onUpdate={() => {}}
        />
      )}
    </>
  );
};

export default memo(FlightModalTriggerManagement);
