import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { FlightFormData } from "./FlightManagementModal";
import {
  useCreateMultiFlight,
  type CreateManyFlightResultItem,
} from "../../../../context/Api/usePostApi";
import InputTextField from "../../../../common/Input/InputTextField";
import SingleDateRangePickerComponent from "../../../../common/DayPicker/date-range-field";
import { useGetAllCode } from "../../../../context/Api/useGetApi";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import { useNavigate } from "react-router-dom";
import InputNumber from "../../../../common/Input/InputNumber";
import theme from "../../../../scss/theme";

// type FlightError = {
//   errorCode: string;
//   errorMessage: string;
// };

const FlightBatchCreator: React.FC = () => {
  const [flights, setFlights] = useState<FlightFormData[]>([
    {
      flightNo: "",
      flightType: "",
      departureAirport: "",
      arrivalAirport: "",
      status: "SCHEDULED",
      aircraftCode: "",
      terminal: "",
      scheduledDeparture: 0,
      scheduledArrival: 0,
      priceEconomy: 0,
      priceBusiness: 0,
    },
  ]);

  const { getAllCode } = useGetAllCode();

  const optionAirportCode =
    getAllCode?.data?.airport?.map((e) => ({
      label: ` ${e.value}`,
      value: e.code,
    })) ?? [];

  const optionAircraftCode =
    getAllCode?.data?.aircraft?.map((e) => ({
      label: ` ${e.value}`,
      value: e.code,
    })) ?? [];

  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = (
    index: number,
    field: keyof FlightFormData,
    value: string | number
  ) => {
    const newFlights = [...flights];
    (newFlights[index][field] as any) = value;
    setFlights(newFlights);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[index]) {
        delete newErrors[index];
      }
      return newErrors;
    });
  };

  const handleAddFlight = () => {
    setFlights([
      ...flights,
      {
        flightNo: "",
        flightType: "",
        departureAirport: "",
        arrivalAirport: "",
        status: "SCHEDULED",
        aircraftCode: "",
        terminal: "",
        scheduledDeparture: 0,
        scheduledArrival: 0,
        priceEconomy: 0,
        priceBusiness: 0,
      },
    ]);
  };

  const handleRemoveFlight = (index: number) => {
    if (flights.length === 1) return;
    setFlights(flights.filter((_, i) => i !== index));
  };

  const { refetchCreateMultiFlight } = useCreateMultiFlight();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const result = await refetchCreateMultiFlight(flights);

      if (result?.resultCode === "00") {
        const errorMap: Record<number, string> = {};

        setErrors([]);

        const newFlights = flights.map((f, idx) =>
          errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
        );
        setFlights(newFlights);

        if (Object.keys(errorMap).length === 0) {
          navigate("/admin/FlightManagement");
        }
      } else {
        const errorMap: Record<number, string> = {};

        result?.list?.forEach(
          (item: CreateManyFlightResultItem, idx: number) => {
            if (item.errorCode && item.errorCode !== "00") {
              errorMap[idx] = item.errorMessage || "Unknown error";
            }
          }
        );

        setErrors(errorMap);

        const newFlights = flights.map((f, idx) =>
          errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
        );
        setFlights(newFlights);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Create Bulk Flight
      </Typography>

      {flights.map((flight, index) => (
        <Card
          key={index}
          sx={{
            p: 2,
            border: "1px solid",
            borderRadius: 1,
            borderColor: errors[index]
              ? theme.palette.error.dark
              : theme.palette.grey[300],
            mb: 2,
            padding: 1,
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={3}>
                <InputTextField
                  placeholder="Flight No"
                  value={flight.flightNo}
                  onChange={(e) =>
                    handleChange(index, "flightNo", e.toUpperCase())
                  }
                />
              </Grid>

              <Grid size={3}>
                <InputTextField
                  placeholder="Status"
                  value={flight.status}
                  onChange={(e) => handleChange(index, "status", e)}
                />
              </Grid>

              <Grid size={3}>
                <SelectDropdown
                  options={optionAirportCode}
                  placeholder="Departure Airport"
                  value={flight.departureAirport}
                  onChange={(e) => handleChange(index, "departureAirport", e)}
                />
              </Grid>

              <Grid size={3}>
                <SelectDropdown
                  options={optionAirportCode}
                  placeholder="Arrival Airport"
                  value={flight.arrivalAirport}
                  onChange={(e) => handleChange(index, "arrivalAirport", e)}
                />
              </Grid>

              <Grid size={3}>
                <SelectDropdown
                  options={optionAircraftCode}
                  placeholder="Aircraft Code"
                  value={flight.aircraftCode}
                  onChange={(e) => handleChange(index, "aircraftCode", e)}
                />
              </Grid>

              <Grid size={6}>
                {/* <Box sx={{ maxHeight: "2vh" }}> */}
                <SingleDateRangePickerComponent
                  sx={{ maxHeight: "5vh" }}
                  // placeHolder="Scheduled Departure"
                  value={[flight.scheduledDeparture, flight.scheduledArrival]}
                  language="en"
                  // sx={{ maxHeight: "20vh" }}
                  onChange={([departure, arrival]) => {
                    handleChange(index, "scheduledDeparture", departure);
                    handleChange(index, "scheduledArrival", arrival);
                  }}
                />
                {/* </Box> */}
              </Grid>
              {/* <Grid size={3}>
                <TextField
                  size="small"
                  type="datetime-local"
                  label="Scheduled Arrival"
                  InputLabelProps={{ shrink: true }}
                  value={flight.scheduledArrival}
                  onChange={(e) =>
                    handleChange(index, "scheduledArrival", e.target.value)
                  }
                  fullWidth
                />
              </Grid> */}

              <Grid size={3}>
                <InputTextField
                  placeholder="Terminal"
                  value={flight.terminal}
                  onChange={(e) => handleChange(index, "terminal", e)}
                />
              </Grid>

              <Grid size={3}>
                <FormControl fullWidth>
                  <InputNumber
                    size="small"
                    placeholder="Price Economy"
                    value={flight.priceEconomy}
                    onChange={(e) =>
                      handleChange(index, "priceEconomy", Number(e))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid size={3}>
                <FormControl fullWidth>
                  <InputNumber
                    size="small"
                    placeholder="Price Business"
                    value={flight.priceBusiness}
                    onChange={(e) =>
                      handleChange(index, "priceBusiness", Number(e))
                    }
                  />
                </FormControl>
              </Grid>

              <Grid size={1}>
                <IconButton
                  sx={{ color: theme.palette.error.dark }}
                  onClick={() => handleRemoveFlight(index)}
                  disabled={flights.length === 1}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>

            {errors[index] && (
              <Typography color="error" variant="caption">
                {errors[index]}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={handleAddFlight}
        >
          Thêm flight
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit batch
        </Button>
      </Box>
    </Box>
  );
};

export default FlightBatchCreator;
