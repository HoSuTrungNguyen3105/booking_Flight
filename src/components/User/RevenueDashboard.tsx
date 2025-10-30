import React from "react";
import { Box, Typography, Grid } from "@mui/material";

interface RevenueData {
  month: string;
  income: number;
  expense: number;
}

// Mock data
const revenueData: RevenueData[] = [
  { month: "Feb", income: 12000, expense: 8000 },
  { month: "Mar", income: 15000, expense: 9000 },
  { month: "Apr", income: 18000, expense: 10000 },
  { month: "May", income: 22000, expense: 12000 },
  { month: "Jun", income: 25000, expense: 14000 },
  { month: "Jul", income: 30000, expense: 18000 },
];

const RevenueDashboard: React.FC = () => {
  const totalIncome = revenueData.reduce((sum, data) => sum + data.income, 0);
  const maxValue = Math.max(...revenueData.map((d) => d.income));

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid size={12} sx={{ md: 8 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Revenue Growth
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">Income</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#f44336",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">Expense</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Last 6 Months
          </Typography>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ${totalIncome.toLocaleString()}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 200,
              gap: 2,
              mt: 3,
            }}
          >
            {revenueData.map((data, _) => (
              <Box
                key={data.month}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    height: 150,
                    gap: 1,
                  }}
                >
                  {/* Income bar */}
                  <Box
                    sx={{
                      width: 16,
                      height: `${(data.income / maxValue) * 100}%`,
                      backgroundColor: "#4caf50",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                  {/* Expense bar */}
                  <Box
                    sx={{
                      width: 16,
                      height: `${(data.expense / maxValue) * 100}%`,
                      backgroundColor: "#f44336",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {data.month}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="body2">0</Typography>
            <Typography variant="body2">5K</Typography>
            <Typography variant="body2">10K</Typography>
            <Typography variant="body2">15K</Typography>
            <Typography variant="body2">20K</Typography>
          </Box>
          {/* </RevenueCard> */}
        </Grid>

        {/* Bookings Section */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            All Bookings
          </Typography>

          {/* {bookingData.map((booking) => (
            // <BookingCard key={booking.id}>
            <CardContent key={booking.id}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={12} sx={{ md: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {booking.airline}
                  </Typography>
                </Grid>

                <Grid size={12} sx={{ md: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.departure.city}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.departure.airport}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FlightTakeoff fontSize="small" color="action" />
                        <Typography variant="body2">
                          {booking.departure.time}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: "center", mx: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        {booking.date}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">
                          {booking.duration}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.arrival.city}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.arrival.airport}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <FlightLand fontSize="small" color="action" />
                        <Typography variant="body2">
                          {booking.arrival.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={12} sx={{ md: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    Flight Details
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ mt: 1, borderRadius: 2, height: 8 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            // </BookingCard>
          ))} */}
        </Grid>

        {/* Flights Schedule Header */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Flights Schedule
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Upcoming flights for the next 7 days
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueDashboard;
