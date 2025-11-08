import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import InputTextField from "../../../../../common/Input/InputTextField";
import { ResponseCode } from "../../../../../utils/response";
import { useUpdatePriceSeatInFlightByIds } from "../../../../../context/Api/usePostApi";

type UpdateSeatPriceProps = {
  flightId: number;
  flightNo: string;
};

const UpdateSeatPrice: React.FC<UpdateSeatPriceProps> = ({
  flightId,
  flightNo,
}) => {
  //   const [flightId, setFlightId] = useState<number | "">(flightId);
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { refetchUpdatePriceSeatInFlightByIds } =
    useUpdatePriceSeatInFlightByIds();

  const handleUpdate = async () => {
    if (!flightId || !price) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await refetchUpdatePriceSeatInFlightByIds({
        flightId: Number(flightId),
        price: Number(price),
      });

      if (res?.resultCode === ResponseCode.SUCCESS) {
        setMessage({ type: "success", text: "Cập nhật giá ghế thành công!" });
      } else {
        setMessage({
          type: "error",
          text: res?.resultMessage || "Cập nhật thất bại.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Có lỗi xảy ra." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 450,
        mx: "auto",
        mt: 8,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Cập nhật giá ghế theo chuyến bay
      </Typography>

      <InputTextField value={flightNo} sx={{ mb: 2 }} />

      <TextField
        fullWidth
        label="Giá mới (VNĐ)"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        fullWidth
        disabled={loading}
        sx={{ py: 1.2, fontWeight: 600, borderRadius: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Cập nhật giá"
        )}
      </Button>

      {message && (
        <Alert severity={message.type} sx={{ mt: 3 }}>
          {message.text}
        </Alert>
      )}
    </Paper>
  );
};

export default UpdateSeatPrice;
