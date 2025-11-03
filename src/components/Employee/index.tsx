import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import EventIcon from "@mui/icons-material/Event";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useFindPassengerTicket } from "../../context/Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import type { Ticket } from "../../utils/type";
import { ResponseCode } from "../../utils/response";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import ButtonCircle from "../../common/CustomRender/ButtonCircle";

const TicketPage: React.FC = () => {
  //   const { passenger } = useAuth();
  const [passengerId, _] = useState("cmfysyezl0000wqxcacckchrt");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const { refetchFindPassengerTicket } = useFindPassengerTicket();

  const handleFindTicket = useCallback(async () => {
    const res = await refetchFindPassengerTicket({ id: passengerId });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      setTickets(res.list as Ticket[]);
    } else {
      setTickets([]);
    }
  }, [passengerId, refetchFindPassengerTicket]);

  useEffect(() => {
    void handleFindTicket();
  }, [handleFindTicket]);

  return (
    <Box sx={{ width: 1500, mx: "auto", my: 2, px: 1 }}>
      {tickets.map((ticket, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "background.paper",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 4,
            position: "relative",
            mb: 4,
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: 30,
              height: 30,
              bgcolor: "background.default",
              borderRadius: "50%",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
            },
            "&::before": { left: "-15px" },
            "&::after": { right: "-15px" },
          }}
        >
          {/* ====== Left Part (Date + QR) ====== */}
          <Box
            sx={{
              width: { xs: "100%", sm: "30%" },
              textAlign: "center",
              position: "relative",
              py: 3,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700} lineHeight={1}>
              {ticket.seatNo + " - " + ticket.seatClass}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, ticket.bookedAt)}
            </Typography>
            {/* <QrCode2Icon sx={{ fontSize: 48, mb: 1, color: "white" }} /> */}
            <Box
              component="img"
              src={ticket.qrCodeImage}
              alt="QR Code MFA"
              sx={{
                width: 200,
                height: 200,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                mb: 3,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: 2 }}
            >
              {ticket.ticketNo ?? "UNKNOWN"}
            </Typography>

            {/* Decorative dots border effect */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                borderRight: "10px dotted white",
                opacity: 0.8,
              }}
            />
          </Box>

          {/* ====== Right Part (Event Info) ====== */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              bgcolor: "grey.50",
            }}
          >
            <>
              <Stack direction="column" spacing={2} mt={2}>
                {/* ====== Flight Prices ====== */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    width: "100%",
                    textAlign: "center",
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      ${ticket?.flight?.priceBusiness ?? "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Economy
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      ${ticket?.flight?.priceEconomy ?? "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      First Class
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      ${ticket?.flight?.priceFirst ?? "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* ====== Flight Info ====== */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    width: "100%",
                    bgcolor: "grey.50",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography fontWeight={600}>
                      {ticket?.flight?.flightStatuses?.[0]?.status ?? "Unknown"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Flight Type
                    </Typography>
                    <Typography fontWeight={600}>
                      {ticket?.flight?.flightType ?? "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Domestic
                    </Typography>
                    <Typography fontWeight={600}>
                      {ticket?.flight?.isDomestic ? "Yes" : "No"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gate
                    </Typography>
                    <Typography fontWeight={600}>
                      {ticket?.boardingPass?.gate ?? "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* ====== Boarding Time ====== */}
                <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                  <EventIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Boarding:{" "}
                    {ticket?.boardingPass?.boardingTime
                      ? formatDate(
                          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                          ticket.boardingPass.boardingTime
                        )
                      : "N/A"}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <ApartmentIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {ticket.flight?.flightNo}
                </Typography>
              </Stack>
            </>

            {/* ====== Action Buttons ====== */}
            <Box sx={{ textAlign: "right", mt: 3 }}>
              {/* <IconButton
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "grey.900",
                  color: "white",
                  borderRadius: "50%",
                  mx: 0.5,
                  transition: "all 0.3s",
                  "&:hover": { bgcolor: "grey.700" },
                }}
                title="Download Ticket"
              >
                <DownloadIcon />
              </IconButton> */}
              <ButtonCircle
                icon={<DownloadIcon />}
                text="Download Ticket"
                url="/"
              />

              <ButtonCircle
                icon={<ForwardToInboxIcon />}
                text="Send Ticket"
                url="/"
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TicketPage;
