import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { CreateFlightMealProps } from "../../../../utils/type";
import { ResponseCode } from "../../../../utils/response";
import _ from "lodash";
import InputNumber from "../../../../common/Input/InputNumber";
import SelectDropdown, {
  type ActionType,
} from "../../../../common/Dropdown/SelectDropdown";
import { useToast } from "../../../../context/ToastContext";
import InputTextField from "../../../../common/Input/InputTextField";
import {
  useCreateFlightMeal,
  useGetMeal,
} from "../../../../context/Api/MealApi";

interface FlightMealProps {
  flightId: number;
  name: string;
}

export default function AddMealToFlight({ flightId, name }: FlightMealProps) {
  const [data, setData] = useState<CreateFlightMealProps>({
    flightMealCode: "",
    flightId: flightId || 0,
    mealId: 0,
    quantity: 1,
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const generateRandomCode = (length: number = 3): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  // Gen code on mount
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      mealCode: generateRandomCode(),
    }));
  }, []);

  const handleGenerateCode = () => {
    setData((prev) => ({
      ...prev,
      mealCode: generateRandomCode(),
    }));
  };

  const { mealData } = useGetMeal();
  const { refetchAddMealToFlight } = useCreateFlightMeal();
  const toast = useToast();
  const meals = mealData?.list || [];

  const optionMeals: ActionType[] = meals.map((e) => ({
    label: e.name,
    value: e.id,
  }));

  const priceOptions = [
    { label: "20,000 VND", value: 20000 },
    { label: "30,000 VND", value: 30000 },
    { label: "50,000 VND", value: 50000 },
    { label: "100,000 VND", value: 100000 },
    { label: "150,000 VND", value: 150000 },
  ];

  const onSubmit = async () => {
    if (!data.mealId || !data.quantity) {
      toast("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await refetchAddMealToFlight(data);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage, "success");
      } else {
        toast(res?.resultMessage || "Có lỗi xảy ra", "error");
      }
    } catch (err: any) {
      console.error(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 1, maxWidth: "100%", mx: "auto", borderRadius: 1 }}>
      <Typography variant="h6" fontWeight={700} mb={1}>
        Thêm Meal vào Chuyến Bay {name}
      </Typography>

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

        <InputTextField
          placeholder="Meal Code"
          value={data.flightMealCode}
          onChange={(e) => setData({ ...data, flightMealCode: e })}
          maxValueLength={3}
        />

        <Button
          variant="contained"
          onClick={handleGenerateCode}
          sx={{ width: "fit-content", alignSelf: "flex-start", mt: -1 }}
        >
          Reset meal code
        </Button>

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
