import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSearchBooking } from "../../context/Api/usePostApi";
import { FlightOutlined, RefreshOutlined } from "@mui/icons-material";
import Zigzag from "../../common/IconComponent/Zigzag";
import type { IDetailItem } from "../../common/AdditionalCustomFC/DetailSection";
import DetailSection from "../../common/AdditionalCustomFC/DetailSection";
import InputTextField from "../../common/Input/InputTextField";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useFindAllFlightStatuses,
  useFindAllFlightTypes,
  useFindAllSeatTypes,
  useGetAllCode,
} from "../../context/Api/useGetApi";
import DateTimePickerComponent from "../../common/DayPicker";
import type { SearchBookingFlightProps } from "../../utils/type";
import type { SearchFlightDto } from "./../Admin/component/Flight/Search_layout";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import Android12Switch from "./../../common/Switch/Switch";
import { ResponseCode } from "../../utils/response";

const flightParams: SearchFlightDto = {
  from: "",
  to: "",
  status: "",
  cabinClass: "ECONOMY",
  aircraftCode: "",
  minPrice: 0,
  maxPrice: 0,
  gate: "",
  terminal: "",
  minDelayMinutes: 0,
  maxDelayMinutes: 0,
  includeCancelled: false,
};

const BookTicket = () => {
  const { getAllCode } = useGetAllCode();
  const { dataFlightTypes } = useFindAllFlightTypes();
  const { dataSeatTypes } = useFindAllSeatTypes();
  const { dataFlightStatuses } = useFindAllFlightStatuses();
  const flightTypeOption = mapStringToDropdown(dataFlightTypes?.data || []);
  const seatTypeOption = mapStringToDropdown(dataSeatTypes?.data || []);
  const flightStatusesOption = mapStringToDropdown(
    dataFlightStatuses?.data || []
  );

  const {
    reset: resetSearch,
    handleSubmit,
    setValue,
    watch,
  } = useForm<SearchFlightDto>({
    defaultValues: flightParams,
    mode: "onChange",
  });

  const [outboundBookings, setOutboundBookings] = React.useState<
    SearchBookingFlightProps[]
  >([]);
  const [inboundBookings, setInboundBookings] = React.useState<
    SearchBookingFlightProps[]
  >([]);

  const { refetchSearchBooking } = useSearchBooking();

  const onSubmitValue = async (values: SearchFlightDto) => {
    if (!values) return;

    const payload = Object.entries(values).reduce((acc, [key, val]) => {
      if (
        val !== undefined &&
        (typeof val === "string" ? val.trim() !== "" : true) &&
        (typeof val === "number" ? !isNaN(val) && val !== 0 : true)
      ) {
        (acc as Record<string, unknown>)[key] = val;
      }
      return acc;
    }, {} as Partial<SearchFlightDto>);

    const res = await refetchSearchBooking(payload);

    if (res?.resultCode === ResponseCode.SUCCESS) {
      setOutboundBookings(res.data?.outbound || []);
      setInboundBookings(res.data?.inbound || []);
    }
  };

  const onResetForm = () => {
    resetSearch();
  };

  // const formatBookingTime = (bookingTime: string | number) => {
  //   if (typeof bookingTime === "number") {
  //     return new Date(bookingTime).toLocaleString();
  //   }
  //   return new Date(bookingTime).toLocaleString();
  // };

  const optionAirportCode = (getAllCode?.data?.airport ?? []).map((item) => ({
    value: item.code,
    label: item.code,
  }));

  const optionAircraftCode = (getAllCode?.data?.aircraft ?? []).map((item) => ({
    value: item.code,
    label: item.code,
  }));

  const detail: IDetailItem[] = [
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
      title: "Flight Type",
      description: (
        <SelectDropdown
          options={flightTypeOption}
          placeholder="Select type"
          value={watch("flightType")}
          onChange={(val) => setValue("flightType", val as string)}
        />
      ),
    },
    {
      title: "Cabin Class",
      description: (
        <SelectDropdown
          options={seatTypeOption}
          placeholder="Select cabin"
          value={watch("cabinClass")}
          onChange={(val) => setValue("cabinClass", val as string)}
        />
      ),
    },
    {
      title: "Status",
      description: (
        <SelectDropdown
          options={flightStatusesOption}
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
      title: "Aircraft Code",
      description: (
        <SelectDropdown
          options={optionAircraftCode}
          placeholder="Enter aircraft Code"
          value={watch("aircraftCode")}
          onChange={(val) => setValue("aircraftCode", String(val))}
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
        <Android12Switch
          checked={watch("includeCancelled")}
          onChange={(e) => setValue("includeCancelled", e.target.checked)}
        />
      ),
    },
  ];

  const renderContentFlight = useCallback(
    (data: SearchBookingFlightProps[]) => {
      return (
        <Box>
          {data.length > 0 ? (
            data.map((booking) => (
              <Grid size={12} key={booking.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    padding: 2,
                    boxShadow: 3,
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
                    {/* Thông tin Booking */}
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
                        Booking ID: {booking.id}
                      </Typography>
                      <Typography variant="body2">
                        Passenger ID: {booking.passengerId}
                      </Typography>
                      <Typography variant="body2">
                        Booking Time:{" "}
                        {formatDate(
                          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                          booking.bookingTime
                        )}
                      </Typography>
                    </Box>

                    {/* Thông tin Flight */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 3,
                      }}
                    >
                      <Box sx={{ alignContent: "center" }}>
                        <FlightOutlined
                          sx={{ fontSize: 60, transform: "rotate(50deg)" }}
                        />
                        <Typography variant="body1" color="black">
                          Flight Number: {booking.flight.flightNo}
                        </Typography>
                      </Box>

                      <Box sx={{ alignContent: "center", minWidth: 160 }}>
                        <Typography variant="h6" color="text.secondary">
                          {booking.flight.aircraftCode}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            {formatDate(
                              DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                              booking.flight.scheduledDeparture
                            )}
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
                            }}
                          >
                            {booking.flight.departureAirport}
                          </Box>
                        </Box>

                        <Zigzag
                          items={
                            <FlightOutlined
                              fontSize="medium"
                              sx={{
                                color: "#007bff",
                                // transform: "rotate(90deg)",
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
                            {formatDate(
                              DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                              booking.flight.scheduledArrival
                            )}
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
                            }}
                          >
                            {booking.flight.arrivalAirport}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ alignContent: "center" }}>
                        <Typography variant="body1" color="black">
                          Status: {booking.flight.flightStatuses?.[0].status}
                        </Typography>
                      </Box>

                      <Box sx={{ alignContent: "center" }}>
                        <Button type="button" variant="contained">
                          INFO BOOKING
                        </Button>
                      </Box>
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
                Không có dữ liệu chuyến đi
              </Typography>
            </Grid>
          )}
        </Box>
      );
    },
    []
  );

  return (
    <FormControl
      component="form"
      onSubmit={handleSubmit(onSubmitValue)}
      sx={{ width: "100%" }}
    >
      <TableContainer sx={{ p: 1 }}>
        <Box sx={{ borderRadius: 2, border: "solid 3px #f2f3f8" }}>
          <Box borderRadius={2} border="3px solid #f2f3f8" p={3}>
            <DetailSection data={detail} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button type="button" onClick={onResetForm}>
                <RefreshOutlined />
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
        </Box>

        <Box mt={2}>
          {/* Hiển thị Outbound Bookings */}
          <Typography variant="h6" mt={2}>
            Outbound Flights
          </Typography>
          <Grid container spacing={2} mt={1}>
            {renderContentFlight(outboundBookings)}
          </Grid>

          {/* Hiển thị Inbound Bookings */}
          <Typography variant="h6" mt={4}>
            Inbound Flights
          </Typography>
          <Grid container spacing={2} mt={1}>
            {renderContentFlight(inboundBookings)}
          </Grid>
        </Box>
      </TableContainer>
    </FormControl>
  );
};

export default memo(BookTicket);
