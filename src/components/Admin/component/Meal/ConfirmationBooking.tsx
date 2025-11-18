import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant,
  Download,
  Email,
} from "@mui/icons-material";

export default function Confirmation() {
  const searchParams = new URLSearchParams(window.location.search);
  //const bookingId = searchParams.get("bookingId") || "";

  //   const { data: booking } = useQuery<Booking>({
  //     queryKey: ['/api/bookings', bookingId],
  //   });

  //   const selectedMeals =
  //     allMeals?.filter((meal) => booking?.mealIds?.includes(meal.id)) || [];

  //   if (!booking) {
  //     return (
  //       <Box
  //         sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
  //       >
  //           <Typography variant="h5" gutterBottom>
  //             Loading...
  //           </Typography>
  //       </Box>
  //     );
  //   }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        {/* Success Icon */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "success.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: "success.main" }} />
          </Box>
          <Typography
            variant="h3"
            gutterBottom
            data-testid="text-confirmation-title"
          >
            Booking Confirmed!
          </Typography>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ mb: 2 }}
            data-testid="text-booking-reference"
          >
            {booking.bookingReference}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A confirmation email has been sent to {booking.passengerEmail}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 6,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Download />}
            data-testid="button-download-pdf"
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Email />}
            data-testid="button-email-itinerary"
          >
            Email Itinerary
          </Button>
        </Box>

        {/* Booking Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Passenger Info */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Passenger Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {booking.passengerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {booking.passengerEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {booking.passengerPhone}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Flight Details */}
          {flight && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <FlightIcon sx={{ color: "primary.main" }} />
                  <Typography variant="h6">Flight Details</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      {flight.origin} → {flight.destination}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Airline
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {flight.airline}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Flight Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {flight.flightNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Departure
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {flight.departureTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Arrival
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {flight.arrivalTime}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Hotel Details */}
          {hotel && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <HotelIcon sx={{ color: "primary.main" }} />
                  <Typography variant="h6">Hotel Details</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {hotel.location}
                </Typography>
                <Typography variant="body2">{hotel.description}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Meals */}
          {selectedMeals.length > 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Restaurant sx={{ color: "primary.main" }} />
                  <Typography variant="h6">Selected Meals</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {selectedMeals.map((meal) => (
                    <Typography key={meal.id} variant="body1">
                      • {meal.name} - {meal.category}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Total */}
          <Card sx={{ backgroundColor: "primary.light" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Total Amount Paid</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  ${booking.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Back to Home */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Link href="/">
            <Button
              variant="contained"
              size="large"
              data-testid="button-back-home"
            >
              Book Another Trip
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
