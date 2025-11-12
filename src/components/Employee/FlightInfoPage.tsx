import React, { memo, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { FlightOutlined, Search } from "@mui/icons-material";
import {
  mapStringToDropdown,
  useFindAllSeatTypes,
  useGetAllFlightMainInfo,
  useSearchFlightFromPassenger,
} from "../../context/Api/useGetApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import Zigzag from "../../common/IconComponent/Zigzag";
import { useNavigate } from "react-router-dom";
import DateTimePickerComponent from "../../common/DayPicker/index";
import InputTextField from "../../common/Input/InputTextField";
import type { DataFlight } from "../../utils/type";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import FlightIcon from "../../common/IconComponent/FlightIcon";
import Smooth from "react-smooth";
import TabPanel from "../../common/AdditionalCustomFC/TabPanel";

interface SearchFormData {
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: number;
  scheduledArrival: number;
  passengers: number;
  flightClass: string;
}

const FlightInfoPage: React.FC = () => {
  const { getAllFlightInfoInfo } = useGetAllFlightMainInfo();
  const { setParamsSearch, refetchSeatTypes } = useSearchFlightFromPassenger();
  const res = getAllFlightInfoInfo?.list || [];
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const [search, setSearch] = useState<SearchFormData>({
    departureAirport: "",
    arrivalAirport: "",
    scheduledDeparture: 0,
    scheduledArrival: 0,
    passengers: 1,
    flightClass: "",
  });

  const tabs = [
    { label: "SEARCH FLIGHT", value: "search", description: "Tìm chuyến bay" },
    { label: "MANAGE BOOKING", value: "manage", description: "Quản lý đặt vé" },
    { label: "CHECK IN", value: "checkin", description: "Check-in chuyến bay" },
  ];

  const [filtered, setFiltered] = useState(res);

  const { dataSeatTypes } = useFindAllSeatTypes();
  const optionsSeatTypes = mapStringToDropdown(dataSeatTypes?.data || []);
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

      const matchFlightClass = search.flightClass
        ? f.flightClass
            ?.toLowerCase()
            .includes(search.flightClass.toLowerCase())
        : true;

      // const matchPassengers = search.passengers
      //   ? f.passengers.includes(search.arrivalAirport.toLowerCase())
      //   : true;

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
        matchScheduledArrival &&
        matchFlightClass
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
      passengers: 1,
      flightClass: "Economy",
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

  const displayFlights = useMemo(() => filtered, [filtered]);

  const handleNavigate = (id: number) => {
    navigate("/booking-detail", { state: { id } });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex" }}>
        <TabPanel
          sx={{ width: "100%" }}
          activeTab={activeTab}
          onChangeTab={(idx) => {
            setActiveTab(idx);
          }}
          tabs={tabs}
        />
      </Box>

      <Smooth
        from={{ opacity: 0, transform: "translateY(-10px)" }}
        to={{ opacity: 1, transform: "translateY(0)" }}
        duration={600}
      >
        <Card
          sx={{
            borderRadius: "0 0 8px 8px",
            p: 3,
            backgroundColor: "#fefdfb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <form onSubmit={onSearch}>
            <Grid container spacing={2}>
              {/* From + Seat type */}
              <Grid size={4}>
                <InputTextField
                  placeholder="From"
                  variant="outlined"
                  value={search.departureAirport}
                  onChange={(e) => handleInputChange("departureAirport", e)}
                />
              </Grid>

              <Grid size={4}>
                <SelectDropdown
                  value={search.flightClass}
                  onChange={(e) => handleInputChange("flightClass", e)}
                  options={optionsSeatTypes}
                />
              </Grid>

              <Grid size={4}>
                <InputTextField
                  placeholder="To"
                  variant="outlined"
                  value={search.arrivalAirport}
                  onChange={(e) => handleInputChange("arrivalAirport", e)}
                />
              </Grid>

              <Grid size={4}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

            {/* Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-end"
              spacing={2}
              mt={3}
            >
              <Button onClick={onReset} variant="outlined" color="inherit">
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#00647A",
                  color: "white",
                  "&:hover": { bgcolor: "#005566" },
                  transition: "all 0.3s",
                }}
                startIcon={<Search />}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                          <Box
                            sx={{
                              transform: "rotate(90deg)",
                              transformOrigin: "top left",
                            }}
                          >
                            <FlightIcon size={24} color="#00647A" />
                          </Box>
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
      </Smooth>
    </Box>
  );
};

export default memo(FlightInfoPage);
