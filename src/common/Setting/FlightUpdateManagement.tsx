import { memo, useState } from "react";
import FlightUpdateModal from "../Sample/FlightUpdateModal";
import { Box, Button } from "@mui/material";

type FlightIdProps = {
  id: number;
};

const FlightUpdateManagement = ({ id }: FlightIdProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box display="inline-flex">
        <Button
          component="span"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Update
        </Button>
      </Box>

      {open && (
        <FlightUpdateModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {}}
          flightId={id}
          onCancel={() => setOpen(false)}
          onUpdate={() => {}}
        />
      )}
    </>
  );
};

export default memo(FlightUpdateManagement);
