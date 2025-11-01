import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Stack,
} from "@mui/material";
import {
  Flight,
  Person,
  Luggage,
  QrCode2,
  EventSeat,
} from "@mui/icons-material";
import type { Ticket, TicketResponseMessage } from "../../utils/type";
import { DateFormatEnum, formatDate } from "../../hooks/format";

// Component for displaying ticket card
const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  if (!ticket) {
    return <Typography>No item</Typography>;
  }

  return (
    <Stack sx={{ width: "100%", mb: 3, borderRadius: 2 }}>
      {/* Ticket Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          {ticket.ticketNo}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            label={ticket.seatClass}
            color={ticket.seatClass === "ECONOMY" ? "primary" : "secondary"}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<EventSeat />}
            label={`Seat ${ticket.seatNo}`}
            variant="filled"
            size="small"
            color="info"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Flight Information */}
        <Grid size={6}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Flight sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" fontWeight="medium">
                Flight Information
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6" fontWeight="bold">
                {ticket?.flight?.departureAirport} →{" "}
                {ticket?.flight?.arrivalAirport}
              </Typography>
              <Chip
                label={ticket?.flight?.flightNo}
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Aircraft: {ticket?.flight?.aircraftCode} • Terminal:{" "}
              {ticket?.flight?.flightNo}
            </Typography>

            <Box sx={{ display: "grid", gap: 0.5 }}>
              <Typography variant="body2">
                <strong>Departure:</strong>{" "}
                {formatDate(
                  DateFormatEnum.DDD_MMM_D_YYYY,
                  ticket?.flight?.scheduledDeparture
                )}
              </Typography>
              <Typography variant="body2">
                <strong>Arrival:</strong>{" "}
                {formatDate(
                  DateFormatEnum.DDD_MMM_D_YYYY,
                  ticket?.flight?.scheduledArrival
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Passenger Information */}
        <Grid size={6}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" fontWeight="medium">
                Passenger Information
              </Typography>
            </Box>

            <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
              {ticket?.passenger?.fullName}
            </Typography>

            <Box sx={{ display: "grid", gap: 0.5 }}>
              <Typography variant="body2">
                <strong>Email:</strong>
                {ticket?.passenger?.email}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {ticket?.passenger?.phone}
              </Typography>
              <Typography variant="body2">
                <strong>Passport:</strong> {ticket?.passenger?.passport}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Boarding Pass Information */}
        <Grid size={6}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <QrCode2 sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" fontWeight="medium">
                Boarding Pass
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  <strong>Gate:</strong>
                </Typography>
                <Typography variant="body2">
                  {ticket?.boardingPass?.gate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  <strong>Boarding Time:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(
                    DateFormatEnum.DDD_MMM_D_YYYY,
                    ticket?.boardingPass?.boardingTime
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  <strong>Issued At:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(
                    DateFormatEnum.DDD_MMM_D_YYYY,
                    ticket?.boardingPass?.issuedAt
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Baggage Information */}
        <Grid size={6}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Luggage sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" fontWeight="medium">
                Baggage
              </Typography>
            </Box>

            {ticket?.baggage?.length ? (
              <List dense sx={{ py: 0 }}>
                {ticket.baggage.map((bag, index) => (
                  <React.Fragment key={bag.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2">
                              <strong>Weight:</strong> {bag.weight} kg
                            </Typography>
                            <Chip
                              label={bag.status}
                              color={getStatusColor(bag.status) as any}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Checked at:{" "}
                            {formatDate(
                              DateFormatEnum.DDD_MMM_D_YYYY,
                              bag.checkedAt
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < (ticket?.baggage?.length ?? 0) - 1 ? (
                      <Divider />
                    ) : (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No baggage information
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Information */}
      <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
          Booked at:{" "}
          {formatDate(DateFormatEnum.DDD_MMM_D_YYYY, ticket.bookedAt)}
        </Typography>
      </Box>
    </Stack>
  );
};

// Main component to display ticket list
const TicketListManagement: React.FC<{ data: TicketResponseMessage }> = ({
  data,
}) => {
  if (data.resultCode !== "00") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          Error: {data.resultMessage}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Tickets
      </Typography>

      {data?.list?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No tickets found
          </Typography>
        </Paper>
      ) : (
        <Box>
          {data?.list?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Box>
      )}
    </>
  );
};

export default TicketListManagement;
