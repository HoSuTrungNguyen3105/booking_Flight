import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Grid,
  Container,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DateTimePickerComponent from "../../common/DayPicker/index";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useGetAllCode,
} from "../../context/Api/useGetApi";
import theme from "../../scss/theme";
interface FlightSearchFormProps {
  initialData?: {
    origin?: string;
    destination?: string;
    departDate?: number;
    returnDate?: number;
    discountCode?: string;
  };
}

interface Airport {
  code: string;
  name: string;
  country: string;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    origin: initialData.origin || "",
    destination: initialData.destination || "",
    departDate: initialData.departDate || 0,
    returnDate: initialData.returnDate || 0,
    discountCode: initialData.discountCode || "",
  });

  const { getAllCode } = useGetAllCode();

  // Mock data for airports - in real app, this would come from API
  const airports: ActionType[] = (getAllCode?.data?.airport || []).map((e) => ({
    value: e.code,
    label: e.value,
  }));

  const handleInputChange = (field: string) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: field,
    }));
  };

  const handleDateChange = (field: string) => (date: number | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleSearch = () => {
    // In real app, this would call an API
    // console.log("Searching flights with:", formData);
    // Navigate to results page or show results
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Book Flights from Vietnam with Cathay Pacific from USD196
          </Typography>
        </Box>

        {/* Discount Code Section */}
        {/* <Card sx={{ mb: 3, backgroundColor: "grey.50" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              DISCOUNT CODE (OPTIONAL)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter discount code"
              value={formData.discountCode}
              onChange={handleInputChange("discountCode")}
              sx={{ maxWidth: 300 }}
            />
          </CardContent>
        </Card> */}

        {/* Search Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="end">
            {/* Origin */}
            <Grid size={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                ORIGIN
              </Typography>
              <SelectDropdown
                value={formData.origin}
                options={airports}
                onChange={handleInputChange("origin")}
                variant="outlined"
                placeholder="Select departure"
              ></SelectDropdown>
            </Grid>

            {/* Destination */}
            {/* Origin */}
            <Grid size={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                DESTINATION
              </Typography>
              <SelectDropdown
                value={formData.origin}
                options={airports}
                onChange={handleInputChange("destination")}
                variant="outlined"
                placeholder="Select arrival"
              ></SelectDropdown>
            </Grid>

            {/* Depart Date */}
            {/* Origin */}
            <Grid size={3}>
              {" "}
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                DEPART ON
              </Typography>
              <DateTimePickerComponent
                value={formData.departDate}
                onChange={handleDateChange("departDate")}
                language="en"
              />
            </Grid>

            {/* Return Date */}
            {/* Origin */}
            <Grid size={3}>
              {" "}
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                RETURN ON
              </Typography>
              <DateTimePickerComponent
                value={formData.returnDate}
                onChange={handleDateChange("returnDate")}
                language="en"
              />
            </Grid>

            {/* Search Button */}
            {/* Origin */}
            <Grid size={3}>
              {" "}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{
                  py: 1.5,
                  backgroundColor: "#E2001A", // Cathay Pacific red
                  "&:hover": {
                    backgroundColor: "#B30015",
                  },
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
            about our use of Cookies and / or change your Cookie preferences,
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
