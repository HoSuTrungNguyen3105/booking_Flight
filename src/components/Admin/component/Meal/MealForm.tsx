import { memo, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  alpha,
} from "@mui/material";
import {
  CategoryRounded,
  Delete as DeleteIcon,
  DinnerDining,
  EmojiFoodBeverage,
  Fastfood,
  Icecream,
  LocalBar,
  LocalDrink,
  LunchDining,
  Restaurant as RestaurantIcon,
  VerticalAlignCenterSharp,
} from "@mui/icons-material";
import theme from "../../../../scss/theme";
import type { CreateMealDto, MealType } from "../../../../utils/type";
import InputTextArea from "../../../../common/Input/InputTextArea";
import SelectDropdown, {
  type ActionType,
} from "../../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../../common/Input/InputTextField";
import { useFindAllMealTypes } from "../../../../context/Api/useGetApi";
import InputNumber from "../../../../common/Input/InputNumber";

interface MealFormProps {
  meal: CreateMealDto;
  index: number;
  onChange: (index: number, field: keyof CreateMealDto, value: any) => void;
  onRemove: (index: number) => void;
}

const MealForm = ({ meal, index, onChange, onRemove }: MealFormProps) => {
  const { dataMealTypes } = useFindAllMealTypes();

  const getMealIcon = (mealType: MealType) => {
    switch (mealType) {
      case "BREAKFAST":
        return <CategoryRounded color="action" />;
      case "LUNCH":
        return <LunchDining color="action" />;
      case "DINNER":
        return <DinnerDining color="action" />;
      case "SNACK":
        return <Fastfood color="action" />;
      case "BEVERAGE":
        return <LocalDrink color="action" />;
      case "DRINK":
        return <LocalBar color="action" />;
      case "DESSERT":
        return <Icecream color="action" />;
      case "VEG":
        return <VerticalAlignCenterSharp color="action" />;
      case "NONVEG":
        return <EmojiFoodBeverage color="action" />;
      default:
        return null;
    }
  };

  const mapMealOptions = useCallback((mealTypes: string[]): ActionType[] => {
    return mealTypes.map((type) => ({
      value: type,
      label: type,
      icon: getMealIcon(type as MealType),
    }));
  }, []);

  const mealOptions = mapMealOptions(dataMealTypes?.data ?? []);

  return (
    <Card
      sx={{
        mb: 2,
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <RestaurantIcon color="primary" />
            Meal #{index + 1}
          </Typography>
          <IconButton
            onClick={() => onRemove(index)}
            disabled={index !== 1}
            color="error"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid size={6}>
            {/* <Box sx={{ mb: 2 }}> */}
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Meal Code *
            </Typography>
            <InputTextField
              type="text"
              value={meal.mealCode}
              onChange={(e) => onChange(index, "mealCode", e)}
              placeholder="Enter meal code"
            />
            {/* </Box> */}

            {/* <Box sx={{ mb: 2 }}> */}
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Meal Name *
            </Typography>
            <InputTextField
              type="text"
              value={meal.name}
              onChange={(e) => onChange(index, "name", e)}
              placeholder="Enter meal name"
            />
            {/* </Box>

              <Box sx={{ mb: 2 }}> */}
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Meal Type *
            </Typography>
            <SelectDropdown
              value={meal.mealType}
              onChange={(e) => onChange(index, "mealType", e)}
              options={mealOptions}
              placeholder="Enter meal type"
            />
            {/* </Box> */}
          </Grid>

          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                color="text.secondary"
              >
                Price *
              </Typography>
              <InputNumber
                value={meal.price}
                min={0}
                isSeparator
                sx={{ width: "35rem" }}
                size="medium"
                onChange={(e) => onChange(index, "price", e || 0)}
                placeholder="0.00"
              />
            </Box>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Description
            </Typography>
            <InputTextArea
              value={meal.description}
              onChange={(e) => onChange(index, "description", e)}
              placeholder="Describe this meal..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default memo(MealForm);
