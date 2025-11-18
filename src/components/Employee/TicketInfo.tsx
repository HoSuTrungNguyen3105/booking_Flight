import React, { useCallback, useEffect, useState } from "react";
import {
  useFindOnePassengerTicket,
  type GetReqponseOneTicket,
} from "../../context/Api/usePostApi";
import { Box, Stack, Typography } from "@mui/material";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import {
  Apartment,
  Download,
  Event,
  ForwardToInbox,
} from "@mui/icons-material";
import ButtonCircle from "../../common/Button/ButtonCircle";
import type { Ticket } from "../../utils/type";
import { ResponseCode } from "../../utils/response";

const TicketInfo = ({ id, ticketNo }: GetReqponseOneTicket) => {
  const [ticket, setTicket] = useState<Ticket[]>([]);
  const { refetchFindPassengerTicket } = useFindOnePassengerTicket();

  const handleGetInfoTicket = useCallback(async () => {
    if (!id || !ticketNo) return;

    const res = await refetchFindPassengerTicket({ id, ticketNo });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      setTicket(res.list || []);
    }
  }, [id, ticketNo, refetchFindPassengerTicket]);

  useEffect(() => {
    handleGetInfoTicket();
  }, [handleGetInfoTicket]);

  return (
    <Stack>
      {ticket?.map((ticket, index) => (
        <Box
          key={index}
          sx={{
            height: 450,
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
              {ticket.bookings.seatClass + " - " + ticket.bookings.seatClass}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {formatDate(
                DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                ticket.bookings.bookingTime
              )}
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
            <Stack direction="column" spacing={2} mt={2}>
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
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography fontWeight={600}>
                  {ticket?.flight?.flightStatuses?.[0]?.status ?? "Unknown"}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Flight Type
                </Typography>
                <Typography fontWeight={600}>
                  {ticket?.flight?.flightType ?? "N/A"}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Domestic
                </Typography>
                <Typography fontWeight={600}>
                  {ticket?.flight?.isDomestic ? "Yes" : "No"}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Gate
                </Typography>
                <Typography fontWeight={600}>
                  {ticket?.boardingPass?.gate ?? "N/A"}
                </Typography>
              </Box>

              {/* ====== Boarding Time ====== */}
              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Event fontSize="small" color="action" />
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
              <Apartment fontSize="small" color="action" />
              <Typography variant="body2">{ticket.flight?.flightNo}</Typography>
            </Stack>

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
                icon={<Download />}
                text="Download Ticket"
                url="/"
              />

              <ButtonCircle
                icon={<ForwardToInbox />}
                text="Send Ticket"
                url="/"
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default TicketInfo;
