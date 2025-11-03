import React from "react";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import EventIcon from "@mui/icons-material/Event";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { Link } from "react-router-dom";

const TicketPage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1700, mx: "auto", px: 2, py: 3 }}>
      {/* ====== Top Button Group ====== */}
      <ButtonGroup color="primary" variant="outlined" sx={{ mb: 4 }}>
        <Button component={Link} to="/members/tickets">
          My Tickets
        </Button>
        <Button component={Link} to="/members/account" variant="contained">
          My Account
        </Button>
      </ButtonGroup>

      {/* ====== Ticket Card ====== */}
      <Box
        sx={{
          width: "70%",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          bgcolor: "background.paper",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: 6,
          position: "relative",
          mb: 3,
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
          <Typography variant="h2" fontWeight={700} lineHeight={1}>
            21
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            September
          </Typography>
          <QrCode2Icon sx={{ fontSize: 48, mb: 1, color: "white" }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, letterSpacing: 2 }}
          >
            21EX9P
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
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Coldplay World Tour 2025
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">Tue, Sep 21, 2025 — 19:00</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <ApartmentIcon fontSize="small" color="action" />
              <Typography variant="body2">Royal Albert Hall, London</Typography>
            </Stack>
          </Box>

          {/* ====== Action Buttons ====== */}
          <Box sx={{ textAlign: "right", mt: 3 }}>
            <IconButton
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
            </IconButton>

            <IconButton
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
              title="Send Ticket"
            >
              <ForwardToInboxIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPage;
