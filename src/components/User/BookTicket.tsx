import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import type { FareConditions, UserSearchType } from "./type";
import { useFlightBooking } from "../Api/usePostApi";
import { Button } from "../../common/Button/Button";
import {
  FlightOutlined,
  RefreshOutlined,
  SearchRounded,
} from "@mui/icons-material";
import Zigzag from "../../common/CustomRender/Zigzag";

const BookTicket = () => {
  const [flightParams, setFlightParams] = React.useState<UserSearchType>({
    fareConditions: "",
    scheduledDeparture: "",
    scheduledArrival: "",
    departureAirport: "",
    arrivalAirport: "",
    passengerCount: 0,
  });
  const { reset: resetSearch } = useForm<UserSearchType>({
    defaultValues: flightParams,
  });
  const onResetForm = () => {
    resetSearch();
  };
  const [loadingFlightBookingData, setLoadingFlightBookingData] =
    React.useState<boolean>(false);
  const [displayDataFlight, setDisplayDataFlight] = React.useState<
    UserSearchType[]
  >([]);
  const { flightBookingData, refetchFlightBookingDataData } =
    useFlightBooking(flightParams);
  const getFareConditionColor = (fare: FareConditions): string => {
    switch (fare) {
      case "Business":
        return "#e8f5e9";
      case "Economy":
        return "#e3f2fd";
      case "Comfort":
        return "#fff3e0";
      default:
        return "#f5f5f5";
    }
  };
  const sampleDataFlight = [
    {
      ticketNo: "FL12345",
      flightId: "FL12345",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      scheduledDeparture: "2025-06-28T08:30:00",
      scheduledArrival: "2025-06-28T12:15:00",
      fareConditions: "Economy",
      aircraftName: "Boeing 737 MAX",
      totalAmount: 480,
      amount: 160,
      status: "Confirmed",
    },
    {
      ticketNo: "FL67890",
      flightId: "FL67890",
      departureAirport: "SGN",
      arrivalAirport: "HAN",
      scheduledDeparture: "2025-06-29T14:00:00",
      scheduledArrival: "2025-06-29T16:10:00",
      fareConditions: "Business",
      aircraftName: "Airbus A320",
      totalAmount: 820,
      amount: 410,
      status: "Pending",
    },
  ];
  const onSubmitValue = async (values: UserSearchType) => {
    if (!values) return;
    setLoadingFlightBookingData(true);
    setDisplayDataFlight([]);
    setFlightParams(values);
    await refetchFlightBookingDataData(values);
  };
  React.useEffect(() => {
    if (flightBookingData) {
      const list = Array.isArray(flightBookingData.flightList)
        ? flightBookingData.flightList
        : flightBookingData.flightList
        ? [flightBookingData.flightList]
        : [];
      setDisplayDataFlight(list);
      setLoadingFlightBookingData(false);
    }
  }, [flightBookingData]);
  const formatDate = (dateValue: string | undefined) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toTimeString().split(" ")[0];
  };
  return (
    //  <form onSubmit={handleSearchSubmit(onSubmitValue)}>
    <form>
      <FormControl sx={{ width: "100%" }}>
        <TableContainer className="flight-container" sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Breadcrumbs />
            </Box>
          </Box>
          <Box sx={{ borderRadius: 2, border: "solid 3px #f2f3f8" }}>
            <Box
              borderRadius={2}
              border="3px solid #f2f3f8"
              p={3}
              className="search-status"
            >
              <Grid container spacing={3}>
                {/* Left column */}
                {/* <Grid item xs={12} md={6}> */}
                {/* <FormRow label="Fare Conditions">
                    {/* <DropdownField
              name="fareConditions"
              control={controlSearch}
              options={fareConditions}
              placeholder="Select"
            /> 
                  </FormRow>

                  <FormRow label="Passenger Count">
                    <DropdownField
                      name="passengerCount"
                      control={controlSearch}
                      options={[]} // Replace with real data
                      placeholder="Choose number"
                    />
                  </FormRow> */}
              </Grid>

              {/* Middle column */}
              {/* <FormRow label="Departure Airport">
                    <DropdownField
                      name="departureAirport"
                      control={controlSearch}
                      options={airportName}
                      placeholder="Select"
                    />
                  </FormRow>

                  <FormRow label="Arrival Airport">
                    <DropdownField
                      name="arrivalAirport"
                      control={controlSearch}
                      options={airportName}
                      placeholder="Select"
                    />
                  </FormRow> */}

              {/* Right column */}
              {/* <Grid item xs={12} md={4}>
                  <FormRow label="Scheduled Departure">
                    <DatetimePicker
                      name="scheduledDeparture"
                      control={controlSearch}
                    />
                  </FormRow>

                  <FormRow label="Scheduled Arrival">
                    <DatetimePicker
                      name="scheduledArrival"
                      control={controlSearch}
                    />
                  </FormRow>
                </Grid>
              </Grid> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "0.2px",
                  gap: "2px",
                  p: 1,
                  mt: 9,
                }}
              >
                <Button
                  priority="normal"
                  onClick={onResetForm}
                  label={<RefreshOutlined />}
                  iconPosition="trailing"
                  size="large"
                  type="reset"
                  iconSize={21}
                />
                <Button
                  priority="normal"
                  size="large"
                  type="submit"
                  label={
                    <Typography>
                      <SearchRounded sx={{ color: "white" }} />
                      선택
                    </Typography>
                  }
                />
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Grid container spacing={2}>
              {/* Render flight data trước, luôn hiển thị */}
              {sampleDataFlight.length > 0 ? (
                sampleDataFlight.map((flight) => (
                  <Box>
                    {/* item xs={12} key={flight.ticketNo} */}
                    <Box>
                      <Card
                        sx={{
                          borderRadius: 2,
                          padding: 2,
                          boxShadow: 3,
                          height: "auto",
                          maxWidth: "95%",
                          display: "flex",
                          margin: "0 auto",
                        }}
                      >
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            width: "100%",
                            gap: 3,
                          }}
                        >
                          <Box sx={{ alignContent: "center" }}>
                            <FlightOutlined
                              sx={{ fontSize: 100, transform: "rotate(50deg)" }}
                            />
                            <Typography variant="body1" color="black">
                              Flight Number: {flight.ticketNo}
                            </Typography>
                          </Box>
                          <Box sx={{ alignContent: "center", minWidth: 160 }}>
                            <Box
                              sx={{
                                px: 1,
                                py: 1,
                                backgroundColor: getFareConditionColor(
                                  flight.fareConditions as FareConditions
                                ),
                                border: "solid 1px #f2f3f8",
                                borderRadius: 1,
                                textAlign: "center",
                                alignContent: "center",
                              }}
                            >
                              {flight.fareConditions}
                            </Box>
                            <Typography variant="h5" color="text.secondary">
                              {flight.aircraftName}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h6">
                                {formatDate(flight.scheduledDeparture)}
                              </Typography>
                              <Box
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  border: "solid 1px black",
                                  borderRadius: "20px",
                                  fontWeight: "bold",
                                  backgroundColor: "#e3f2fd",
                                  color: "#0d47a1",
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                {flight.departureAirport}
                              </Box>
                            </Box>
                            <Zigzag
                              items={
                                <FlightOutlined
                                  fontSize="medium"
                                  sx={{
                                    color: "#007bff",
                                    transform: "rotate(90deg)",
                                  }}
                                />
                              }
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h6">
                                {formatDate(flight.scheduledArrival)}
                              </Typography>
                              <Box
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  border: "solid 1px black",
                                  borderRadius: "20px",
                                  fontWeight: "bold",
                                  backgroundColor: "#fce4ec",
                                  color: "#880e4f",
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                {flight.arrivalAirport}
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ alignContent: "center" }}>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="black"
                            >
                              {flight.totalAmount} dollar
                            </Typography>

                            <Typography variant="body1" color="black">
                              Total: {flight.amount} / person dollar
                            </Typography>
                          </Box>
                          <Box sx={{ alignContent: "center" }}>
                            <Typography variant="body1" color="black">
                              Status: {flight.status}
                            </Typography>
                          </Box>
                          <Box sx={{ alignContent: "center" }}>
                            {/* <Link
                              to={`/${flightParams.passengerCount}/${flight.ticketNo}`}
                            > */}
                            <Button
                              priority="normal"
                              size="large"
                              type="button"
                              label="SELECT"
                            />
                            {/* </Link> */}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box>
                  {/* item xs={12} */}
                  <Typography
                    variant="h6"
                    textAlign="center"
                    width="100%"
                    mt={3}
                    color="text.secondary"
                  >
                    Không có dữ liệu chuyến bay
                  </Typography>
                </Box>
              )}

              {/* Nếu đang loading thì hiển thị loading riêng */}
              {loadingFlightBookingData && (
                // <Grid item xs={12}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      py: 4,
                    }}
                  >
                    <CircularProgress color="primary" />
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, color: "text.secondary" }}
                    >
                      Đang tải dữ liệu chuyến bay...
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Box>
        </TableContainer>
      </FormControl>
    </form>
  );
};

export default BookTicket;
