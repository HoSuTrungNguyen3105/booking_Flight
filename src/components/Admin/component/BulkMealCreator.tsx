import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  PlaylistAdd as PlaylistAddIcon,
  CloudUpload as CloudUploadIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import theme from "../../../scss/theme";
import type { Meal } from "../../../utils/type";
import MealForm from "./InfoMealModal";
import { useCreateMultiMeal } from "../../Api/usePostApi";

export interface CreateMealDto extends Omit<Meal, "id" | "flightMeals"> {}

const BulkMealCreator: React.FC = () => {
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createdMeals, setCreatedMeals] = useState<CreateMealDto[]>([]);
  const { refetchCreateMultiMeal, loadingCreateMultiMeal } =
    useCreateMultiMeal();
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Gọi API thật
      const res = await refetchCreateMultiMeal(meals);
      console.log("res", res);
      if (res?.resultCode === "00") {
        setIsSuccess(true);
        setActiveStep(2);
        setCreatedMeals(meals); // nếu muốn lưu lại meal đã tạo
      } else {
        console.error("Error creating meals:", res?.resultMessage);
      }
    } catch (error) {
      console.error("Error creating meals:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setIsSuccess(false);
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

export default BulkMealCreator;
