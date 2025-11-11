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
} from "@mui/material";
import { Plus, Trash } from "lucide-react";

export interface CreateHotelReq {
  name: string;
  hotelCode: string;
  city: string;
  address: string;
  rating: number;
  price: number;
  discountPercent?: number;
  isPrime?: boolean;
  freeWifi?: boolean;
  covidMeasures?: boolean;
  freeCancel?: boolean;
  rooms?: number;
  distanceToCenter: number;
  imageUrl?: string;
}

interface HotelBatchCreatorProps {
  onClose: () => void;
  createBatchHotel: (
    hotels: CreateHotelReq[]
  ) => Promise<{ resultCode: string; list?: any[] }>;
}

const DEFAULT_HOTEL: CreateHotelReq = {
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
};

export const HotelBatchCreator: React.FC<HotelBatchCreatorProps> = ({
  onClose,
  createBatchHotel,
}) => {
  const [hotels, setHotels] = useState<CreateHotelReq[]>([DEFAULT_HOTEL]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateHotelReq, value: any) => {
      setHotels((prev) =>
        prev.map((hotel, i) =>
          i === index ? { ...hotel, [field]: value } : hotel
        )
      );
    },
    []
  );

  const handleAddHotel = () => setHotels((prev) => [...prev, DEFAULT_HOTEL]);

  const handleRemoveHotel = (index: number) => {
    setHotels((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await createBatchHotel(hotels);
      if (res?.resultCode === "00") {
        const errorMap: Record<number, string> = {};
        const newHotels = hotels.map((hotel, idx) => {
          const item = res.list?.[idx];
          if (item?.errorCode !== "SUCCESS") {
            errorMap[idx] = item?.errorMessage || "Unknown error";
            return hotel;
          }
          return DEFAULT_HOTEL;
        });
        setHotels(newHotels);
        setErrors(errorMap);
        if (Object.keys(errorMap).length === 0) onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Create Hotels in Bulk
      </Typography>

      {hotels.map((hotel, idx) => (
        <Card
          key={idx}
          sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Hotel Code"
                  value={hotel.hotelCode}
                  onChange={(e) =>
                    handleChange(idx, "hotelCode", e.target.value)
                  }
                  error={!!errors[idx]}
                  helperText={errors[idx]}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Name"
                  value={hotel.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="City"
                  value={hotel.city}
                  onChange={(e) => handleChange(idx, "city", e.target.value)}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={hotel.price}
                  onChange={(e) =>
                    handleChange(idx, "price", Number(e.target.value))
                  }
                />
              </Grid>

              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  value={hotel.rating}
                  onChange={(e) =>
                    handleChange(idx, "rating", Number(e.target.value))
                  }
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Distance to Center"
                  type="number"
                  value={hotel.distanceToCenter}
                  onChange={(e) =>
                    handleChange(
                      idx,
                      "distanceToCenter",
                      Number(e.target.value)
                    )
                  }
                />
              </Grid>

              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hotel.isPrime}
                      onChange={(e) =>
                        handleChange(idx, "isPrime", e.target.checked)
                      }
                    />
                  }
                  label="Prime"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hotel.freeWifi}
                      onChange={(e) =>
                        handleChange(idx, "freeWifi", e.target.checked)
                      }
                    />
                  }
                  label="Free Wifi"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hotel.covidMeasures}
                      onChange={(e) =>
                        handleChange(idx, "covidMeasures", e.target.checked)
                      }
                    />
                  }
                  label="Covid Measures"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hotel.freeCancel}
                      onChange={(e) =>
                        handleChange(idx, "freeCancel", e.target.checked)
                      }
                    />
                  }
                  label="Free Cancel"
                />
              </Grid>

              <Grid size={12} display="flex" justifyContent="flex-end">
                <Button
                  color="error"
                  startIcon={<Trash size={16} />}
                  onClick={() => handleRemoveHotel(idx)}
                  disabled={hotels.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddHotel}
        >
          Add Hotel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};
