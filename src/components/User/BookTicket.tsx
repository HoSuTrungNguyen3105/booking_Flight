import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import type { FareConditions, UserSearchType } from "./type";
import { useFlightBooking, useFlightList } from "../Api/usePostApi";
import { Button } from "../../common/Button/Button";
import { FlightOutlined, RefreshOutlined } from "@mui/icons-material";
import Zigzag from "../../common/CustomRender/Zigzag";
import FormRow from "../../common/CustomRender/FormRow";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { Flight } from "../../common/Setting/type";
import type { IDetailItem } from "../../common/DetailSection";
import DetailSection from "../../common/DetailSection";

const BookTicket = () => {
  const [flightParams, setFlightParams] = React.useState<UserSearchType>({
    fareConditions: "",
    scheduledDeparture: "",
    scheduledArrival: "",
    departureAirport: "",
    arrivalAirport: "",
    passengerCount: 0,
  });

  const { reset: resetSearch, control: controlSearch } =
    useForm<UserSearchType>({
      defaultValues: flightParams,
    });

  const { flightList } = useFlightList();
  const [flightListData, setFlightList] = React.useState<Flight[]>([]);

  React.useEffect(() => {
    if (flightList?.list) {
      setFlightList(flightList.list);
    }
  }, [flightList]);

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
  const fareConditions = [
    { label: "Economy", value: "ECONOMY" },
    { label: "Business", value: "BUSINESS" },
    { label: "First Class", value: "FIRST" },
  ];

  const detail: IDetailItem[] = [
    {
      title: "Fare Conditions",
      description: (
        <Dropdown
          value={controlSearch._getWatch("fareConditions")}
          onChange={() => {}}
          options={fareConditions}
          placeholder="Select"
        />
      ),
    },
    {
      title: "Passenger Count",
      description: (
        <Dropdown
          options={[]} // Replace with real data
          placeholder="Choose number"
          value={controlSearch._getWatch("passengerCount")}
          onChange={() => {}}
        />
      ),
    },
    {
      title: "Departure Airport",
      description: (
        <Dropdown
          options={fareConditions}
          placeholder="Select"
          value={controlSearch._getWatch("fareConditions")}
          onChange={() => {}}
        />
      ),
    },
    {
      title: "Arrival Airport",
      description: (
        <Dropdown
          options={fareConditions}
          placeholder="Select"
          value={controlSearch._getWatch("fareConditions")}
          onChange={() => {}}
        />
      ),
    },
  ];
  const onSubmitValue = async (values: UserSearchType) => {
    if (!values) return;
    setLoadingFlightBookingData(true);
    setDisplayDataFlight([]);
    setFlightParams(values);
    await refetchFlightBookingDataData(values);
  };

  const formatDate = (dateValue: string | undefined) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toTimeString().split(" ")[0];
  };

  return (
    <form>
      <FormControl sx={{ width: "100%" }}>
        <TableContainer sx={{ p: 1 }}>
          <Box sx={{ borderRadius: 2, border: "solid 3px #f2f3f8" }}>
            <Box borderRadius={2} border="3px solid #f2f3f8" p={3}>
              <DetailSection data={detail} />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                  label="선택"
                />
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Grid container spacing={2}>
              {flightListData?.length > 0 ? (
                flightListData.map((flight) => (
                  <>
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
                            Flight Number: {flight.flightNo}
                          </Typography>
                        </Box>
                        <Box sx={{ alignContent: "center", minWidth: 160 }}>
                          {fareConditions.map((fare) => (
                            <Chip
                              key={fare.value}
                              label={fare.label}
                              style={{
                                backgroundColor: getFareConditionColor(
                                  fare.label as FareConditions
                                ),
                              }}
                            />
                          ))}

                          <Typography variant="h5" color="text.secondary">
                            {flight.aircraftCode}
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
                              {flight.scheduledDeparture}
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
                              {flight.scheduledArrival}
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
                            {flight.aircraftCode} dollar
                          </Typography>

                          <Typography variant="body1" color="black">
                            Total: {flight.arrivalAirport} / person dollar
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
                  </>
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
