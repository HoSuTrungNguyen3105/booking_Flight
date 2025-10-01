import React, { memo, useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  Divider,
  Alert,
  Fade,
  FormHelperText,
  Stack,
  Checkbox,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  LunchDining,
  DinnerDining,
  SignalWifi1BarLock,
} from "@mui/icons-material";
import InputTextField from "../Input/InputTextField";
import InputTextArea from "../Input/InputTextArea";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";

interface MealFormProps {
  onSubmit: (data: any) => void;
}

const MealForm: React.FC<MealFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    mealType: "",
    description: "",
    price: "",
    isAvailable: true,
  });

  const mealOptions: ActionType[] = [
    {
      value: "Breakfast",
      label: "Bữa sáng",
      icon: <CategoryIcon color="action" />,
    },
    { value: "Lunch", label: "Bữa trưa", icon: <LunchDining color="action" /> },
    {
      value: "Dinner",
      label: "Bữa tối",
      icon: <DinnerDining color="action" />,
    },
    {
      value: "Snack",
      label: "Đồ ăn nhẹ",
      icon: <SignalWifi1BarLock color="action" />,
    },
  ];

  const [errors, setErrors] = useState({
    name: false,
    mealType: false,
    price: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !form.name,
      mealType: !form.mealType,
      price: form.price ? Number(form.price) < 0 : false,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // convert price to number or null
    const data = {
      ...form,
      price: form.price ? Number(form.price) : null,
    };

    onSubmit(data);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Stack
      sx={{
        maxWidth: "100%",
        // margin: "2rem auto",
        borderRadius: 1,
        overflow: "hidden",
        background: "white",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          //   background: "linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)",
          //   color: "white",
          padding: 1,
          display: "flex",
          alignItems: "center",
          //   gap: 2,
        }}
      >
        <RestaurantIcon sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Tạo Món Ăn Mới
        </Typography>
      </Box>

      <Box sx={{ padding: 4 }}>
        <Fade in={showSuccess}>
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 3 }}
          >
            Món ăn đã được lưu thành công!
          </Alert>
        </Fade>

        <Grid container spacing={3}>
          {/* Tên món ăn */}
          <Grid size={6}>
            <InputTextField
              value={form.name}
              onChange={(e) => handleChange("name", e)}
              error={errors.name}
            />
          </Grid>

          {/* Loại bữa ăn */}
          <Grid size={6}>
            <FormControl fullWidth error={errors.mealType}>
              <SelectDropdown
                value={form.mealType}
                placeholder="Loại bữa ăn"
                options={mealOptions}
                onChange={(e) => handleChange("mealType", e)}
                variant="outlined"
                // ={
                //   <InputAdornment position="start">
                //     <CategoryIcon color="action" />
                //   </InputAdornment>
                // }
              />
              {errors.mealType && (
                <FormHelperText>Vui lòng chọn loại bữa ăn</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Giá */}
          <Grid size={6}>
            <InputTextField
              clearable
              value={form.price}
              onChange={(e) => handleChange("price", e)}
              error={errors.price}
            />
          </Grid>

          {/* Mô tả */}
          <Grid size={5}>
            <InputTextArea
              value={form.description}
              onChange={(e) => handleChange("description", e)}
            />
          </Grid>

          {/* Switch có sẵn */}
          <Grid size={5}>
            <Paper variant="outlined" sx={{ padding: 2, borderRadius: 2 }}>
              <Checkbox
                checked={form.isAvailable}
                onChange={(e) => handleChange("isAvailable", e.target.checked)}
                color="primary"
              />
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Nút hành động */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" size="large">
            Hủy
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: "linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #303f9f 0%, #283593 100%)",
              },
            }}
          >
            Lưu Món Ăn
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default memo(MealForm);
