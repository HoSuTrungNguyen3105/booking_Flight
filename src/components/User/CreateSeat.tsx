import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { memo, useState } from "react";
import CreateSeatModal from "./CreateSeatModal";
import { Loading } from "../../common/Loading/Loading";
type CreateSeat = {
  flightId: number;
  onChange: () => void;
  loading: boolean;
};
const CreateSeat = ({ flightId, onChange, loading }: CreateSeat) => {
  const [createFormOpen, setCreateFormOpen] = useState(false);

  return (
    <>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>
          No Seats Configured
        </Typography>
        <Typography variant="body1" mb={3}>
          You haven't created any seats yet. Would you like to create individual
          seats or generate a complete aircraft layout?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateFormOpen(true)}
            sx={{ mb: 2 }}
            startIcon={<Add />}
          >
            Create Individual Seat
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={onChange} //handleGenerateAllSeats
            sx={{ mb: 2 }}
          >
            Generate All Seats (A-F to 1-40)
          </Button>
          {/* <Button onClick={resetSeatToGetData}>Reset</Button> */}
        </Box>

        <CreateSeatModal
          flightId={flightId}
          open={createFormOpen}
          onClose={() => setCreateFormOpen(false)}
          onSuccess={() => setCreateFormOpen(false)}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default memo(CreateSeat);
