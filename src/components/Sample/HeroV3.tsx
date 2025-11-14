import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Popover,
  Grow,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import departure from "../../svgs/account-avatar-profile-user.svg";
import arrival from "../../svgs/account-avatar-profile-user.svg";
import person from "../../svgs/account-avatar-profile-user.svg";

interface SuggestionState {
  input: string;
  isOpen: boolean;
  matchingSuggestions: string[];
}

const HeroV3: React.FC = () => {
  const [departureSuggest, setDepartureSuggest] = useState<SuggestionState>({
    input: "",
    isOpen: false,
    matchingSuggestions: ["Hanoi", "Ho Chi Minh", "Da Nang"],
  });

  const [arrivalSuggest, setArrivalSuggest] = useState<SuggestionState>({
    input: "",
    isOpen: false,
    matchingSuggestions: ["Tokyo", "Seoul", "Singapore"],
  });

  const [anchorElDeparture, setAnchorElDeparture] =
    useState<HTMLElement | null>(null);
  const [anchorElArrival, setAnchorElArrival] = useState<HTMLElement | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "departure" | "arrival"
  ) => {
    const value = e.target.value;
    if (type === "departure") {
      setDepartureSuggest((prev) => ({ ...prev, input: value, isOpen: true }));
    } else {
      setArrivalSuggest((prev) => ({ ...prev, input: value, isOpen: true }));
    }
  };

  const handleSuggestionClick = (
    value: string,
    type: "departure" | "arrival"
  ) => {
    if (type === "departure") {
      setDepartureSuggest((prev) => ({ ...prev, input: value, isOpen: false }));
    } else {
      setArrivalSuggest((prev) => ({ ...prev, input: value, isOpen: false }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      {/* Departure Input */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          placeholder="From where?"
          value={departureSuggest.input}
          onChange={(e) => handleInputChange(e, "departure")}
          onFocus={(e) => setAnchorElDeparture(e.currentTarget)}
        />
        <Popover
          open={departureSuggest.isOpen}
          anchorEl={anchorElDeparture}
          onClose={() =>
            setDepartureSuggest((prev) => ({ ...prev, isOpen: false }))
          }
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          TransitionComponent={Grow}
        >
          <Box sx={{ p: 1, minWidth: 220 }}>
            {departureSuggest.matchingSuggestions.map((s) => (
              <Box
                key={s}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#605DEC", color: "#fff" },
                }}
                onClick={() => handleSuggestionClick(s, "departure")}
              >
                {s}
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>

      {/* Arrival Input */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          placeholder="Where to?"
          value={arrivalSuggest.input}
          onChange={(e) => handleInputChange(e, "arrival")}
          onFocus={(e) => setAnchorElArrival(e.currentTarget)}
        />
        <Popover
          open={arrivalSuggest.isOpen}
          anchorEl={anchorElArrival}
          onClose={() =>
            setArrivalSuggest((prev) => ({ ...prev, isOpen: false }))
          }
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          TransitionComponent={Grow}
        >
          <Box sx={{ p: 1, minWidth: 220 }}>
            {arrivalSuggest.matchingSuggestions.map((s) => (
              <Box
                key={s}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#605DEC", color: "#fff" },
                }}
                onClick={() => handleSuggestionClick(s, "arrival")}
              >
                {s}
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>

      {/* Passenger Selector */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <img src={person} alt="person" style={{ width: 24, marginRight: 8 }} />
        <Typography>1 Adult - 0 Minor</Typography>
      </Box>

      {/* Search Button */}
      <Link to="/explore" style={{ width: "100%" }}>
        <Button sx={{ width: "100%", bgcolor: "#605DEC", color: "#fff" }}>
          Search
        </Button>
      </Link>
    </Box>
  );
};

export default HeroV3;
