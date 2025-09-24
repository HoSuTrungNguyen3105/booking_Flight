import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  Switch,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import type { FareConditions, SearchTicketType } from "./type";
import { useFlightBooking, useFlightList } from "../Api/usePostApi";
// import { Button } from "../../common/Button/Button";
import { FlightOutlined, RefreshOutlined } from "@mui/icons-material";
import Zigzag from "../../common/CustomRender/Zigzag";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { Flight } from "../../common/Setting/type";
import type { IDetailItem } from "../../common/DetailSection";
import DetailSection from "../../common/DetailSection";
import InputTextField from "../../common/Input/InputTextField";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { InputDate } from "../../common/DayPicker";
import { useGetAllCode } from "../Api/useGetApi";
import DateTimePickerComponent from "../../common/DayPicker/date-range-picker";

const BookTicket = () => {
  const [flightParams, setFlightParams] = React.useState<SearchTicketType>({
    from: "",
    to: "",
    status: "arrived",
    cabinClass: "ECONOMY",
    passengers: 1,
  });
  const { getAllCode } = useGetAllCode();

  const {
    reset: resetSearch,
    control,
    setValue,
    watch,
  } = useForm<SearchTicketType>({
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

  const optionAirportCode = (getAllCode?.data?.airport ?? []).map(
    (item, index) => ({
      value: item.code,
      label: item.code,
    })
  );

  const optionAircraftCode = (getAllCode?.data?.aircraft ?? []).map(
    (item, index) => ({
      value: item.code,
      label: item.code,
    })
  );

  const detail: IDetailItem[] = [
    {
      title: "Flight Number",
      description: (
        <InputTextField
          placeholder="Enter flight number"
          value={watch("flightNo")}
          onChange={(e) => setValue("flightNo", e)}
        />
      ),
    },
    {
      title: "From",
      description: (
        <SelectDropdown
          options={optionAirportCode}
          placeholder="Select departure"
          value={watch("from")}
          onChange={(val) => setValue("from", String(val))}
        />
      ),
    },
    {
      title: "To",
      description: (
        <SelectDropdown
          options={optionAirportCode}
          placeholder="Select destination"
          value={watch("to")}
          onChange={(val) => setValue("to", String(val))}
        />
      ),
    },
    // {
    //   title: "Departure Date",
    //   description: (
    //     <SingleDateRangePickerComponent
    //       value={[watch("departDate") , watch('returnDate')]}
    //       onChange={(val) => setValue("departDate", val as number)}
    //       usecase="datetime"
    //     />
    //   ),
    // },
    {
      title: "Return Date",
      description: (
        <DateTimePickerComponent
          value={watch("returnDate")}
          onChange={(val) => setValue("returnDate", val as number)}
          language="en"
        />
      ),
    },
    {
      title: "Passengers",
      description: (
        <SelectDropdown
          options={Array.from({ length: 10 }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
          }))}
          placeholder="Choose number"
          value={watch("passengers")}
          onChange={(val) => setValue("passengers", val as number)}
        />
      ),
    },
    {
      title: "Flight Type",
      description: (
        <SelectDropdown
          options={[
            { label: "Oneway", value: "oneway" },
            { label: "Roundtrip", value: "roundtrip" },
          ]}
          placeholder="Select type"
          value={watch("flightType")}
          onChange={(val) =>
            setValue("flightType", val as "oneway" | "roundtrip")
          }
        />
      ),
    },
    {
      title: "Cabin Class",
      description: (
        <SelectDropdown
          options={[
            { label: "Economy", value: "ECONOMY" },
            { label: "Business", value: "BUSINESS" },
            { label: "VIP", value: "VIP" },
          ]}
          placeholder="Select cabin"
          value={watch("cabinClass")}
          onChange={(val) => setValue("cabinClass", String(val))}
        />
      ),
    },
    {
      title: "Status",
      description: (
        <SelectDropdown
          options={[
            { label: "Scheduled", value: "scheduled" },
            { label: "Boarding", value: "boarding" },
            { label: "Departed", value: "departed" },
            { label: "Arrived", value: "arrived" },
            { label: "Delayed", value: "delayed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          placeholder="Select status"
          value={watch("status")}
          onChange={(val) => setValue("status", String(val))}
        />
      ),
    },
    {
      title: "Price Range",
      description: (
        <Box display="flex" gap={2}>
          <InputTextField
            type="number"
            placeholder="Min"
            value={String(watch("minPrice"))}
            onChange={(e) => setValue("minPrice", Number(e))}
          />
          <InputTextField
            type="number"
            placeholder="Max"
            value={String(watch("maxPrice"))}
            onChange={(e) => setValue("maxPrice", Number(e))}
          />
        </Box>
      ),
    },
    {
      title: "Gate",
      description: (
        <InputTextField
          placeholder="Enter gate"
          value={watch("gate")}
          onChange={(e) => setValue("gate", e)}
        />
      ),
    },
    {
      title: "Terminal",
      description: (
        <InputTextField
          placeholder="Enter terminal"
          value={watch("terminal")}
          onChange={(e) => setValue("terminal", e)}
        />
      ),
    },
    {
      title: "Delay Minutes",
      description: (
        <Box display="flex" gap={2}>
          <InputTextField
            type="number"
            placeholder="Min"
            value={String(watch("minDelayMinutes"))}
            onChange={(e) => setValue("minDelayMinutes", Number(e))}
          />
          <InputTextField
            type="number"
            placeholder="Max"
            value={String(watch("maxDelayMinutes"))}
            onChange={(e) => setValue("maxDelayMinutes", Number(e))}
          />
        </Box>
      ),
    },
    {
      title: "Include Cancelled",
      description: (
        <Switch
          checked={watch("includeCancelled")}
          onChange={(e) => setValue("includeCancelled", e.target.checked)}
        />
      ),
    },
  ];

  const onSubmitValue = async (values: SearchTicketType) => {
    if (!values) return;
    //setLoadingFlightBookingData(true);
    // setDisplayDataFlight([]);
    setFlightParams(values);
    //await refetchFlightBookingDataData(values);
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
                <Button type="reset" onClick={onResetForm}>
                  <RefreshOutlined />
                </Button>
                <Button type="submit">선택</Button>
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
                          {/* {fareConditions.map((fare) => (
                            <Chip
                              key={fare.value}
                              label={fare.label}
                              style={{
                                backgroundColor: getFareConditionColor(
                                  fare.label as FareConditions
                                ),
                              }}
                            />
                          ))} */}

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
                          <Button type="button">SELECT</Button>
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
              {/* {loadingFlightBookingData && (
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
              )} */}
            </Grid>
          </Box>
        </TableContainer>
      </FormControl>
    </form>
  );
};

export default BookTicket;
