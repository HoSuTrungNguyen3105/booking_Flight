import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useGetFlightMealsById } from "../../../Api/useGetApi";
import BaseModal from "../../../../common/Modal/BaseModal";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightMealId: number;
}

const MealFlightRelation = ({
  open,
  onClose,
  onSuccess,
  flightMealId,
}: IModalStatisticalDataLearningProps) => {
  const { fetchFlightMealsById, loadingFlightMealsById } =
    useGetFlightMealsById(flightMealId);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" color="error" onClick={onSuccess}>
          Delete
        </Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    );
  }, [onSuccess, onClose]);

  const renderContent = useCallback(() => {
    if (loadingFlightMealsById) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    const fm = fetchFlightMealsById?.data;

    return (
      <Box sx={{ height: "25rem", width: "35rem", pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin FlightMeal
        </Typography>

        <Stack spacing={2}>
          {/* Flight Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Flight Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>Flight No: {fm?.flight?.flightNo}</Typography>
            <Typography>
              Route: {fm?.flight?.departureAirport} →{" "}
              {fm?.flight?.arrivalAirport}
            </Typography>
            <Typography>Aircraft: {fm?.flight?.aircraftCode}</Typography>
            <Typography>Type: {fm?.flight?.flightType}</Typography>
          </Box>

          {/* Meal Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Meal Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>Code: {fm?.meal?.mealCode}</Typography>
            <Typography>Name: {fm?.meal?.name}</Typography>
            <Typography>Type: {fm?.meal?.mealType}</Typography>
            <Typography>Description: {fm?.meal?.description}</Typography>
            <Typography>
              Price: {fm?.meal?.price?.toLocaleString()} VND
            </Typography>
            <Typography>
              Status: {fm?.meal?.isAvailable ? "Available" : "Unavailable"}
            </Typography>
          </Box>

          {/* Relation Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Relation
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>Quantity: {fm?.quantity}</Typography>
            <Typography>
              Custom Price: {fm?.price?.toLocaleString()} VND
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }, [fetchFlightMealsById, fetchFlightMealsById]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Flight - Meal Relation"
      Icon={AddIcon}
      maxWidth="lg"
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(MealFlightRelation);
