import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import InputTextField from "../../../../common/Input/InputTextField";
import SingleDateRangePickerComponent from "../../../../common/DayPicker/date-range-field";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import InputNumber from "../../../../common/Input/InputNumber";
import theme from "../../../../scss/theme";
import { useFlightCreateAndUpdate } from "./hooks/useFlightCreateAndUpdate";

const FlightBatchCreator: React.FC = () => {
  const {
    handleSubmitMultiFlight,
    handleAddFlight,
    handleRemoveFlight,
    errors,
    handleChange,
    flights,
    optionAircraftCode,
    optionAirportCode,
  } = useFlightCreateAndUpdate({});

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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitMultiFlight}
        >
          Submit batch
        </Button>
      </Box>
    </Box>
  );
};

export default FlightBatchCreator;
