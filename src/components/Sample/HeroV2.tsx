import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Grid,
  Popover,
  Grow,
} from "@mui/material";
import { Link } from "react-router-dom";
// import { DateRange } from "react-date-range";
import departure from "../../svgs/account-avatar-profile-user.svg";
import arrival from "../../svgs/account-avatar-profile-user.svg";
import calendar from "../../svgs/account-avatar-profile-user.svg";
import person from "../../svgs/account-avatar-profile-user.svg";
import { addDays, format } from "date-fns";
import { DateRange } from "@mui/icons-material";
import InputTextField from "../../common/Input/InputTextField";

interface HeroProps {
  departureSuggest: any;
  arrivalSuggest: any;
  openDate: boolean;
  setOpenDate: React.Dispatch<React.SetStateAction<boolean>>;
  date: any[];
  setDate: any;
  openOptions: boolean;
  setOpenOptions: React.Dispatch<React.SetStateAction<boolean>>;
  options: { adult: number; minor: number };
  handleOptions: (type: "adult" | "minor", action: "i" | "d") => void;
}

const HeroV2: React.FC = () => {
  const [departureSuggest, setDepartureSuggest] = useState({
    input: "",
    isOpen: false,
    matchingSuggestions: ["Hanoi", "Ho Chi Minh", "Da Nang"],
    handleInputChange: (value: string) =>
      setDepartureSuggest((prev) => ({ ...prev, input: value })),
    handleSuggestionClick: (value: string) =>
      setDepartureSuggest((prev) => ({
        ...prev, // giữ lại handleInputChange, handleSuggestionClick, setIsOpen
        input: value,
        isOpen: false,
        matchingSuggestions: [],
      })),
    setIsOpen: (val: boolean) =>
      setDepartureSuggest((prev) => ({ ...prev, isOpen: val })),
  });

  const [arrivalSuggest, setArrivalSuggest] = useState({
    input: "",
    isOpen: false,
    matchingSuggestions: ["Tokyo", "Seoul", "Singapore"],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setArrivalSuggest((prev) => ({ ...prev, input: e.target.value })),
    handleSuggestionClick: (value: string) =>
      setArrivalSuggest((prev) => ({
        ...prev, // giữ lại handleInputChange, handleSuggestionClick, setIsOpen
        input: value,
        isOpen: false,
        matchingSuggestions: [],
      })),
    setIsOpen: (val: boolean) =>
      setArrivalSuggest((prev) => ({ ...prev, isOpen: val })),
  });

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [openDate, setOpenDate] = useState(false);

  const [options, setOptions] = useState({ adult: 1, minor: 0 });
  const [openOptions, setOpenOptions] = useState(false);

  const handleOptions = (type: "adult" | "minor", action: "i" | "d") => {
    setOptions((prev) => ({
      ...prev,
      [type]:
        action === "i"
          ? prev[type] + 1
          : Math.max(0, type === "adult" ? prev.adult - 1 : prev.minor - 1),
    }));
  };

  const renderSearchBox = useCallback(() => {
    return (
      <Grid size={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            border: "1px solid #CBD4E6",
            p: 1,
            position: "relative",
            borderRadius: { lg: "4px 0 0 4px" },
          }}
        >
          <img
            style={{ height: 23, width: 23 }}
            src={departure}
            alt="departure"
          />
          <InputTextField
            placeholder="From where?"
            value={departureSuggest.input}
            onChange={departureSuggest.handleInputChange}
            // onChange={(e) => handleInputChange("departureSuggest", e)}
          />
          {/* {departureSuggest.isOpen && (
                <Box
                  sx={{
                    width: 220,
                    height: 224,
                    bgcolor: "white",
                    borderRadius: 1,
                    overflowY: "auto",
                    position: "absolute",
                    top: "70px",
                    zIndex: 10,
                  }}
                > */}
          {/* {departureSuggest.matchingSuggestions.map(
                    (suggestion: string) => (
                      <Box
                        key={suggestion}
                        onClick={() =>
                          departureSuggest.handleSuggestionClick(suggestion)
                        }
                        sx={{
                          textTransform: "uppercase",
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          color: "#7C8DB0",
                          "&:hover": { bgcolor: "#605DEC", color: "#F6F6FE" },
                        }}
                      >
                        {suggestion}
                      </Box>
                    )
                  )} */}
          <Popover
            open={departureSuggest.isOpen}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            TransitionComponent={Grow}
          >
            {departureSuggest.matchingSuggestions.map((suggestion: string) => (
              <Box
                key={suggestion}
                onClick={() =>
                  departureSuggest.handleSuggestionClick(suggestion)
                }
                sx={{
                  textTransform: "uppercase",
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  color: "#7C8DB0",
                  "&:hover": { bgcolor: "#605DEC", color: "#F6F6FE" },
                }}
              >
                {suggestion}
              </Box>
            ))}
          </Popover>
        </Box>
        {/* )}
            </Box> */}
      </Grid>
    );
  }, []);

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: { xs: "529px", md: "529px" },
        px: 7,
        py: 4,
      }}
    >
      {/* Hero Title */}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: "extrabold",
            fontSize: { xs: "5xl", sm: "7xl", md: "8xl" },
            textAlign: "center",
            lineHeight: { xs: "55px", sm: "70px", md: "90px" },
            background: "linear-gradient(to right, #605DEC, #B91097)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          It's more than <br /> just a trip
        </Typography>
      </Box>

      {/* Search Box */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
          maxWidth: "1024px",
          mt: 5,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
          borderRadius: 1,
        }}
      >
        <Grid container spacing={3} alignItems="flex-end">
          <Grid size={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                border: "1px solid #CBD4E6",
                p: 1,
                position: "relative",
                borderRadius: { lg: "4px 0 0 4px" },
              }}
            >
              <img
                style={{ height: 23, width: 23 }}
                src={departure}
                alt="departure"
              />
              <InputTextField
                placeholder="From where?"
                value={departureSuggest.input}
                onChange={departureSuggest.handleInputChange}
                // onChange={(e) => handleInputChange("departureSuggest", e)}
              />
              {departureSuggest.isOpen && (
                <Box
                  sx={{
                    width: 220,
                    height: 224,
                    bgcolor: "white",
                    borderRadius: 1,
                    overflowY: "auto",
                    position: "absolute",
                    top: "70px",
                    zIndex: 10,
                  }}
                >
                  {departureSuggest.matchingSuggestions.map(
                    (suggestion: string) => (
                      <Box
                        key={suggestion}
                        onClick={() =>
                          departureSuggest.handleSuggestionClick(suggestion)
                        }
                        sx={{
                          textTransform: "uppercase",
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          color: "#7C8DB0",
                          "&:hover": { bgcolor: "#605DEC", color: "#F6F6FE" },
                        }}
                      >
                        {suggestion}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          <Grid size={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                border: "1px solid #CBD4E6",
                p: 1,
                position: "relative",
              }}
            >
              <img
                style={{ height: 23, width: 23 }}
                src={arrival}
                alt="arrival"
              />
              <InputBase
                placeholder="Where to?"
                value={arrivalSuggest.input}
                onChange={arrivalSuggest.handleInputChange}
                onFocus={() => arrivalSuggest.setIsOpen(true)}
                sx={{
                  ml: 2,
                  textTransform: "uppercase",
                  color: "#7C8DB0",
                  "&::placeholder": {
                    textTransform: "capitalize",
                    color: "#7C8DB0",
                  },
                  flex: 1,
                }}
              />
              {arrivalSuggest.isOpen && (
                <Box
                  sx={{
                    width: 220,
                    height: 224,
                    bgcolor: "white",
                    borderRadius: 1,
                    overflowY: "auto",
                    position: "absolute",
                    top: "70px",
                    zIndex: 10,
                  }}
                >
                  {arrivalSuggest.matchingSuggestions.map(
                    (suggestion: string) => (
                      <Box
                        key={suggestion}
                        onClick={() =>
                          arrivalSuggest.handleSuggestionClick(suggestion)
                        }
                        sx={{
                          textTransform: "uppercase",
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          color: "#7C8DB0",
                          "&:hover": { bgcolor: "#605DEC", color: "#F6F6FE" },
                        }}
                      >
                        {suggestion}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          </Grid>
          {/* Date Picker */}
          <Grid size={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                border: "1px solid #CBD4E6",
                p: 1,
                position: "relative",
              }}
            >
              <img
                style={{ height: 23, width: 23 }}
                src={calendar}
                alt="calendar"
              />
              <Typography
                sx={{
                  ml: 2,
                  color: "#7C8DB0",
                  cursor: "pointer",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
                onClick={() => setOpenDate(!openDate)}
              >
                {openDate
                  ? `${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                      date[0].endDate,
                      "dd/MM/yyyy"
                    )}`
                  : "Depart to Return"}
              </Typography>
              {openDate && (
                <Box sx={{ position: "absolute", top: 64, zIndex: 10 }}>
                  <DateRange
                  // editableDateInputs
                  // onChange={(item: any) => setDate([item.selection])}
                  // moveRangeOnFirstSelection={false}
                  // ranges={date}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          {/* Passenger Selector */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              border: "1px solid #CBD4E6",
              p: 1,
              position: "relative",
            }}
          >
            <img style={{ height: 23, width: 23 }} src={person} alt="person" />
            <Typography
              sx={{
                ml: 2,
                color: "#7C8DB0",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1.5,
              }}
              onClick={() => setOpenOptions(!openOptions)}
            >
              {`${options.adult} Adult - ${options.minor} Minor`}
            </Typography>
            {openOptions && (
              <Box
                sx={{
                  width: 208,
                  bgcolor: "white",
                  borderRadius: 1,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  position: "absolute",
                  top: 70,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  zIndex: 10,
                }}
              >
                {["adult", "minor"].map((type) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: "#7C8DB0", fontSize: "1rem" }}>
                      {type === "adult" ? "Adults:" : "Minors:"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Button
                        sx={{
                          border: "2px solid #605DEC",
                          color: "#7C8DB0",
                          minWidth: 32,
                          px: 1,
                        }}
                        onClick={() =>
                          handleOptions(type as "adult" | "minor", "d")
                        }
                        disabled={
                          type === "adult"
                            ? options.adult <= 1
                            : options.minor <= 0
                        }
                      >
                        -
                      </Button>
                      <Typography sx={{ color: "#7C8DB0" }}>
                        {type === "adult" ? options.adult : options.minor}
                      </Typography>
                      <Button
                        sx={{
                          border: "2px solid #605DEC",
                          color: "#7C8DB0",
                          minWidth: 32,
                          px: 1,
                        }}
                        onClick={() =>
                          handleOptions(type as "adult" | "minor", "i")
                        }
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Search Button */}
          <Link to="/explore" style={{ width: "100%" }}>
            <Button
              sx={{
                width: "100%",
                backgroundColor: "#605DEC",
                color: "#FAFAFA",
                fontSize: "1rem",
                height: { xs: 45, lg: 65 },
                px: 2,
                borderRadius: { lg: "0 4px 4px 0" },
                "&:hover": { backgroundColor: "#4a47c3" },
              }}
            >
              Search
            </Button>
          </Link>
        </Grid>
      </Box>
    </Box>
  );
};

export default HeroV2;
