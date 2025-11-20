import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import { BookingStatus, type Booking } from "../../../../utils/type";
import InputTextField from "../../../../common/Input/InputTextField";

const BookingPassengerSearch: React.FC = () => {
  const [code, setCode] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooking = async () => {
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      const res = await axios.get<Booking>(
        `/sys/booking/search?code=${code}&emailOrPhone=${emailOrPhone}`
      );
      setBooking(res.data);
    } catch (err: any) {
      setError(err.response?.data || "Không tìm thấy booking");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!booking) return;
    try {
      const res = await axios.post(`/api/booking/cancel/${booking.id}`);
      setBooking(res.data);
      alert("Booking đã hủy thành công!");
    } catch (err: any) {
      alert(err.response?.data || "Hủy booking thất bại");
    }
  };

  const downloadPDF = () => {
    if (!booking) return;
    const doc = new jsPDF();
    doc.text(`Booking Code: ${booking.bookingCode}`, 10, 10);
    doc.text(`Passenger: ${booking.passenger.fullName}`, 10, 20);
    doc.text(`Flight: ${booking.flight.flightNo}`, 10, 30);
    doc.text(`Date: ${booking.flight.scheduledDeparture}`, 10, 40);
    doc.text(`Price: ${booking.seatPrice}`, 10, 50);
    doc.text(`Status: ${booking.status}`, 10, 60);
    doc.save(`${booking.bookingCode}.pdf`);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Tra cứu booking</Typography>
        <InputTextField
          placeholder="Mã đặt chỗ"
          value={code}
          onChange={(e) => setCode(e)}
        />
        <InputTextField
          placeholder="Email hoặc Số điện thoại"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e)}
        />
        <Button variant="contained" onClick={searchBooking} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Tra cứu"}
        </Button>

        {error && <Typography color="error">{error}</Typography>}

        {booking && (
          <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography>Mã đặt chỗ: {booking.bookingCode}</Typography>
            <Typography>Hành khách: {booking.passenger.fullName}</Typography>
            <Typography>Chuyến bay: {booking.flight.flightNo}</Typography>
            <Typography>
              Ngày bay: {booking.flight.scheduledDeparture}
            </Typography>
            <Typography>Giá: {booking.seatPrice}</Typography>
            <Typography>Trạng thái: {booking.status}</Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {booking.status === BookingStatus.CONFIRMED && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={cancelBooking}
                >
                  Hủy vé
                </Button>
              )}
              <Button variant="contained" onClick={downloadPDF}>
                In vé PDF
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default BookingPassengerSearch;
