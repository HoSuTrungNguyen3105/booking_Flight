import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";
import type { FlightFormData } from "./FlightUpdateModal";
import { useCreateMultiFlight } from "../../../Api/usePostApi";

// type CreateFlightDto = {
//   flightNo: string;
//   flightType: string;
//   departureAirport: string;
//   arrivalAirport: string;
//   status: string;
//   aircraftCode: string;
//   terminal: string;
//   scheduledDeparture: string;
//   scheduledArrival: string;
//   priceEconomy: number;
//   priceBusiness: number;
// };

type FlightError = {
  errorCode: string;
  errorMessage: string;
};

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

  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = (
    index: number,
    field: keyof FlightFormData,
    value: string | number
  ) => {
    const newFlights = [...flights];
    (newFlights[index][field] as any) = value;
    setFlights(newFlights);
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

  const handleSubmit = async () => {
    try {
      const result = await refetchCreateMultiFlight(flights);
      console.log("res", result);
      if (result?.resultCode === "00") {
        const errorMap: Record<number, string> = {};
        // result.?.forEach((item: FlightError, idx: number) => {
        //   if (item.errorCode !== "00") {
        //     errorMap[idx] = item.errorMessage;
        //   }
        // });
        setErrors(errorMap);

        const newFlights = flights.map((f, idx) =>
          errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
        );
        setFlights(newFlights);
      } else {
        console.error(result?.resultMessage);
      }
    } catch (err) {
      console.error(err);
      alert("API error!");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Tạo nhiều chuyến bay
      </Typography>

      {flights.map((flight, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid",
            borderColor: errors[index] ? "error.main" : "grey.300",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={3}>
                <TextField
                  size="small"
                  label="Flight No"
                  value={flight.flightNo}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "flightNo",
                      e.target.value.toUpperCase()
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  size="small"
                  label="Aircraft Code"
                  value={flight.aircraftCode}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "aircraftCode",
                      e.target.value.toUpperCase()
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  size="small"
                  label="Terminal"
                  value={flight.terminal}
                  onChange={(e) =>
                    handleChange(index, "terminal", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  size="small"
                  label="Status"
                  value={flight.status}
                  onChange={(e) =>
                    handleChange(index, "status", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={3}>
                <TextField
                  size="small"
                  label="Departure Airport"
                  value={flight.departureAirport}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "departureAirport",
                      e.target.value.toUpperCase()
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  size="small"
                  label="Arrival Airport"
                  value={flight.arrivalAirport}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "arrivalAirport",
                      e.target.value.toUpperCase()
                    )
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={3}>
                <TextField
                  size="small"
                  type="datetime-local"
                  label="Scheduled Departure"
                  InputLabelProps={{ shrink: true }}
                  value={flight.scheduledDeparture}
                  onChange={(e) =>
                    handleChange(index, "scheduledDeparture", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
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
              </Grid>

              <Grid size={3}>
                <TextField
                  size="small"
                  type="number"
                  label="Price Economy"
                  value={flight.priceEconomy}
                  onChange={(e) =>
                    handleChange(index, "priceEconomy", Number(e.target.value))
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  size="small"
                  type="number"
                  label="Price Business"
                  value={flight.priceBusiness}
                  onChange={(e) =>
                    handleChange(index, "priceBusiness", Number(e.target.value))
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={1}>
                <IconButton
                  color="error"
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
