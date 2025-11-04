import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { FlightOutlined, Search } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useGetAllFlightMainInfo } from "../../context/Api/useGetApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import Zigzag from "../../common/IconComponent/Zigzag";
import { useNavigate } from "react-router-dom";
import DateTimePickerComponent from "../../common/DayPicker/index";
import InputTextField from "../../common/Input/InputTextField";
import type { DataFlight } from "../../utils/type";
import { useGetDistanceBetweenPlaces } from "../../context/Api/useGetLocation";

interface SearchFormData {
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: number;
  scheduledArrival: number;
}

const FlightInfoPage: React.FC = () => {
  const { getAllFlightInfoInfo } = useGetAllFlightMainInfo();
  const res = getAllFlightInfoInfo?.list || [];
  const navigate = useNavigate();

  const [search, setSearch] = useState<SearchFormData>({
    departureAirport: "",
    arrivalAirport: "",
    scheduledDeparture: 0,
    scheduledArrival: 0,
  });

  const [filtered, setFiltered] = useState(res);

  /** Lọc chuyến bay theo input */
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredFlights = res.filter((f: SearchFormData) => {
      const matchDeparture = search.departureAirport
        ? f.departureAirport
            ?.toLowerCase()
            .includes(search.departureAirport.toLowerCase())
        : true;

      const matchArrival = search.arrivalAirport
        ? f.arrivalAirport
            ?.toLowerCase()
            .includes(search.arrivalAirport.toLowerCase())
        : true;

      const matchScheduledDeparture = search.scheduledDeparture
        ? formatDate(
            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
            f.scheduledDeparture
          ) ===
          formatDate(
            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
            search.scheduledDeparture
          )
        : true;

      const matchScheduledArrival = search.scheduledArrival
        ? formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, f.scheduledArrival) ===
          formatDate(
            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
            search.scheduledArrival
          )
        : true;

      return (
        matchDeparture &&
        matchArrival &&
        matchScheduledDeparture &&
        matchScheduledArrival
      );
    });

    setFiltered(filteredFlights);
  };

  /** Reset filter */
  const onReset = () => {
    setSearch({
      departureAirport: "",
      arrivalAirport: "",
      scheduledDeparture: 0,
      scheduledArrival: 0,
    });
    setFiltered(res);
  };

  /** Cập nhật state khi nhập input */
  const handleInputChange = (
    key: keyof SearchFormData,
    value: string | number
  ) => {
    setSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (id: number) => {
    navigate("/booking-detail", { state: { id } });
  };

  const displayFlights = useMemo(() => filtered, [filtered]);

  // const {dataDistance  }= useGetDistanceBetweenPlaces()

  return (
    <Box sx={{ p: 3 }}>
      {/* Thanh header tab */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
        }}
      >
        {["SEARCH FLIGHT", "MANAGE BOOKING", "CHECK IN"].map((label, idx) => (
          <Button
            key={idx}
            sx={{
              flex: 1,
              bgcolor: idx === 0 ? "#00647A" : "#8FD3E9",
              color: "white",
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 0,
              "&:hover": {
                bgcolor: idx === 0 ? "#005566" : "#77c3dc",
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Form tìm kiếm */}
      <Card
        sx={{
          maxWidth: "100%",
          borderRadius: "0 0 8px 8px",
          p: 3,
          backgroundColor: "#fefdfb",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={onSearch}>
          <Grid container spacing={2}>
            <Grid size={4}>
              {" "}
              <InputTextField
                placeholder="From"
                variant="standard"
                value={search.departureAirport}
                onChange={(e) => handleInputChange("departureAirport", e)}
              />
            </Grid>

            <Grid size={4}>
              {" "}
              <InputTextField
                placeholder="To"
                variant="standard"
                value={search.arrivalAirport}
                onChange={(e) => handleInputChange("arrivalAirport", e)}
              />
            </Grid>

            <Grid size={4} sx={{ width: "31rem" }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DateTimePickerComponent
                  value={search.scheduledDeparture}
                  onChange={(value) =>
                    handleInputChange("scheduledDeparture", value)
                  }
                  language="en"
                />

                <DateTimePickerComponent
                  value={search.scheduledArrival}
                  onChange={(value) =>
                    handleInputChange("scheduledArrival", value)
                  }
                  language="en"
                />
              </Box>
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button onClick={onReset} variant="outlined" color="inherit">
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Search />}
              sx={{
                bgcolor: "#00647A",
                "&:hover": { bgcolor: "#005566" },
              }}
            >
              Search
            </Button>
          </Stack>
        </form>
      </Card>

      <Grid container spacing={2} mt={1}>
        {displayFlights.length > 0 ? (
          displayFlights.map((flight: DataFlight) => (
            <Grid size={12} key={flight.flightId}>
              <Card
                sx={{
                  borderRadius: 3,
                  padding: 2,
                  //boxShadow: 2,
                  //   transition: "all 0.3s",
                  //   "&:hover": { boxShadow: 5, transform: "scale(1.01)" },
                  maxWidth: "95%",
                  margin: "0 auto",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Flight Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Flight ID: {flight.flightId}
                    </Typography>
                    <Typography variant="body2">
                      Aircraft: {flight.aircraftCode}
                    </Typography>
                    <Typography variant="body2">
                      Departure:{" "}
                      {formatDate(
                        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                        flight.scheduledDeparture
                      )}
                    </Typography>
                  </Box>

                  {/* Flight Body */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightOutlined
                        sx={{ fontSize: 48, color: "primary.main" }}
                      />
                      <Typography variant="body1">
                        Flight No: {flight.flightNo}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Departure
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {flight.departureAirport}
                      </Typography>
                    </Box>

                    <Zigzag
                      items={
                        <FlightOutlined
                          fontSize="medium"
                          sx={{
                            color: "#007bff",
                          }}
                        />
                      }
                    />

                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Arrival
                      </Typography>
                      <Typography variant="h6" color="error">
                        {flight.arrivalAirport}
                      </Typography>
                    </Box>

                    <Typography variant="body1" fontWeight={600}>
                      Status:{" "}
                      <Box
                        component="span"
                        sx={{
                          color:
                            flight.flightStatuses?.[0]?.status === "CANCELLED"
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {flight.flightStatuses?.[0]?.status ?? "UNKNOWN"}
                      </Box>
                    </Typography>

                    <Button
                      onClick={() => handleNavigate(flight.flightId || 0)}
                      variant="contained"
                      color="primary"
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              No flights found. Please adjust your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default memo(FlightInfoPage);
