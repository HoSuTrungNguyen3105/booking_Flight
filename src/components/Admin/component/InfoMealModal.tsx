import React, { forwardRef, useCallback } from "react";
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
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import theme from "../../../scss/theme";
import type { Meal } from "../../../utils/type";
import InputTextArea from "../../../common/Input/InputTextArea";
import type { CreateMealDto } from "./BulkMealCreator";
import SelectDropdown from "../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../common/Input/InputTextField";

interface MealFormProps {
  meal: CreateMealDto;
  index: number;
  onChange: (index: number, field: keyof CreateMealDto, value: any) => void;
  onRemove: (index: number) => void;
}

const MealForm =
  // = forwardRef<HTMLDivElement, MealFormProps>(
  ({ meal, index, onChange, onRemove }: MealFormProps) => {
    const getMealTypeOptions = useCallback(() => {
      return [
        { value: "BREAKFAST", label: "Breakfast" },
        { value: "LUNCH", label: "Lunch" },
        { value: "DINNER", label: "Dinner" },
        { value: "SNACK", label: "Snack" },
        { value: "BEVERAGE", label: "Beverage" },
      ];
    }, []);

    return (
      <Card
        sx={{
          mb: 2,
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[4],
          },
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
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color="text.secondary"
                >
                  Meal Name *
                </Typography>
                <InputTextField
                  type="text"
                  value={meal.name}
                  onChange={(e) => onChange(index, "name", e)}
                  placeholder="Enter meal name"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color="text.secondary"
                >
                  Meal Type *
                </Typography>
                <SelectDropdown
                  value={meal.mealType}
                  onChange={(e) => onChange(index, "mealType", e)}
                  options={getMealTypeOptions()}
                />
              </Box>
            </Grid>

            <Grid size={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color="text.secondary"
                >
                  Price ($) *
                </Typography>
                <input
                  type="number"
                  value={meal.price}
                  onChange={(e) =>
                    onChange(index, "price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                color="text.secondary"
              >
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

export default MealForm;
