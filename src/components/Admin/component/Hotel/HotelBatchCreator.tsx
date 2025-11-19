import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Chip,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Plus,
  Trash2,
  Hotel,
  MapPin,
  DollarSign,
  Star,
  Navigation,
  Wifi,
  Shield,
  CheckCircle,
  X,
} from "lucide-react";
import { useCreateBulkHotels } from "../../../../context/Api/usePostApi";
import type { CreateHotelDto } from "../../../../utils/type";
import { ResponseCode } from "../../../../utils/response";
import theme from "../../../../scss/theme";
import InputTextField from "../../../../common/Input/InputTextField";
import InputTextArea from "../../../../common/Input/InputTextArea";
import InputNumber from "../../../../common/Input/InputNumber";
import FormRow from "../../../../common/AdditionalCustomFC/FormRow";

interface HotelBatchCreatorProps {
  onClose?: () => void;
}

const DEFAULT_HOTEL: CreateHotelDto = {
  name: "",
  hotelCode: "",
  city: "",
  address: "",
  rating: 0,
  price: 0,
  discountPercent: 0,
  isPrime: false,
  freeWifi: false,
  covidMeasures: false,
  freeCancel: false,
  rooms: 1,
  distanceToCenter: 0,
  imageUrl: "",
  reviewCount: 0,
  payLater: false,
};

