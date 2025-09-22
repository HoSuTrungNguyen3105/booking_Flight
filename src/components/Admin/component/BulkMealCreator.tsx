import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  PlaylistAdd as PlaylistAddIcon,
  CloudUpload as CloudUploadIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";

// Types
interface Meal {
  id?: string;
  name: string;
  mealType: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

interface CreateMealDto extends Omit<Meal, "id"> {}

// Meal Form Component
const MealForm: React.FC<{
  meal: Meal;
  index: number;
  onChange: (index: number, field: keyof Meal, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ meal, index, onChange, onRemove }) => {
  const theme = useTheme();

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
              <input
                type="text"
                value={meal.name}
                onChange={(e) => onChange(index, "name", e.target.value)}
                placeholder="Enter meal name"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  outline: "none",
                  background: theme.palette.background.paper,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.palette.primary.main;
                  e.target.style.boxShadow = `0 0 0 2px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.palette.divider;
                  e.target.style.boxShadow = "none";
                }}
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
              <select
                value={meal.mealType}
                onChange={(e) => onChange(index, "mealType", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: theme.palette.background.paper,
                  cursor: "pointer",
                }}
              >
                <option value="">Select meal type</option>
                <option value="BREAKFAST">🍳 Breakfast</option>
                <option value="LUNCH">🍽️ Lunch</option>
                <option value="DINNER">🍲 Dinner</option>
                <option value="SNACK">🍎 Snack</option>
                <option value="BEVERAGE">🥤 Beverage</option>
              </select>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={meal.isAvailable}
                  onChange={(e) =>
                    onChange(index, "isAvailable", e.target.checked)
                  }
                  style={{ marginRight: "8px" }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Available
                </Typography>
              </label>
            </Box>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Description
            </Typography>
            <textarea
              value={meal.description}
              onChange={(e) => onChange(index, "description", e.target.value)}
              placeholder="Describe this meal..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                minHeight: "80px",
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main Component
const BulkMealCreator: React.FC = () => {
  const theme = useTheme();
  const [meals, setMeals] = useState<Meal[]>([
    { name: "", mealType: "", description: "", price: 0, isAvailable: true },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createdMeals, setCreatedMeals] = useState<Meal[]>([]);

  const steps = ["Add Meals", "Review", "Complete"];

  const addMeal = () => {
    setMeals([
      ...meals,
      { name: "", mealType: "", description: "", price: 0, isAvailable: true },
    ]);
  };

  const removeMeal = (index: number) => {
    if (meals.length > 1) {
      setMeals(meals.filter((_, i) => i !== index));
    }
  };

  const updateMeal = (index: number, field: keyof Meal, value: any) => {
    const updatedMeals = meals.map((meal, i) =>
      i === index ? { ...meal, [field]: value } : meal
    );
    setMeals(updatedMeals);
  };

  const isValidMeal = (meal: Meal): boolean => {
    return meal.name.trim() !== "" && meal.mealType !== "" && meal.price > 0;
  };

  const validMealsCount = meals.filter(isValidMeal).length;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const createMany = async (dataList: CreateMealDto[]) => {
        const mealList: Meal[] = [];

        for (const data of dataList) {
          // Simulate API response
          const res: Meal = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            isAvailable: data.isAvailable ?? true,
          };
          mealList.push(res);
        }

        return {
          resultCode: "00",
          resultMessage: "Created multiple meals successfully!",
          data: mealList,
        };
      };

      const validMeals = meals.filter(isValidMeal);
      const result = await createMany(validMeals);
      setCreatedMeals(result.data);
      setIsSuccess(true);
      setActiveStep(2);
    } catch (error) {
      console.error("Error creating meals:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMeals([
      { name: "", mealType: "", description: "", price: 0, isAvailable: true },
    ]);
    setActiveStep(0);
    setIsSuccess(false);
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "BREAKFAST":
        return "🍳";
      case "LUNCH":
        return "🍽️";
      case "DINNER":
        return "🍲";
      case "SNACK":
        return "🍎";
      case "BEVERAGE":
        return "🥤";
      default:
        return "🍴";
    }
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {/* Header */}
      <Stack
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <RestaurantIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Bulk Meal Creator
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Create multiple meals at once with ease
            </Typography>
          </Box>
        </Box>

        {/* <Chip
          label={`${validMealsCount} valid meal${
            validMealsCount !== 1 ? "s" : ""
          } ready`}
          variant="filled"
          sx={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        /> */}
      </Stack>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Add Meals */}
      {activeStep === 0 && (
        <Fade in={true}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Add Your Meals</Typography>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={() => setPreviewOpen(true)}
                disabled={validMealsCount === 0}
              >
                Preview ({validMealsCount})
              </Button>
            </Box>

            {meals.map((meal, index) => (
              <MealForm
                key={index}
                meal={meal}
                index={index}
                onChange={updateMeal}
                onRemove={removeMeal}
              />
            ))}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addMeal}
              sx={{ mb: 3 }}
            >
              Add Another Meal
            </Button>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                endIcon={<PlaylistAddIcon />}
                onClick={() => setActiveStep(1)}
                disabled={validMealsCount === 0}
                sx={{ minWidth: 120 }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Step 2: Review */}
      {activeStep === 1 && (
        <Fade in={true}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Review Meals
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Please review the meals before creating them.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {meals.filter(isValidMeal).map((meal, index) => (
                <Grid size={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getMealTypeIcon(meal.mealType)} {meal.name}
                          </Typography>
                          <Chip
                            label={meal.mealType}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {meal.description}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ mt: 1 }}
                          >
                            ${meal.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Chip
                          label={meal.isAvailable ? "Available" : "Unavailable"}
                          color={meal.isAvailable ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)}>
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Meals"}
              </Button>
            </Box>

            {isSubmitting && <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />}
          </Box>
        </Fade>
      )}

      {/* Step 3: Complete */}
      {activeStep === 2 && (
        <Zoom in={true}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom color="success.main">
              Success!
            </Typography>
            <Typography variant="h6" gutterBottom>
              {createdMeals.length} meals created successfully
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              All meals have been added to your system.
            </Typography>

            <Button variant="contained" onClick={handleReset} size="large">
              Create More Meals
            </Button>
          </Box>
        </Zoom>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Meal Preview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {meals.filter(isValidMeal).map((meal, index) => (
              <Grid size={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{meal.name}</Typography>
                    <Typography color="text.secondary">
                      {meal.mealType}
                    </Typography>
                    <Typography>${meal.price.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={4000}
        onClose={() => setIsSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          Meals created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkMealCreator;
