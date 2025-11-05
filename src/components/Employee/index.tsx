import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useFindPassengerTicket } from "../../context/Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import type { Ticket } from "../../utils/type";
import { ResponseCode } from "../../utils/response";
import TicketInfo from "./TicketInfo";
// import TicketCard from "./TicketCard";

const TicketPage: React.FC = () => {
  const { passenger } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  // const [navigateTicketNo, setNavigateTicketNo] = useState(false);
  const { refetchFindPassengerTicket } = useFindPassengerTicket();
  const [ticketNo, setTicketNo] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const getTicketStatus = (ticket: Ticket) => {
    if (!ticket.flight || !ticket.flight.scheduledDeparture) return "unknown";
    setTicketNo(ticket.ticketNo);
    const now = new Date().getTime();
    const departure = Number(ticket.flight.scheduledDeparture);
    const boarding = ticket.boardingPass?.boardingTime
      ? Number(ticket.boardingPass.boardingTime)
      : null;

    if (now > departure) return "flown"; // đã bay
    if (boarding && now > boarding) return "expired"; // hết hạn boarding
    return "upcoming"; // sắp bay
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
    handleFindTicket();
  }, [handleFindTicket]);

  // if (navigateTicketNo) {
  //   return <TicketInfo ticketNo={ticketNo} id={passenger?.id || ""} />;
  // }

  return (
    <Box sx={{ width: 1500, mx: "auto", my: 2, px: 1 }}>
      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        aria-label="Ticket Tabs"
      >
        <Tab label={`Upcoming (${upcomingTickets.length})`} />
        <Tab label={`Completed (${flownTickets.length})`} />
        <Tab label={`Expired (${expiredTickets.length})`} />
      </Tabs>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 &&
          (upcomingTickets.length > 0 ? (
            upcomingTickets.map((ticket, index) => (
              <TicketInfo
                key={index}
                // ticket={ticket}
                ticketNo={ticketNo}
                id={passenger?.id || ""}
              />
            ))
          ) : (
            <Typography>No upcoming tickets.</Typography>
          ))}

        {tabValue === 1 &&
          (flownTickets.length > 0 ? (
            flownTickets.map((ticket, index) => (
              <TicketInfo
                key={index}
                // ticket={ticket}
                ticketNo={ticketNo}
                id={passenger?.id || ""}
              />
            ))
          ) : (
            <Typography>No completed tickets.</Typography>
          ))}

        {tabValue === 2 &&
          (expiredTickets.length > 0 ? (
            expiredTickets.map((ticket, index) => (
              <TicketInfo
                key={index}
                // ticket={ticket}
                ticketNo={ticketNo}
                id={passenger?.id || ""}
              />
            ))
          ) : (
            <Typography>No expired tickets.</Typography>
          ))}
      </Box>
    </Box>
  );
};

export default TicketPage;
