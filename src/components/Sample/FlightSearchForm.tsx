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
import FieldRenderer from "../../common/AdditionalCustomFC/FieldRenderer";
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
          {dataSection?.map(
            (section, index) =>
              !section.visible && (
                <Box key={index} mb={2}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {section.label}
                  </Typography>

                  {section.fields.map(
                    (field, fieldIndex) =>
                      !field.disabled && (
                        <Box key={fieldIndex} mb={1}>
                          <SearchFieldRender
                            type={field.type}
                            value={
                              formData[
                                field.id as keyof SearchFormConfig["flight"]
                              ] ?? ""
                            }
                            size={field.size}
                            sx={field.sx}
                            // disabled={field.disabled}
                            options={field.options}
                            placeholder={field.placeholder}
                            onChange={(val) =>
                              handleChange(
                                // "flight",
                                field.id as keyof SearchFormConfig["flight"],
                                val as string
                              )
                            }
                          />
                        </Box>
                      )
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hasReturnDay}
                        onChange={() => setHasReturnDay((prev) => !prev)}
                      />
                    }
                    label="Khứ hồi (Roundtrip)"
                  />

                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                  >
                    Search flights
                  </Button>
                </Box>
              )
          )}
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
