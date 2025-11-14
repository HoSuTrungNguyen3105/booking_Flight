import React, { useCallback, useState, type ReactNode } from "react";
import { Box, Typography, Button, Grid, Popover, Grow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import departure from "../../svgs/account-avatar-profile-user.svg";
import arrival from "../../svgs/account-avatar-profile-user.svg";
import person from "../../svgs/account-avatar-profile-user.svg";
import { addDays, format } from "date-fns";
import InputTextField from "../../common/Input/InputTextField";
import { useToast } from "../../context/ToastContext";
import DateTimePickerComponent from "../../common/DayPicker/index";

interface SuggestionState {
  input: string;
  isOpen: boolean;
  matchingSuggestions: string[];
}

const HeroV2: React.FC = () => {
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

  const handleInputChange = (type: "departure" | "arrival", value: string) => {
    const setter =
      type === "departure" ? setDepartureSuggest : setArrivalSuggest;
    setter((prev) => ({ ...prev, input: value }));
  };

  const handleSuggestionClick = (
    type: "departure" | "arrival",
    value: string
  ) => {
    const setter =
      type === "departure" ? setDepartureSuggest : setArrivalSuggest;
    setter({ input: value, isOpen: false, matchingSuggestions: [] });
  };

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

  const open = Boolean(anchorEl);
  const [openDate, setOpenDate] = useState(false);

  const [ticketCode, setTicketCode] = useState<string>("");

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

  const navigate = useNavigate();

  const toast = useToast();

  const handleSubmit = () => {
    const departure = departureSuggest.input;
    const arrival = arrivalSuggest.input;
    const passengerCount = options.adult + options.minor;
    const dateRange = `${format(date[0].startDate, "yyyy-MM-dd")}_${format(
      date[0].endDate,
      "yyyy-MM-dd"
    )}`;

    const hasTicket = ticketCode.trim() !== "" ? ticketCode.trim() : null;

    const urlParts = ["/explore"];

    if (!arrival) return toast("Please enter an arrival location");
    else urlParts.push(arrival);
    if (!departure) return toast("Please enter an departure location");
    else urlParts.push(departure);

    const finalUrl = [
      "/explore",
      arrivalSuggest.input,
      departureSuggest.input,
      `${format(date[0].startDate, "yyyy-MM-dd")}_${format(
        date[0].endDate,
        "yyyy-MM-dd"
      )}`,
      (options.adult + options.minor).toString(),
      ticketCode.trim() || undefined,
    ]
      .filter(Boolean)
      .join("/");

    navigate(finalUrl);
    // if (dateRange) urlParts.push(dateRange);
    // if (passengerCount) urlParts.push(String(passengerCount));
    // if (hasTicket) urlParts.push(hasTicket);

    // // Join thành URL
    // const finalUrl = urlParts.join("/");

    navigate(finalUrl);
  };

  const renderSearchBox = useCallback(
    (
      content: ReactNode,
      image: string,
      title: string,
      input: string,
      handleInputChange: (value: string) => void
    ) => {
      return (
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
          <img style={{ height: 23, width: 23 }} src={image} alt={image} />
          <InputTextField
            placeholder={title}
            value={input}
            onChange={handleInputChange}
          />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            TransitionComponent={Grow}
          >
            {content}
          </Popover>
        </Box>
      );
    },
    []
  );

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
          <Grid size={4}>
            {renderSearchBox(
              <></>,
              departure,
              "From where?",
              departureSuggest.input,
              (value: string) => handleInputChange("departure", value)
            )}
          </Grid>

          <Grid size={4}>
            {renderSearchBox(
              <>
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
                            handleSuggestionClick("arrival", suggestion)
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
              </>,
              arrival,
              "Where to?",
              arrivalSuggest.input,
              (value: string) => handleInputChange("arrival", value)
            )}
          </Grid>
          <Grid size={3}>
            {renderSearchBox(
              <>
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
                    <DateTimePickerComponent
                      language="en"
                      //editableDateInputs
                      //onChange={(item: number) => setDate([item.selection])}
                      //moveRangeOnFirstSelection={false}
                      //ranges={date}
                    />
                  </Box>
                )}
              </>,
              arrival, // icon
              "Where to?", // placeholder
              arrivalSuggest.input, // input value
              (value: string) => handleInputChange("arrival", value) // onChange
            )}
          </Grid>

          <Grid size={3}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Ticket code
            </Typography>
            <InputTextField
              value={ticketCode}
              onChange={(e) => setTicketCode(e)}
              variant="outlined"
              placeholder="Enter ticket code"
            />
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
          {/* <Link to="/explore" style={{ width: "100%" }}> */}
          <Button
            onClick={handleSubmit}
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
          {/* </Link> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default HeroV2;
