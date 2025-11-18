import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import { PlaneTakeoff, PlaneLanding, ChevronDown } from "lucide-react";
import theme from "../../scss/theme";

const TripSummary = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const FlightCard = ({
    type,
    departure,
    arrival,
    duration,
    stops,
  }: {
    type: "Departing" | "Returning";
    departure: string;
    arrival: string;
    duration: string;
    stops: string;
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          mb: 1,
        }}
      >
        {type === "Departing" ? (
          <PlaneTakeoff size={20} style={{ marginRight: 8 }} />
        ) : (
          <PlaneLanding size={20} style={{ marginRight: 8 }} />
        )}
        {type} flight
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          BOS → HND
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {departure} – {arrival}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {duration} • {stops}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seat assigned at check-in
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            alignItems: "center",
          }}
        >
          <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
            Flight details
          </Link>
          <Link href="#" color="error" underline="hover" sx={{ fontSize: 14 }}>
            Change flight
          </Link>
        </Box>
      </Paper>
    </Box>
  );

  const PriceSummary = () => (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Summary
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Price per passenger (Blue Cabin)
        </Typography>
        <Typography variant="body2">$1,080</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Tax
        </Typography>
        <Typography variant="body2">$71</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" fontWeight="bold">
          $1,151
        </Typography>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.2,
          background: "linear-gradient(to right, #2196f3, #21cbf3)",
        }}
      >
        Continue
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Trip summary
      </Typography>

      {isMobile ? (
        <>
          <FlightCard
            type="Departing"
            departure="8:10 am"
            arrival="2:55 pm"
            duration="16h 40m"
            stops="1 stop (SEA, 45m layover)"
          />
          <FlightCard
            type="Returning"
            departure="7:20 pm"
            arrival="9:00 pm"
            duration="15h 41m"
            stops="1 stop (LAX, 1h 30m layover)"
          />
          <PriceSummary />
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown size={18} />}>
              <Typography>Need help?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link href="#">Contact us</Link>
              <Typography variant="body2" color="text.secondary">
                FAQ · Change/Cancel · Policies
              </Typography>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <Grid container spacing={4}>
          <Grid size={7}>
            <FlightCard
              type="Departing"
              departure="8:10 am"
              arrival="2:55 pm"
              duration="16h 40m"
              stops="1 stop (SEA, 45m layover)"
            />
            <FlightCard
              type="Returning"
              departure="7:20 pm"
              arrival="9:00 pm"
              duration="15h 41m"
              stops="1 stop (LAX, 1h 30m layover)"
            />
          </Grid>
          <Grid size={5}>
            <PriceSummary />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TripSummary;
