import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import InputTextField from "../../../../../common/Input/InputTextField";
import { ResponseCode } from "../../../../../utils/response";
import { useUpdatePriceSeatInFlightByIds } from "../../../../../context/Api/usePostApi";
import { useToast } from "../../../../../context/ToastContext";

type UpdateSeatPriceProps = {
  flightId: number;
  flightNo: string;
  onReturn: () => void;
};

const UpdateSeatPrice: React.FC<UpdateSeatPriceProps> = ({
  flightId,
  flightNo,
  onReturn,
}) => {
  //   const [flightId, setFlightId] = useState<number | "">(flightId);
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // const [message, setMessage] = useState<{
  //   type: "success" | "error";
  //   text: string;
  // } | null>(null);

  const { refetchUpdatePriceSeatInFlightByIds } =
    useUpdatePriceSeatInFlightByIds();

  const handleUpdate = async () => {
    if (!flightId || !price) {
      toast("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      const res = await refetchUpdatePriceSeatInFlightByIds({
        flightId: Number(flightId),
        price: Number(price),
      });

      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res?.resultMessage || "Cập nhật giá ghế thành công!", "success");
        onReturn();
      } else {
        toast(res?.resultMessage || "Có lỗi xảy ra", "error");
      }
    } catch (err) {
      console.error("Có lỗi xảy ra", err);
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
    </Paper>
  );
};

export default UpdateSeatPrice;
