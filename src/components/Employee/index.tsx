import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Grid,
  Collapse,
  Button,
} from "@mui/material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { useFindPassengerTicket } from "../../context/Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import type { Ticket } from "../../utils/type";
import { ResponseCode } from "../../utils/response";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import TicketInfo from "./TicketInfo";
import theme from "../../scss/theme";
import AccountSecurity from "../Common/AccountSecurity";
import { FaTicketAlt } from "react-icons/fa";
import { Download, KeyboardArrowDown, Print } from "@mui/icons-material";

const TicketPage: React.FC = () => {
  const { passenger } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [navigateTicketNo, setNavigateTicketNo] = useState(false);
  const { refetchFindPassengerTicket } = useFindPassengerTicket();
  const [ticketNo, setTicketNo] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const getTicketStatus = (ticket: Ticket) => {
    if (!ticket.flight || !ticket.flight.scheduledDeparture) return "unknown";

    const now = new Date().getTime();
    const departure = Number(ticket.flight.scheduledDeparture);
    const boarding = ticket.boardingPass?.boardingTime
      ? Number(ticket.boardingPass.boardingTime)
      : null;

    if (now > departure) return "flown";
    if (boarding && now > boarding) return "expired";
    return "upcoming";
  };

  const upcomingTickets = tickets.filter(
    (t) => getTicketStatus(t) === "upcoming"
  );
  const flownTickets = tickets.filter((t) => getTicketStatus(t) === "flown");
  const expiredTickets = tickets.filter(
    (t) => getTicketStatus(t) === "expired"
  );

  const handleFindTicket = useCallback(async () => {
    const res = await refetchFindPassengerTicket({ id: passenger?.id || "" });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      setTickets(res.list as Ticket[]);
    } else {
      setTickets([]);
    }
  }, [passenger?.id, refetchFindPassengerTicket]);

  useEffect(() => {
    void handleFindTicket();
  }, [handleFindTicket]);

  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const toggleExpand = (ticketNo: string) => {
    setExpandedTicket(expandedTicket === ticketNo ? null : ticketNo);
  };

  if (navigateTicketNo) {
    return <TicketInfo ticketNo={ticketNo} id={passenger?.id || ""} />;
  }

  const renderTicketsMini = (ticketList: Ticket[]) => {
    return ticketList.map((ticket, idx) => (
      <Box
        key={ticket.ticketNo || idx}
        sx={{
          mb: 2,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 1,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {/* Compact View */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            cursor: "pointer",
          }}
          onClick={() => toggleExpand(ticket.ticketNo)}
        >
          {/* Left: Seat & Class Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 120,
              mr: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                borderRadius: 1,
                mr: 2,
              }}
            >
              <FaTicketAlt color="white" />
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Flight
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {ticket.flight?.flightNo || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Boarding
                </Typography>
                <Typography variant="body2">
                  {ticket.boardingPass?.boardingTime
                    ? formatDate(
                        DateFormatEnum.DDD_MMM_D_YYYY,
                        ticket.boardingPass.boardingTime
                      )
                    : "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Status
                </Typography>
                <Chip
                  label={ticket.boardingPass?.status || "Confirmed"}
                  size="small"
                  color={
                    ticket.boardingPass?.status === "BOARDED"
                      ? "success"
                      : ticket.boardingPass?.status === "PENDING"
                      ? "warning"
                      : "default"
                  }
                />
              </Box>
            </Stack>
          </Box>

          {/* Right: Actions & Expand Indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setTicketNo(ticket.ticketNo);
                setNavigateTicketNo(true);
              }}
              sx={{
                bgcolor: theme.palette.success.light,
                color: theme.palette.success.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.success.main,
                },
              }}
            >
              <ForwardToInboxIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleExpand(ticket.ticketNo)}
            >
              <KeyboardArrowDown
                sx={{
                  transform:
                    expandedTicket === ticket.ticketNo
                      ? "rotate(180deg)"
                      : "none",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Expanded Detail View */}
        <Collapse in={expandedTicket === ticket.ticketNo}>
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.grey[50],
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3}>
              {/* Passenger Information */}
              <Grid size={6}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Passenger Information
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Name:{ticket.passenger?.email}
                    </Typography>
                    <Typography variant="body2">
                      {ticket.passenger?.fullName || "N/A"}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Booking Reference:
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Flight Details */}
              <Grid size={6}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  Flight Details
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Departure:
                    </Typography>
                    <Typography variant="body2">
                      {ticket.flight?.scheduledDeparture
                        ? formatDate(
                            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                            ticket.flight.scheduledDeparture
                          )
                        : "N/A"}
                    </Typography>
                  </Box>
                  {ticket.boardingPass?.gate && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        Gate:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {ticket.boardingPass.gate}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>

              {/* Additional Actions */}
              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    pt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                  >
                    Download PDF
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Print />}>
                    Print Ticket
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    ));
  };

  return (
    <Box sx={{ width: "1500px", mx: "auto", my: 2, px: 1 }}>
      <Tabs
        value={tabValue}
        onChange={(_, newVal) => setTabValue(newVal)}
        aria-label="Ticket Tabs"
      >
        <Tab label={`Upcoming (${upcomingTickets.length})`} />
        <Tab label={`Completed (${flownTickets.length})`} />
        <Tab label={`Expired (${expiredTickets.length})`} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {/* <AccountSecurity /> */}
        {tabValue === 0 ? (
          upcomingTickets.length ? (
            renderTicketsMini(upcomingTickets)
          ) : (
            <Typography>No upcoming tickets.</Typography>
          )
        ) : tabValue === 1 ? (
          flownTickets.length ? (
            renderTicketsMini(flownTickets)
          ) : (
            <Typography>No completed tickets.</Typography>
          )
        ) : expiredTickets.length ? (
          renderTicketsMini(expiredTickets)
        ) : (
          <AccountSecurity />
        )}

        {/* <AccountSecurity /> */}
      </Box>
    </Box>
  );
};

export default TicketPage;
