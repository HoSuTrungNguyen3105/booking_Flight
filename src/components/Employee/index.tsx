import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Stack, Tabs, Tab } from "@mui/material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import EventIcon from "@mui/icons-material/Event";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useFindPassengerTicket } from "../../context/Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import type { Ticket } from "../../utils/type";
import { ResponseCode } from "../../utils/response";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import ButtonCircle from "../../common/CustomRender/ButtonCircle";
import TicketInfo from "./TicketInfo";
import theme from "../../scss/theme";
import AccountSecurity from "../Common/AccountSecurity";

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

  if (navigateTicketNo) {
    return <TicketInfo ticketNo={ticketNo} id={passenger?.id || ""} />;
  }

  const renderTicketsMini = (ticketList: Ticket[]) => {
    return ticketList.map((ticket, idx) => (
      <Box
        key={idx}
        sx={{
          display: "flex",
          mb: 2,
          bgcolor: theme.palette.grey[500],
          p: 2,
          borderRadius: 2,
        }}
      >
        {/* Left: Seat info */}
        <Box
          sx={{
            mr: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {ticket.seatNo} - {ticket.seatClass}
          </Typography>
        </Box>

        {/* Right: Flight info */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">
              Boarding:{" "}
              {ticket.boardingPass?.boardingTime
                ? formatDate(
                    DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                    ticket.boardingPass.boardingTime
                  )
                : "N/A"}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <ApartmentIcon fontSize="small" color="action" />
            <Typography variant="body2">{ticket.flight?.flightNo}</Typography>
          </Stack>

          <Box
            onClick={() => {
              setTicketNo(ticket.ticketNo);
              setNavigateTicketNo(true);
            }}
            sx={{ textAlign: "right", mt: 1 }}
          >
            <ButtonCircle
              icon={<ForwardToInboxIcon />}
              text="Send Ticket"
              setState={setNavigateTicketNo}
            />
          </Box>
        </Box>
      </Box>
    ));
  };

  return (
    <Box sx={{ width: 1500, mx: "auto", my: 2, px: 1 }}>
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
        <AccountSecurity />
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
          <Typography>No expired tickets.</Typography>
        )}

        {/* <AccountSecurity /> */}
      </Box>
    </Box>
  );
};

export default TicketPage;
