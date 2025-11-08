import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { memo, useState } from "react";
import {
  useSeatCreate,
  type CreateSeatDto,
} from "../../../../../context/Api/usePostApi";
import CreateSeatModal from "../modal/CreateSeatModal";
import { getMessage, ResponseCode } from "../../../../../utils/response";
import { useToast } from "../../../../../context/ToastContext";

type CreateSeatProps = {
  flightId: number;
  onSuccess: () => void;
};

const CreateSeat = ({ flightId, onSuccess }: CreateSeatProps) => {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [createState, setCreateState] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    isBooked: false,
    size: 40,
    flightId,
  });
  const [createMode, setCreateMode] = useState<"multi" | "one" | null>(null);
  const toast = useToast();
  const { refetchSeatCreate } = useSeatCreate();

  const handleCreateSeat = async () => {
    try {
      const payload = {
        flightId,
        ...(createMode !== "multi" && {
          isBooked: false,
          seatRow: createState?.seatRow,
          seatNumber: createState?.seatNumber,
        }),
      };

      const res = await refetchSeatCreate(payload);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage || getMessage(res.resultCode));
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
        setCreateState={setCreateState}
        createState={createState}
        onChange={handleCreateSeat}
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        onSuccess={() => setCreateFormOpen(false)}
      />
    </Box>
  );
};

export default memo(CreateSeat);
