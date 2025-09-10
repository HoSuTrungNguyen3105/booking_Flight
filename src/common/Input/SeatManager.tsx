import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

export type SeatType = "ECONOMY" | "BUSINESS" | "FIRST";

interface Seat {
  id: number;
  seatNumber: number;
  seatRow: string;
  isBooked: boolean;
  type: SeatType;
}

interface Flight {
  id: number;
  flightNo: string;
}

interface SeatManagerProps {
  flightList: Flight[];
  fetchSeats: (flightId: number) => Promise<Seat[]>;
  addSeat: (
    flightId: number,
    seatRow: string,
    seatNumber: number,
    type: SeatType
  ) => Promise<void>;
}

export default function SeatManager({
  flightList,
  fetchSeats,
  addSeat,
}: SeatManagerProps) {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [newSeatRow, setNewSeatRow] = useState("");
  const [newSeatNumber, setNewSeatNumber] = useState<number>(1);
  const [newSeatType, setNewSeatType] = useState<SeatType>("ECONOMY");

  useEffect(() => {
    if (selectedFlight !== null) {
      fetchSeats(selectedFlight).then(setSeats);
    }
  }, [selectedFlight, fetchSeats]);

  const handleAddSeat = async () => {
    if (!selectedFlight) return;
    await addSeat(selectedFlight, newSeatRow, newSeatNumber, newSeatType);
    const updatedSeats = await fetchSeats(selectedFlight);
    setSeats(updatedSeats);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Quản lý ghế máy bay
      </Typography>

      <TextField
        select
        label="Chọn chuyến bay"
        value={selectedFlight ?? ""}
        onChange={(e) => setSelectedFlight(Number(e.target.value))}
        sx={{ mb: 2, width: 200 }}
      >
        {flightList.map((f) => (
          <MenuItem key={f.id} value={f.id}>
            {f.flightNo}
          </MenuItem>
        ))}
      </TextField>

      {selectedFlight && (
        <>
          <Box mb={2}>
            <Typography variant="subtitle1">Thêm ghế mới</Typography>
            <TextField
              label="Hàng"
              value={newSeatRow}
              onChange={(e) => setNewSeatRow(e.target.value)}
              sx={{ mr: 1, width: 80 }}
            />
            <TextField
              label="Số ghế"
              type="number"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(Number(e.target.value))}
              sx={{ mr: 1, width: 100 }}
            />
            <TextField
              select
              label="Loại ghế"
              value={newSeatType}
              onChange={(e) => setNewSeatType(e.target.value as SeatType)}
              sx={{ mr: 1, width: 150 }}
            >
              <MenuItem value="ECONOMY">Economy</MenuItem>
              <MenuItem value="BUSINESS">Business</MenuItem>
              <MenuItem value="FIRST">First</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleAddSeat}>
              Thêm ghế
            </Button>
          </Box>

          <Grid container spacing={1}>
            {seats.map((seat) => (
              <Grid key={seat.id}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: seat.isBooked ? "red" : "green",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {seat.seatRow}
                  {seat.seatNumber}
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
