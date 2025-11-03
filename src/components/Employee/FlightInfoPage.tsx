import React, { memo, useMemo, useState } from "react";
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
import { useForm } from "react-hook-form";
import { useGetAllFlightMainInfo } from "../../context/Api/useGetApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import Zigzag from "../../common/IconComponent/Zigzag";
import { useNavigate } from "react-router-dom";

interface SearchFormData {
  departureAirport: string;
  arrivalAirport: string;
  flightNo: string;
}

const FlightInfoPage: React.FC = () => {
  const { getAllFlightInfoInfo } = useGetAllFlightMainInfo();
  const res = getAllFlightInfoInfo?.list || [];

  const { register, handleSubmit, reset } = useForm<SearchFormData>();
  const [filtered, setFiltered] = useState(res);
  const navigate = useNavigate();
  /** Lọc chuyến bay theo input */
  const onSearch = (data: SearchFormData) => {
    const filteredFlights = res.filter((f: any) => {
      const matchDeparture = data.departureAirport
        ? f.departureAirport
            ?.toLowerCase()
            .includes(data.departureAirport.toLowerCase())
        : true;
      const matchArrival = data.arrivalAirport
        ? f.arrivalAirport
            ?.toLowerCase()
            .includes(data.arrivalAirport.toLowerCase())
        : true;
      const matchFlightNo = data.flightNo
        ? f.flightNo?.toLowerCase().includes(data.flightNo.toLowerCase())
        : true;

      return matchDeparture && matchArrival && matchFlightNo;
    });

    setFiltered(filteredFlights);
  };

  /** Reset filter */
  const onReset = () => {
    reset();
    setFiltered(res);
  };

  const handleNavigate = (id: number) => {
    navigate("/booking-detail", { state: { id } });
  };

  /** Render danh sách */
  const displayFlights = useMemo(() => filtered, [filtered]);

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          maxWidth: "100%",
          borderRadius: 3,
          boxShadow: 3,
          p: 3,
          mb: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          🔍 Search Flights
        </Typography>
        <form onSubmit={handleSubmit(onSearch)}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Departure Airport"
                variant="outlined"
                {...register("departureAirport")}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Arrival Airport"
                variant="outlined"
                {...register("arrivalAirport")}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Flight Number"
                variant="outlined"
                {...register("flightNo")}
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button onClick={onReset} variant="outlined" color="inherit">
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Search />}
            >
              Search
            </Button>
          </Stack>
        </form>
      </Card>

      <Grid container spacing={2} mt={1}>
        {displayFlights.length > 0 ? (
          displayFlights.map((flight: any) => (
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
                      onClick={() => handleNavigate(flight.flightId)}
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
