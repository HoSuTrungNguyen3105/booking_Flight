import React, { useCallback, useState, type ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Popover,
  Grow,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import departure from "../../svgs/account-avatar-profile-user.svg";
import arrival from "../../svgs/account-avatar-profile-user.svg";
import person from "../../svgs/account-avatar-profile-user.svg";
import { addDays, format } from "date-fns";
import InputTextField from "../../common/Input/InputTextField";
import { useToast } from "../../context/ToastContext";
import DateTimePickerComponent from "../../common/DayPicker/index";
import {
  mapStringToDropdown,
  useFindAllFlightTypes,
  useGetAllCode,
} from "../../context/Api/useGetApi";
import type { ActionType } from "../../common/Dropdown/SelectDropdown";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";

interface SuggestionState {
  input: string;
  isOpen: boolean;
  matchingSuggestions: ActionType[];
}

const HeroV2: React.FC = () => {
  const { getAllCode } = useGetAllCode();

  const airports: ActionType[] = (getAllCode?.data?.airport || []).map((e) => ({
    value: e.code,
    label: e.value,
  }));
  const [departureSuggest, setDepartureSuggest] = useState<SuggestionState>({
    input: "",
    isOpen: false,
    matchingSuggestions: airports,
  });

  const [arrivalSuggest, setArrivalSuggest] = useState<SuggestionState>({
    input: "",
    isOpen: false,
    matchingSuggestions: airports,
  });

  const [activeSelect, setActiveSelect] = useState<"roundtrip" | "oneway">(
    "oneway"
  );

  const { dataFlightTypes } = useFindAllFlightTypes();
  const optionDataFlightTypes = mapStringToDropdown(
    dataFlightTypes?.data || []
  );

  const handleFilterType = useCallback(() => {
    setActiveSelect((prev) => (prev === "oneway" ? "roundtrip" : "oneway"));
  }, []);

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

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

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
  };

  const renderSearchBox = useCallback(
    (
      icon: string,
      content: ReactNode,
      hasPopover: boolean,
      popoverContent?: ReactNode
    ) => {
      return (
        <Box
          onClick={(e) => {
            if (hasPopover) {
              setAnchorEl(e.currentTarget); // mở popover
            }
          }}
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
          {icon && (
            <img
              src={icon}
              alt=""
              style={{ width: 23, height: 23, marginRight: 8 }}
            />
          )}

          {content}

          {hasPopover && (
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              TransitionComponent={Grow}
            >
              {popoverContent}
            </Popover>
          )}
        </Box>
      );
    },
    [anchorEl]
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
          <Grid size={12}>
            <FormControlLabel
              control={
                <Radio
                  checked={activeSelect === "roundtrip"}
                  onChange={handleFilterType}
                />
              }
              label="Round Trip"
            />
            <FormControlLabel
              control={
                <Radio
                  checked={activeSelect === "oneway"}
                  onChange={handleFilterType}
                />
              }
              label="One Way"
            />
          </Grid>
          <Grid size={4}>
            {renderSearchBox(
              departure,
              <InputTextField />,
              true,
              <>{departureSuggest.input}</>
            )}
          </Grid>

          <Grid size={4}>
            {renderSearchBox(
              arrival,
              <SelectDropdown options={arrivalSuggest.matchingSuggestions} />,
              true,
              <>{arrivalSuggest.input}</>
            )}
          </Grid>
          <Grid size={3}>
            {renderSearchBox(
              "", // icon anh gửi vào
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
                    ? `${format(date[0].startDate, "dd/MM/yyyy")} → ${format(
                        date[0].endDate,
                        "dd/MM/yyyy"
                      )}`
                    : "Depart to Return"}
                </Typography>

                {openDate && (
                  <Box sx={{ position: "absolute", top: 64, zIndex: 10 }}>
                    <DateTimePickerComponent language="en" />
                  </Box>
                )}
              </>,
              false
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
            {renderSearchBox(
              "",
              <Typography
                sx={{
                  ml: 2,
                  color: "#7C8DB0",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                onClick={() => setOpenOptions(!openOptions)}
              >
                {`${options.adult} Adult - ${options.minor} Minor`}
              </Typography>,
              openOptions, // bật popover
              <>
                {(["adult", "minor"] as const).map((type) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                    }}
                  >
                    <Typography>
                      {type === "adult" ? "Adults" : "Minors"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button onClick={() => handleOptions(type, "d")}>
                        -
                      </Button>
                      <Typography>{options[type]}</Typography>
                      <Button onClick={() => handleOptions(type, "i")}>
                        +
                      </Button>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Box>

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
