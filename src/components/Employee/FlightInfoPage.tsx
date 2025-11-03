import React from "react";
import { useGetAllFlightMainInfo } from "../../context/Api/useGetApi";
import { formatDate } from "../../hooks/format";
import { Card, Grid } from "@mui/material";

const FlightInfoPage = () => {
  const { getAllFlightInfoInfo } = useGetAllFlightMainInfo();
  const res = getAllFlightInfoInfo?.list || [];
  return (
    <div>
      <Grid container spacing={2} mt={1}>
        {res.length > 0 ? (
          res.map((booking) => (
            <Grid size={12} key={booking.flightId}>
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
                      Booking ID: {booking.flightId}
                    </Typography>
                    <Typography variant="body2">
                      aircraftCode ID: {booking.aircraftCode}
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

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6">
                          {formatDateKR(
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
                          {formatDateKR(
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
      </Grid>
    </div>
  );
};

export default FlightInfoPage;
