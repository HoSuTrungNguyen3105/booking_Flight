import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  Link,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DateTimePickerComponent from "../../common/DayPicker/index";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useFindAllFlightTypes,
  useGetAllCode,
} from "../../context/Api/useGetApi";
import theme from "../../scss/theme";
import InputTextField from "../../common/Input/InputTextField";

interface FlightSearchFormProps {
  initialData?: {
    origin?: string;
    destination?: string;
    departDate?: number;
    returnDate?: number;
    type?: string;
    discountCode?: string;
  };
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    origin: initialData.origin || "",
    destination: initialData.destination || "",
    departDate: initialData.departDate || 0,
    returnDate: initialData.returnDate || 0,
    type: initialData.type || "Economy",
    discountCode: initialData.discountCode || "",
  });

  const [activeSelect, setActiveSelect] = useState<"roundtrip" | "oneway">(
    "oneway"
  );

  const { getAllCode } = useGetAllCode();
  const { dataFlightTypes } = useFindAllFlightTypes();
  const optionDataFlightTypes = mapStringToDropdown(
    dataFlightTypes?.data || []
  );

  const airports: ActionType[] = (getAllCode?.data?.airport || []).map((e) => ({
    value: e.code,
    label: e.value,
  }));

  const handleFilterType = useCallback(() => {
    setActiveSelect((prev) => (prev === "oneway" ? "roundtrip" : "oneway"));
  }, []);

  const handleInputChange = (field: string) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: field,
    }));
  };

  const handleDropdownChange = (field: string) => (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as string,
    }));
  };

  const handleDateChange = (field: string) => (date: number | null) => {
    if (date !== null) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleSearch = () => {
    console.log("Searching flights with:", formData);
    // Call API or navigate to results page
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
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                ORIGIN
              </Typography>
              <SelectDropdown
                value={formData.origin}
                options={airports}
                onChange={handleDropdownChange("origin")}
                variant="outlined"
                placeholder="Select departure"
              />
            </Grid>

            <Grid size={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                DESTINATION
              </Typography>
              <SelectDropdown
                value={formData.destination}
                options={airports}
                onChange={handleDropdownChange("destination")}
                variant="outlined"
                placeholder="Select arrival"
              />
            </Grid>

            <Grid size={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                FLIGHT TYPE
              </Typography>
              <SelectDropdown
                value={formData.type}
                options={optionDataFlightTypes}
                onChange={handleDropdownChange("type")}
                variant="outlined"
                placeholder="Select type"
              />
            </Grid>

            <Grid size={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                DEPART ON
              </Typography>
              <DateTimePickerComponent
                value={formData.departDate}
                onChange={handleDateChange("departDate")}
                language="en"
              />
            </Grid>

            {activeSelect === "roundtrip" && (
              <Grid size={4}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  RETURN ON
                </Typography>
                <DateTimePickerComponent
                  value={formData.returnDate}
                  onChange={handleDateChange("returnDate")}
                  language="en"
                />
              </Grid>
            )}

            <Grid size={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Ticket code
              </Typography>
              <InputTextField
                value={formData.discountCode}
                onChange={handleInputChange("discountCode")}
                variant="outlined"
                placeholder="Enter ticket code"
              />
            </Grid>

            <Grid size={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{
                  maxWidth: "20rem",
                  py: 1.5,
                }}
              >
                Search flights
              </Button>
            </Grid>
          </Grid>
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
      </Container>
    </LocalizationProvider>
  );
};

export default FlightSearchForm;
