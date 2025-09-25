import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  Switch,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useSearchBooking } from "../Api/usePostApi";
import { FlightOutlined, RefreshOutlined } from "@mui/icons-material";
import Zigzag from "../../common/CustomRender/Zigzag";
import type { IDetailItem } from "../../common/DetailSection";
import DetailSection from "../../common/DetailSection";
import InputTextField from "../../common/Input/InputTextField";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { useGetAllCode } from "../Api/useGetApi";
import DateTimePickerComponent from "../../common/DayPicker/date-range-picker";
import type { DataFlight } from "../../utils/type";
import type { CabinClassType, SearchFlightDto } from "../Admin/Search_layout";

const BookTicket = () => {
  const [flightParams, setFlightParams] = React.useState<SearchFlightDto>({
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
  });
  const { getAllCode } = useGetAllCode();

  const {
    reset: resetSearch,
    handleSubmit,
    setValue,
    watch,
  } = useForm<SearchFlightDto>({
    defaultValues: flightParams,
  });

  const [flightOutboundData, setFlightOutboundList] = React.useState<
    DataFlight[]
  >([]);
  const [flightInboundData, setFlightInboundList] = React.useState<
    DataFlight[]
  >([]);

  const { refetchSearchBooking } = useSearchBooking();
  //const filterEmptyFields = (data: SearchFlightDto): Partial<SearchFlightDto> => {
  //   const filteredData: Partial<SearchFlightDto> = {};

  //   Object.entries(data).forEach(([key, value]) => {
  //     // Chỉ giữ lại các trường có giá trị
  //     if (value !== "" && value !== null && value !== undefined && value !== 0) {
  //       // Riêng với boolean, luôn gửi nếu có giá trị
  //       if (typeof value === 'boolean') {
  //         filteredData[key as keyof SearchFlightDto] = value;
  //       }
  //       // Riêng với số, chỉ gửi nếu > 0 (trừ minPrice/maxPrice có thể là 0)
  //       else if (typeof value === 'number') {
  //         if (key === 'minPrice' || key === 'maxPrice' || key === 'minDelayMinutes' || key === 'maxDelayMinutes') {
  //           if (value > 0) {
  //             filteredData[key as keyof SearchFlightDto] = value;
  //           }
  //         } else if (value > 0) {
  //           filteredData[key as keyof SearchFlightDto] = value;
  //         }
  //       }
  //       // Với string, chỉ gửi nếu không rỗng
  //       else if (typeof value === 'string' && value.trim() !== '') {
  //         filteredData[key as keyof SearchFlightDto] = value;
  //       }
  //     }
  //   });

  //   return filteredData;
  // };

  const onSubmitValue = async (values: SearchFlightDto) => {
    if (!values) return;
    const res = await refetchSearchBooking(values);
    if (res?.resultCode === "00") {
      setFlightOutboundList(res.data?.outbound?.map((b) => b.flight) || []);
      setFlightInboundList(res.data?.inbound?.map((b) => b.flight) || []);
    }
    console.log("values", values);
    console.log("onSubmitValue", res);
    //await refetchFlightBookingDataData(values);
  };

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
          onChange={(val) => setValue("cabinClass", val as CabinClassType)}
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
      title: "aircraft Code",
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
        <Switch
          checked={watch("includeCancelled")}
          onChange={(e) => setValue("includeCancelled", e.target.checked)}
        />
      ),
    },
  ];

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
                선택
              </Button>
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" mt={2}>
            Outbound Flights
          </Typography>
          <Grid container spacing={2} mt={1}>
            {flightOutboundData.length > 0 ? (
              flightOutboundData.map((flight) => (
                <Grid size={12} key={flight.flightId}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      padding: 2,
                      boxShadow: 3,
                      maxWidth: "95%",
                      margin: "0 auto",
                      display: "flex",
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
                        <Button type="button" variant="contained">
                          SELECT
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
                  width="100%"
                  mt={1}
                  color="text.secondary"
                >
                  Không có dữ liệu chuyến đi
                </Typography>
              </Grid>
            )}
          </Grid>

          <Typography variant="h6" mt={4}>
            Inbound Flights
          </Typography>
          <Grid container spacing={2} mt={1}>
            {flightInboundData.length > 0 ? (
              flightInboundData.map((flight) => (
                <Grid size={12} key={flight.flightId}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      padding: 2,
                      boxShadow: 3,
                      maxWidth: "95%",
                      margin: "0 auto",
                      display: "flex",
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
                      {/* Add inbound flight content similar to outbound */}
                      <Box sx={{ alignContent: "center" }}>
                        <FlightOutlined
                          sx={{ fontSize: 100, transform: "rotate(50deg)" }}
                        />
                        <Typography variant="body1" color="black">
                          Flight Number: {flight.flightNo}
                        </Typography>
                      </Box>
                      <Box sx={{ alignContent: "center", minWidth: 160 }}>
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
                        <Button type="button" variant="contained">
                          SELECT
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
                  width="100%"
                  mt={1}
                  color="text.secondary"
                >
                  Không có dữ liệu chuyến về
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </TableContainer>
    </FormControl>
  );
};

export default BookTicket;
