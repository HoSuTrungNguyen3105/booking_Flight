import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "../../scss/theme";
import { useDataSection, type SearchFormConfig } from "./search_type_input";
import useLocalStorage from "../../context/use[custom]/useLocalStorage";
import SearchFieldRender from "../../common/AdditionalCustomFC/SearchFieldRender";
import { createSearchParams, useNavigate } from "react-router-dom";
import FlightGrid from "./FlightCard";
import { useSearchFlightFromPassenger } from "../../context/Api/EnumApi";
import { generateSearchToken } from "../../utils/security";

type SearchFlightFromPassengerDto = {
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: number; // timestamp hoặc Date string
  scheduledArrival?: number; // timestamp hoặc Date string
  passengers?: number;
  flightClass?: string; // ECONOMY, BUSINESS, ...
  token?: string;
};

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

  const dataSection = useDataSection(type, formData, hasReturnDay);

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

  const handleSwap = () => {
    setFormData((prev: FormState) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
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
          <Box key={index} mb={2}>
            {!section.visible && (
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {section.label}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasReturnDay}
                      onChange={() => setHasReturnDay((prev) => !prev)}
                      sx={{ p: 0.5 }}
                    />
                  }
                  label="Khứ hồi (Roundtrip)"
                  sx={{ mr: 0 }}
                />
              </Box>
            )}

            <Paper
              elevation={2}
              sx={{
                p: 1,
                display: "flex",
                bgcolor: "background.paper",
                border: "1px solid #e0e0e0",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {section.fields
                .filter((field) => !field.disabled)
                .map((field, fieldIndex, visibleFields) => (
                  <React.Fragment key={fieldIndex}>
                    <Box
                      sx={{
                        flex: field.size ? field.size : 1,
                        minWidth: "150px",
                        position: "relative",
                        ...field.sx,
                      }}
                    >
                      <SearchFieldRender
                        type={field.type}
                        value={formData[field.id as keyof FormState] ?? ""}
                        size={field.size}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-root": { padding: 0 },
                        }}
                        options={field.options}
                        placeholder={field.placeholder}
                        onChange={(val) =>
                          handleChange(
                            field.id as keyof FormState,
                            val as FormState[keyof FormState]
                          )
                        }
                      />
                    </Box>
                    {fieldIndex < visibleFields.length - 1 && (
                      <>
                        {field.id === "origin" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: 1,
                            }}
                          >
                            <IconButton
                              onClick={handleSwap}
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "50%",
                                p: 0.5,
                                "&:hover": { backgroundColor: "#f5f5f5" },
                              }}
                            >
                              <SwapHoriz fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: "1px",
                              height: "30px",
                              bgcolor: "#e0e0e0",
                              mx: 1,
                            }}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  ml: "auto",
                  boxShadow: "none",
                  fontWeight: "bold",
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>
        ))}
        {/* </Paper> */}

        {/* Cookies Notice */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
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
