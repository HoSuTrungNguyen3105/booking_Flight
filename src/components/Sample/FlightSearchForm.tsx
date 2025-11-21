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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "../../scss/theme";
import { useDataSection, type SearchFormConfig } from "./search_type_input";
import useLocalStorage from "../../context/use[custom]/useLocalStorage";
import SearchFieldRender from "../../common/AdditionalCustomFC/SearchFieldRender";
import { createSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FlightGrid from "./FlightCard";

type SearchFlightFromPassengerDto = {
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: number; // timestamp hoặc Date string
  scheduledArrival?: number; // timestamp hoặc Date string
  passengers?: number;
  flightClass?: string; // ECONOMY, BUSINESS, ...
};
const FlightSearchForm: React.FC<{ type: keyof SearchFormConfig }> = ({
  type,
}) => {
  const navigate = useNavigate();

  // const [optionWay, setOptionWay] = useState<"oneway" | "roundtrip">("oneway");
  const [hasReturnDay, setHasReturnDay] = useState(false);

  const [formData, setFormData] = useLocalStorage("search_data", {
    origin: "",
    destination: "",
    departDate: 0,
    returnDate: 0,
    type: "Economy",
    discountCode: "",
  });

  const handleSubmit = () => {
    const token = uuidv4();

    const params: any = {
      from: formData.origin,
      to: formData.destination,
      date: String(formData.departDate),
      token,
    };

    // Nếu có chuyến khứ hồi thì truyền thêm return date
    if (hasReturnDay && formData.returnDate) {
      params.return = String(formData.returnDate);
    }

    navigate({
      pathname: "/search",
      search: createSearchParams(params).toString(),
    });
    // navigate({
    //   pathname: "/search",
    //   search: createSearchParams({
    //     from: formData.origin,
    //     to: formData.destination,
    //     date: formData.departDate,
    //   }).toString(),
    // });
  };

  const dataSection = useDataSection(type, formData, hasReturnDay);

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  const handleChange = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [key]: value,
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

        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: "#fff" }}
        >
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
                elevation={3}
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
                          value={
                            formData[
                              field.id as keyof SearchFormConfig["flight"]
                            ] ?? ""
                          }
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
                              field.id as keyof SearchFormConfig["flight"],
                              val as string
                            )
                          }
                        />
                      </Box>
                      {fieldIndex < visibleFields.length - 1 && (
                        <Box
                          sx={{
                            width: "1px",
                            height: "30px",
                            bgcolor: "#e0e0e0",
                            mx: 1,
                          }}
                        />
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
        </Paper>

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
