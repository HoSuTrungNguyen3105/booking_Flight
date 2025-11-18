import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { CreateFlightMealProps, DataFlight } from "../../../../utils/type";
import { useGetMeal } from "../../../../context/Api/useGetApi";
import { useCreateFlightMeal } from "../../../../context/Api/usePostApi";
import { ResponseCode } from "../../../../utils/response";
import _ from "lodash";
import InputNumber from "../../../../common/Input/InputNumber";
import SelectDropdown, {
  type ActionType,
} from "../../../../common/Dropdown/SelectDropdown";
import { useToast } from "../../../../context/ToastContext";

interface FlightMealProps {
  flightId: number;
  name: string;
}

export default function AddMealToFlight({ flightId, name }: FlightMealProps) {
  const [data, setData] = useState<CreateFlightMealProps>({
    flightId: flightId || 0,
    mealId: 0,
    quantity: 1,
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const { mealData } = useGetMeal();
  const { refetchAddMealToFlight } = useCreateFlightMeal();
  const toast = useToast();
  const meals = mealData?.list || [];

  const optionMeals: ActionType[] = meals.map((e) => ({
    label: e.name,
    value: e.id,
  }));

  const priceOptions = [
    { label: "20,000", value: 20000 },
    { label: "30,000", value: 30000 },
    { label: "50,000", value: 50000 },
    { label: "100,000", value: 100000 },
  ];

  const onSubmit = async () => {
    if (!data.mealId || !data.quantity) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await refetchAddMealToFlight(data);

      if (res?.resultCode === ResponseCode.SUCCESS) {
        setSuccessMsg("Thêm Meal vào Flight thành công!");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Thêm Meal vào Chuyến Bay {name}
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <SelectDropdown
          placeholder="Chọn Meal"
          value={data.mealId}
          options={optionMeals}
          onChange={(e) => setData({ ...data, mealId: Number(e) })}
        />

        {priceOptions.map((p) => (
          <FormControlLabel
            key={p.value}
            control={
              <Checkbox
                checked={selectedPrice === p.value}
                onChange={(e) => {
                  if (selectedPrice && selectedPrice !== p.value) {
                    toast("Chỉ chọn một giá duy nhất!");
                    return;
                  }
                  setSelectedPrice(e.target.checked ? p.value : null);
                }}
              />
            }
            label={p.label}
          />
        ))}

        <InputNumber
          placeholder="Số lượng"
          value={data.quantity}
          min={1}
          onChange={(e) =>
            setData({
              ...data,
              quantity: Math.max(1, Number(e)),
            })
          }
        />

        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={onSubmit}
          sx={{ py: 1.2, fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={22} /> : "Thêm Meal"}
        </Button>
      </Box>
    </Paper>
  );
}
