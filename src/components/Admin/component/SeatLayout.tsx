import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import WcIcon from "@mui/icons-material/Wc";
import ReviewsIcon from "@mui/icons-material/Reviews";

const SeatLayout: React.FC = () => {
  const [seatOptions, setSeatOptions] = useState({
    available: true,
    occupied: false,
    premiumOnly: true,
    blocked: true,
    handicapAccessible: true,
    lavatory: true,
    exitRow: false,
    upperDeck: true,
    wing: true,
    goodReview: false,
    poorReview: true,
    mixedReview: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeatOptions({
      ...seatOptions,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box sx={{ borderRadius: 2, p: 1 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Scale
            </Typography>
          </Box>
          <Chip
            icon={<FlightTakeoffIcon />}
            label="Boeing 767-300"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Grid container spacing={4}>
          {/* Flight Information */}
          <Grid size={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Flight Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>#ID:</strong>
                  </Typography>
                  <Typography variant="body2">235</Typography>

                  <Typography variant="body2">
                    <strong>Assigned Plane Type:</strong>
                  </Typography>
                  <Typography variant="body2">Boeing 767-300</Typography>

                  <Typography variant="body2">
                    <strong>Flight:</strong>
                  </Typography>
                  <Typography variant="body2">AA 1201</Typography>

                  <Typography variant="body2">
                    <strong>Capacity:</strong>
                  </Typography>
                  <Typography variant="body2">67</Typography>

                  <Typography variant="body2">
                    <strong>Date:</strong>
                  </Typography>
                  <Typography variant="body2">11-26-2019</Typography>

                  <Typography variant="body2">
                    <strong>Seats Reserved:</strong>
                  </Typography>
                  <Typography variant="body2">34</Typography>

                  <Typography variant="body2">
                    <strong>Destination:</strong>
                  </Typography>
                  <Typography variant="body2">Istanbul</Typography>

                  <Typography variant="body2">
                    <strong>Seats Available:</strong>
                  </Typography>
                  <Typography variant="body2">33</Typography>

                  <Typography variant="body2">
                    <strong>Scheduled Departure Time:</strong>
                  </Typography>
                  <Typography variant="body2">3:19 AM</Typography>
                </Box>
              </CardContent>
            </Card>
            {/* </Grid> */}

            {/* Seat Options */}
            <Typography variant="h6" gutterBottom>
              Seat Options
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Scats
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.available}
                      onChange={handleChange}
                      name="available"
                    />
                  }
                  label="Available"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.occupied}
                      onChange={handleChange}
                      name="occupied"
                    />
                  }
                  label="Occupied"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.premiumOnly}
                      onChange={handleChange}
                      name="premiumOnly"
                    />
                  }
                  label="Premium Only"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.blocked}
                      onChange={handleChange}
                      name="blocked"
                    />
                  }
                  label="Blocked"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.handicapAccessible}
                      onChange={handleChange}
                      name="handicapAccessible"
                      icon={<AccessibilityNewIcon />}
                      checkedIcon={<AccessibilityNewIcon />}
                    />
                  }
                  label="Handicap Accessible"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.lavatory}
                      onChange={handleChange}
                      name="lavatory"
                      icon={<WcIcon />}
                      checkedIcon={<WcIcon />}
                    />
                  }
                  label="Lavatory"
                />
              </FormGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Location
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.exitRow}
                      onChange={handleChange}
                      name="exitRow"
                    />
                  }
                  label="Exit Row"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.upperDeck}
                      onChange={handleChange}
                      name="upperDeck"
                    />
                  }
                  label="Upper Deck"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.wing}
                      onChange={handleChange}
                      name="wing"
                    />
                  }
                  label="Wing"
                />
              </FormGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                SeatGuru
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.goodReview}
                      onChange={handleChange}
                      name="goodReview"
                    />
                  }
                  label="Good Review"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.poorReview}
                      onChange={handleChange}
                      name="poorReview"
                    />
                  }
                  label="Poor Review"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seatOptions.mixedReview}
                      onChange={handleChange}
                      name="mixedReview"
                    />
                  }
                  label="Mixed Review"
                />
              </FormGroup>
            </Box>
          </Grid>
          {/* </Grid> */}

          {/* Seat Map */}
          <Grid size={5}>
            <Typography variant="h6" gutterBottom>
              Boeing 767-300 Seat Map
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) => (
                <Chip
                  key={letter}
                  icon={<EventSeatIcon />}
                  label={letter}
                  variant="outlined"
                  sx={{ minWidth: 60 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Create Alert Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Create Seat Alert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create Aircraft Change Alert
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<ReviewsIcon />}>
            Create Alert
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatLayout;
