import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LocationOn, CalendarToday } from "@mui/icons-material";
import theme from "../../scss/theme";
import { useLocation } from "react-router-dom";

const EventCardDetail = () => {
  const location = useLocation();
  const { code } = location.state || {};
  console.log("Event code:", code);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const eventName = "Event name goes here",
    date = "Tue, Sep 21, 2024 19:00",
    venue = "Royal Albert Hall",
    description =
      "I am ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    tickets = [{ name: "A. Familia", status: "soldout" }];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "50vw",
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        padding: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.7)",
          zIndex: 0,
        },
      }}
    >
      {/* Main Card */}
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
          >
            {/* Event Name - H1 style */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: isMobile ? "1.75rem" : "2.125rem",
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              {eventName}
            </Typography>

            {/* Date and Venue - Bold text */}

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <CalendarToday
                sx={{
                  fontSize: 20,
                  color: "text.secondary",
                  mt: 0.25,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {date}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <LocationOn
                sx={{
                  fontSize: 20,
                  color: "text.secondary",
                  mt: 0.25,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {venue}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* First Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Event Details - H2 style */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            color: theme.palette.text.primary,
          }}
        >
          Event details
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Second Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Tickets Section - H2 style */}
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            color: theme.palette.text.primary,
          }}
        >
          Tickets
        </Typography>

        <List sx={{ p: 0 }}>
          {tickets.map((ticket, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight:
                        ticket.status === "soldout" ? "normal" : "bold",
                    }}
                  >
                    {ticket.name}
                  </Typography>
                }
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {ticket.name && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {ticket.name}
                  </Typography>
                )}
                {ticket.status === "soldout" && (
                  <Chip
                    label="Sold out"
                    size="small"
                    color="error"
                    variant="filled"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* </CardContent> */}
      {/* </Card> */}
    </Box>
  );
};

export default EventCardDetail;
