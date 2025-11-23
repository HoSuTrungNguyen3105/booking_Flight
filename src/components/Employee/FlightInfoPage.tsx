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
  const { refetchSearchFlightFromPassenger } = useSearchFlightFromPassenger(); //setParamsSearch
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

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await refetchSearchFlightFromPassenger({
      ...search,
    });
    setFiltered(res?.list || []);
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
    <Box component="main" sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <Box sx={{ display: "flex", mb: 3 }}>
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
        {/* Search Section */}
        <Box component="section" sx={{ mb: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            <form onSubmit={onSearch}>
              <Grid container spacing={3}>
                {/* From + Seat type */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <InputTextField
                    placeholder="From"
                    variant="outlined"
                    value={search.departureAirport}
                    onChange={(e) => handleInputChange("departureAirport", e)}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <SelectDropdown
                    value={search.flightClass}
                    onChange={(e) => handleInputChange("flightClass", e)}
                    options={optionsSeatTypes}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InputTextField
                    placeholder="To"
                    variant="outlined"
                    value={search.arrivalAirport}
                    onChange={(e) => handleInputChange("arrivalAirport", e)}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                <Grid size={12}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ flex: 1, minWidth: "200px" }}>
                      <DateTimePickerComponent
                        value={search.scheduledDeparture}
                        onChange={(value) =>
                          handleInputChange("scheduledDeparture", value)
                        }
                        language="en"
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: "200px" }}>
                      <DateTimePickerComponent
                        value={search.scheduledArrival}
                        onChange={(value) =>
                          handleInputChange("scheduledArrival", value)
                        }
                        language="en"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-end"
                spacing={2}
                mt={4}
              >
                <Button
                  onClick={onReset}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
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
                    borderRadius: 2,
                    px: 4,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(0,100,122,0.2)",
                  }}
                  startIcon={<Search />}
                >
                  Search Flights
                </Button>
              </Stack>
            </form>
          </Card>
        </Box>

        {/* Flight List Section */}
        <Box component="section">
          <Grid container spacing={3}>
            {displayFlights.length > 0 ? (
              displayFlights.map((flight: DataFlight) => (
                <Grid size={12} key={flight.flightId}>
                  <Box component="article">
                    <Card
                      sx={{
                        borderRadius: 3,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        },
                        border: "1px solid #eee",
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        {/* Flight Header */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            backgroundColor: "#f8f9fa",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              sx={{ color: "#555" }}
                            >
                              ID: {flight.flightId}
                            </Typography>
                            <Box
                              sx={{ width: 1, height: 16, bgcolor: "#ddd" }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#555" }}
                            >
                              Aircraft: {flight.aircraftCode}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {formatDate(
                              DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                              flight.scheduledDeparture
                            )}
                          </Typography>
                        </Box>

                        {/* Flight Body */}
                        <Box
                          sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              minWidth: "150px",
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: "50%",
                                bgcolor: "rgba(0,100,122,0.1)",
                                color: "#00647A",
                              }}
                            >
                              <FlightOutlined sx={{ fontSize: 28 }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Flight No
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="#333"
                              >
                                {flight.flightNo}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flex: 1,
                              width: "100%",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="#00647A"
                              >
                                {flight.departureAirport}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Departure
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flex: 1,
                                maxWidth: "200px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  borderTop: "2px dashed #ccc",
                                  position: "relative",
                                  top: "12px",
                                }}
                              />
                              <FlightIcon size={24} color="#00647A" />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Direct
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="#D32F2F"
                              >
                                {flight.arrivalAirport}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Arrival
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: 1,
                              minWidth: "150px",
                            }}
                          >
                            <Box
                              sx={{
                                px: 2,
                                py: 0.5,
                                borderRadius: 10,
                                bgcolor:
                                  flight.flightStatuses?.[0]?.status ===
                                  "CANCELLED"
                                    ? "rgba(211, 47, 47, 0.1)"
                                    : "rgba(46, 125, 50, 0.1)",
                                color:
                                  flight.flightStatuses?.[0]?.status ===
                                  "CANCELLED"
                                    ? "error.main"
                                    : "success.main",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {flight.flightStatuses?.[0]?.status ?? "UNKNOWN"}
                            </Box>

                            <Button
                              onClick={() =>
                                handleNavigate(flight.flightId || 0)
                              }
                              variant="contained"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                bgcolor: "#00647A",
                                "&:hover": { bgcolor: "#005566" },
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No flights found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria to find more results.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Smooth>
    </Box>
  );
};

export default memo(FlightInfoPage);
