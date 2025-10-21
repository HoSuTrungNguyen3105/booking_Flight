import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fade,
  Zoom,
  Stack,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  PlaylistAdd as PlaylistAddIcon,
  CloudUpload as CloudUploadIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import type { CreateMealDto, Meal } from "../../../../utils/type";
import { useCreateMultiMeal } from "../../../Api/usePostApi";
import theme from "../../../../scss/theme";
import MealForm from "./InfoMealModal";
import { useToast } from "../../../../context/ToastContext";
type BulkMealCreatorProps = {
  onSuccess: () => void;
};
const BulkMealCreator: React.FC<BulkMealCreatorProps> = ({ onSuccess }) => {
  const lastMealRef = useRef<HTMLDivElement>(null);
  const [meals, setMeals] = useState<CreateMealDto[]>([
    {
      mealCode: "",
      name: "",
      mealType: "",
      description: "",
      price: 0,
      isAvailable: true,
    },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createdMeals, setCreatedMeals] = useState<CreateMealDto[]>([]);
  const { refetchCreateMultiMeal } = useCreateMultiMeal();
  const steps = ["Add Meals", "Review", "Complete"];

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        mealCode: "",
        name: "",
        mealType: "",
        description: "",
        price: 0,
        isAvailable: true,
      },
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

  const isValidMeal = (meal: CreateMealDto): boolean => {
    return (
      meal.name.trim() !== "" &&
      meal.mealType !== "" &&
      meal.description !== "" &&
      meal.price > 0
    );
  };

  const validMealsCount = meals.filter(isValidMeal).length;
  const toast = useToast();
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!meals || meals.length === 0) {
      toast("Vui lòng thêm ít nhất một bữa ăn trước khi tạo.", "error");
      return;
    }
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res = await refetchCreateMultiMeal(meals);
      console.log("Submitted meals:", meals);

      if (res?.resultCode === "00") {
        toast(res?.resultMessage || "Tạo bữa ăn thành công!");
        setCreatedMeals(meals);
        setActiveStep(2);
        onSuccess();
      } else {
        toast(
          res?.resultMessage || "Tạo bữa ăn thất bại, vui lòng thử lại.",
          "error"
        );
        console.error("Meal creation error:", res);
      }
    } catch (error) {
      console.error("Unexpected error creating meals:", error);
      toast("Đã xảy ra lỗi khi tạo bữa ăn.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    meals,
    refetchCreateMultiMeal,
    setActiveStep,
    setCreatedMeals,
    onSuccess,
  ]);

  const handleReset = () => {
    setMeals([
      {
        mealCode: "",
        name: "",
        mealType: "",
        description: "",
        price: 0,
        isAvailable: true,
      },
    ]);
    setActiveStep(0);
    // setIsSuccess(false);
  };

  useEffect(() => {
    if (meals.length > 1 && lastMealRef.current) {
      lastMealRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [meals.length]);

  return (
    <Box sx={{ maxHeight: "35rem", gap: 1 }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 3 }}>
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
                mb: 1,
              }}
            >
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
              <Box
                key={index}
                ref={index === meals.length - 1 ? lastMealRef : null}
              >
                <MealForm
                  key={index}
                  meal={meal}
                  index={index}
                  onChange={updateMeal}
                  onRemove={removeMeal}
                />
              </Box>
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
                            {meal.name}
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

            <Button variant="outlined" onClick={onSuccess} size="large">
              Return
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
    </Box>
  );
};

export default memo(BulkMealCreator);