export const HotelBatchCreator: React.FC<HotelBatchCreatorProps> = ({
  onClose,
}) => {
  const { refetchCreateBulkHotels } = useCreateBulkHotels();
  const [hotels, setHotels] = useState<CreateHotelDto[]>([DEFAULT_HOTEL]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateHotelDto, value: any) => {
      setHotels((prev) =>
        prev.map((hotel, i) =>
          i === index ? { ...hotel, [field]: value } : hotel
        )
      );
      if (errors[index]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleAddHotel = () =>
    setHotels((prev) => [...prev, { ...DEFAULT_HOTEL }]);

  const handleRemoveHotel = (index: number) => {
    if (hotels.length === 1) return;

    setHotels((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      const reindexedErrors: Record<number, string> = {};
      Object.keys(newErrors).forEach((key) => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexedErrors[oldIndex - 1] = newErrors[oldIndex];
        } else if (oldIndex < index) {
          reindexedErrors[oldIndex] = newErrors[oldIndex];
        }
      });
      return reindexedErrors;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await refetchCreateBulkHotels(hotels);
      if (
        res?.resultCode === ResponseCode.SUCCESS ||
        res?.resultCode === ResponseCode.PARTIAL_SUCCESS
      ) {
        const errorMap: Record<number, string> = {};
        const newHotels = hotels.map((hotel, idx) => {
          const item = res?.list?.[idx];
          if (item?.errorCode !== "SUCCESS") {
            errorMap[idx] = item?.errorMessage || "Unknown error";
            return hotel;
          }
          return { ...DEFAULT_HOTEL };
        });

        setHotels(newHotels);
        setErrors(errorMap);

        if (Object.keys(errorMap).length === 0) {
          alert("All hotels created successfully!");
          if (onClose) onClose();
        }
      } else {
        alert("Failed to create hotels. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating hotels.");
    } finally {
      setSubmitting(false);
    }
  };

  const FeatureChip = ({
    icon: Icon,
    label,
    active,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick?: () => void;
  }) => (
    <Chip
      icon={<Icon size={16} />}
      label={label}
      variant={active ? "filled" : "outlined"}
      color={active ? "primary" : "default"}
      onClick={onClick}
      sx={{ m: 0.5, cursor: "pointer" }}
    />
  );

  const StatBox = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }) => (
    <Paper
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 120,
        bgcolor: theme.palette.background.default,
      }}
      variant="outlined"
    >
      <Icon size={18} color={theme.palette.primary.main} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  const readyToSubmitCount = hotels.filter(
    (h) => h.hotelCode && h.name && h.city
  ).length;

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 2,
          mb: 1,
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Hotel size={32} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Create Hotels in Bulk
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Add multiple hotels at once with the form below
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <StatBox icon={Hotel} label="Total Hotels" value={hotels.length} />
          <StatBox
            icon={CheckCircle}
            label="Ready to Submit"
            value={readyToSubmitCount}
          />
        </Box>
      </Paper>

      {/* Hotels List */}
      {hotels.map((hotel, idx) => (
        <Card
          key={idx}
          sx={{
            mb: 3,
            border: `2px solid ${
              errors[idx] ? theme.palette.error.main : theme.palette.divider
            }`,
            borderRadius: 2,
            transition: "all 0.2s",
            "&:hover": {
              borderColor: errors[idx]
                ? theme.palette.error.main
                : theme.palette.primary.main,
              boxShadow: 1,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Hotel Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Hotel size={24} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight="bold">
                  Hotel #{idx + 1}
                </Typography>
                {errors[idx] && (
                  <Chip
                    icon={<X size={16} />}
                    label={errors[idx]}
                    color="error"
                    size="small"
                  />
                )}
              </Box>

              <Tooltip
                title={
                  hotels.length === 1
                    ? "Cannot remove the only hotel"
                    : "Remove hotel"
                }
              >
                <span>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveHotel(idx)}
                    disabled={hotels.length === 1}
                    size="small"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Hotel Details Grid */}
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <InputTextField
                      placeholder="Hotel Code *"
                      value={hotel.hotelCode}
                      onChange={(e) => handleChange(idx, "hotelCode", e)}
                      error={!!errors[idx]}
                    />
                  </Grid>
                  <Grid size={6}>
                    <InputTextField
                      placeholder="Hotel Name *"
                      value={hotel.name}
                      onChange={(e) => handleChange(idx, "name", e)}
                    />
                  </Grid>
                  <Grid size={12}>
                    <InputTextField
                      placeholder="City *"
                      value={hotel.city}
                      onChange={(e) => handleChange(idx, "city", e)}
                      startIcon={<MapPin size={16} />}
                    />
                  </Grid>
                  <Grid size={12}>
                    <InputTextArea
                      placeholder="Address"
                      value={hotel.address}
                      onChange={(e) => handleChange(idx, "address", e)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Pricing & Rating */}
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Pricing & Location
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormRow label="Rooms">
                      <InputNumber
                        placeholder="Price per Night"
                        value={hotel.price || 0}
                        onChange={(e) =>
                          handleChange(idx, "price", Number(e) || 0)
                        }
                        size="small"
                        startIcon={<DollarSign size={16} />}
                      />
                    </FormRow>
                  </Grid>
                  <Grid size={6}>
                    <FormRow label="Rooms">
                      <InputNumber
                        placeholder="Rating"
                        value={hotel.rating || 0}
                        onChange={(e) =>
                          handleChange(idx, "rating", Number(e) || 0)
                        }
                        size="small"
                        startIcon={<Star size={16} />}
                      />
                    </FormRow>
                  </Grid>
                  <Grid size={6}>
                    <FormRow label="Rooms">
                      <InputNumber
                        placeholder="Distance to Center (km)"
                        value={hotel.distanceToCenter || 0}
                        onChange={(e) =>
                          handleChange(idx, "distanceToCenter", Number(e) || 0)
                        }
                        size="small"
                        startIcon={<Navigation size={16} />}
                      />
                    </FormRow>
                  </Grid>
                  <Grid size={6}>
                    <FormRow label="Rooms">
                      <InputNumber
                        placeholder="Rooms"
                        value={hotel.rooms || 0}
                        onChange={(e) =>
                          handleChange(idx, "rooms", Number(e) || 0)
                        }
                        size="small"
                      />
                    </FormRow>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Discount %"
                      type="number"
                      value={hotel.discountPercent || ""}
                      onChange={(e) =>
                        handleChange(
                          idx,
                          "discountPercent",
                          Number(e.target.value) || 0
                        )
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Review Count"
                      type="number"
                      value={hotel.reviewCount || ""}
                      onChange={(e) =>
                        handleChange(
                          idx,
                          "reviewCount",
                          Number(e.target.value) || 0
                        )
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={hotel.imageUrl}
                      onChange={(e) =>
                        handleChange(idx, "imageUrl", e.target.value)
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Hotel Features
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <FeatureChip
                    icon={Star}
                    label="Prime"
                    active={hotel.isPrime || false}
                    onClick={() => handleChange(idx, "isPrime", !hotel.isPrime)}
                  />
                  <FeatureChip
                    icon={Wifi}
                    label="Free WiFi"
                    active={hotel.freeWifi || false}
                    onClick={() =>
                      handleChange(idx, "freeWifi", !hotel.freeWifi)
                    }
                  />
                  <FeatureChip
                    icon={Shield}
                    label="COVID Measures"
                    active={hotel.covidMeasures || false}
                    onClick={() =>
                      handleChange(idx, "covidMeasures", !hotel.covidMeasures)
                    }
                  />
                  <FeatureChip
                    icon={CheckCircle}
                    label="Free Cancellation"
                    active={hotel.freeCancel || false}
                    onClick={() =>
                      handleChange(idx, "freeCancel", !hotel.freeCancel)
                    }
                  />
                </Box>

                {/* Checkbox for Pay Later */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hotel.payLater || false}
                      onChange={(e) =>
                        handleChange(idx, "payLater", e.target.checked)
                      }
                    />
                  }
                  label="Pay Later Available"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        gap={2}
      >
        <Button
          variant="outlined"
          startIcon={<Plus size={20} />}
          onClick={handleAddHotel}
          size="large"
        >
          Add Another Hotel
        </Button>

        <Box display="flex" gap={2}>
          {onClose && (
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              submitting ||
              hotels.some((h) => !h.hotelCode || !h.name || !h.city)
            }
            startIcon={submitting ? undefined : <Hotel size={20} />}
            size="large"
          >
            {submitting ? (
              <>
                <Box
                  component="span"
                  sx={{ animation: "pulse 1.5s infinite", mr: 1 }}
                >
                  ⏳
                </Box>
                Creating Hotels...
              </>
            ) : (
              `Create ${hotels.length} Hotel${hotels.length > 1 ? "s" : ""}`
            )}
          </Button>
        </Box>
      </Box>

      {/* Validation Alert */}
      {hotels.some((h) => !h.hotelCode || !h.name || !h.city) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please fill in all required fields (Hotel Code, Name, and City) for
          each hotel before submitting.
        </Alert>
      )}
    </Box>
  );
};
