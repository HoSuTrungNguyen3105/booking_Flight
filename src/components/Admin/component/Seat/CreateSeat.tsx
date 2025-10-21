import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { memo, useState } from "react";
import { useSeatCreate, type CreateSeatDto } from "../../../Api/usePostApi";
import CreateSeatModal from "./CreateSeatModal";

type CreateSeatProps = {
  flightId: number;
  loading: boolean;
  onSuccess: () => void;
};

const CreateSeat = ({ flightId, loading, onSuccess }: CreateSeatProps) => {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [createState] = useState<CreateSeatDto>();
  const [createMode, setCreateMode] = useState<"multi" | "one" | null>(null);

  const { refetchSeatCreate } = useSeatCreate();

  const handleCreateSeat = async () => {
    try {
      const payload = {
        flightId,
        ...(createMode === "multi" && {
          isBooked: false,
          seatRow: createState?.seatRow,
          seatNumber: createState?.seatNumber,
        }),
      };

      const res = await refetchSeatCreate(payload);
      if (res?.resultCode === "00") {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating seat:", err);
    }
  };

  return (
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
          onClick={() => {
            setCreateMode("multi");
            handleCreateSeat();
          }}
          sx={{ mb: 2 }}
          startIcon={<Add />}
        >
          Generate All Seats (A-F to 1-40)
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setCreateMode("one");
            setCreateFormOpen(true);
          }}
          sx={{ mb: 2 }}
        >
          Create Individual Seat
        </Button>
      </Box>

      <CreateSeatModal
        flightId={flightId}
        onChange={handleCreateSeat}
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        onSuccess={() => setCreateFormOpen(false)}
        loading={loading}
      />
    </Box>
  );
};

export default memo(CreateSeat);
