import { memo, useState } from "react";
import FlightUpdateModal from "../Sample/FlightUpdateModal";
import { Box, Button } from "@mui/material";

type FlightIdProps = {
  id?: number;
  onSuccess: () => void;
};

const FlightModalTriggerManagement = ({ id, onSuccess }: FlightIdProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
    setOpen(true);
  };

  return (
    <>
      <Box display="inline-flex">
        <Button
          component="span"
          variant="contained"
          onClick={handleClick} // Sử dụng hàm handleClick đã sửa
        >
          {id ? "Update Flight" : "Create Flight"}
        </Button>
      </Box>

      {open && (
        <FlightUpdateModal
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
