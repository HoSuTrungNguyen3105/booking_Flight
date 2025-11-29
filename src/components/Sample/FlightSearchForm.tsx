import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  Person,
  AirlineSeatReclineNormal,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "../../scss/theme";
import { useDataSection, type SearchFormConfig } from "./search_type_input";
import useLocalStorage from "../../context/use[custom]/useLocalStorage";
import SearchFieldRender from "../../common/AdditionalCustomFC/SearchFieldRender";
import { useNavigate } from "react-router-dom";
import FlightGrid from "./FlightCard";
import { generateSearchToken } from "../../utils/security";

type FormState = SearchFormConfig["flight"];

const FlightSearchForm: React.FC<{ type: keyof SearchFormConfig }> = ({
  type,
}) => {
  const navigate = useNavigate();

  const [hasReturnDay, setHasReturnDay] = useState(false);

  const [formData, setFormData] = useLocalStorage<FormState>("search_data", {
    origin: "",
    destination: "",
    departDate: 0,
    returnDate: 0,
    passengers: 1,
  });

  const handleSubmit = async () => {
    const params: Record<string, string> = {
      departureAirport: formData.origin || "",
      arrivalAirport: formData.destination || "",
      scheduledDeparture: formData.departDate
        ? String(formData.departDate)
        : "",
      scheduledArrival: formData.returnDate ? String(formData.returnDate) : "",
      passengers: "1", // Default to 1 as it's not in the form
      flightClass: formData.type || "",
    };

    if (hasReturnDay && formData.returnDate) {
      params.scheduledArrival = String(formData.returnDate);
    } else if (!hasReturnDay) {
      delete params.scheduledArrival;
    }

    // Remove token from params before generating it to avoid circular dependency if it was there
    const { token: _, ...paramsToHash } = params;

    const generatedToken = generateSearchToken(paramsToHash);
    params.token = generatedToken;

    const search = new URLSearchParams(params).toString();
    navigate(`/search?${search}`);
  };

  const handleSwap = () => {
    setFormData((prev: FormState) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const dataSection = useDataSection(type, formData, hasReturnDay, handleSwap);

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setFormData((prev: FormState) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTripTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment !== null) {
      setHasReturnDay(newAlignment === "roundtrip");
    }
  };

  const getIconForField = (id: string) => {
    switch (id) {
      case "origin":
        return <FlightTakeoff color="action" />;
      case "destination":
        return <FlightLand color="action" />;
      case "departDate":
      case "returnDate":
        return <CalendarToday color="action" />;
      case "passengers":
        return <Person color="action" />;
      case "type":
        return <AirlineSeatReclineNormal color="action" />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Book Flights from Vietnam with Cathay Pacific from USD196
          </Typography>
        </Box>

        {dataSection?.map((section, index) => (
          <Box key={index} mb={4}>
            {!section.visible && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <ToggleButtonGroup
                  value={hasReturnDay ? "roundtrip" : "oneway"}
                  exclusive
                  onChange={handleTripTypeChange}
                  aria-label="trip type"
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiToggleButton-root": {
                      px: 3,
                      py: 1,
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "20px !important",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="oneway">One way</ToggleButton>
                  <ToggleButton value="roundtrip">Round trip</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}

            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 4,
                position: "relative",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {section.fields
                  .filter((field) => !field.disabled)
                  .map((field, fieldIndex) => (
                    <Grid
                      size={field.size}
                      key={fieldIndex}
                      sx={{
                        position: "relative",
                        sm: field.size === 6 ? 6 : field.size === 3 ? 6 : 12,
                        md: field.size ? field.size : 3,
                      }}
                    >
                      <SearchFieldRender
                        type={field.type}
                        value={formData[field.id as keyof FormState] ?? ""}
                        size={field.size}
                        onClick={field.onClick}
                        sx={field.sx}
                        startIcon={getIconForField(field.id) || field.startIcon}
                        options={field.options}
                        placeholder={field.placeholder}
                        onChange={(val) =>
                          handleChange(
                            field.id as keyof FormState,
                            val as FormState[keyof FormState]
                          )
                        }
                      />
                    </Grid>
                  ))}
                <Grid size={12} sx={{ ml: "auto" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    sx={{
                      // borderRadius: 3,
                      // px: 6,
                      // py: 1.5,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: 4,
                      textTransform: "none",
                      minWidth: { xs: "100%", md: "auto" },
                    }}
                  >
                    Search Flights
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        ))}

        {/* Cookies Notice */}
        <Box sx={{ textAlign: "center", mt: 6, maxWidth: 800, mx: "auto" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            We use cookies to make sure that our website works properly and to
            offer you the best experience possible. By continuing to use our
            site, you consent to the use of cookies. If you wish to learn more
            about our use of Cookies and/or change your Cookie preferences,
            please visit our{" "}
            <Link href="#" underline="hover" sx={{ fontWeight: "bold" }}>
              Cookies Policy
            </Link>
            .
          </Typography>
        </Box>
        <FlightGrid />
      </Container>
    </LocalizationProvider>
  );
};

export default FlightSearchForm;
