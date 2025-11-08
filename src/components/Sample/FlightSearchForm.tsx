import React, { Activity, useState } from "react";
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
    type: string;
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
    types: initialData.type,
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
  // Mock data for airports - in real app, this would come from API
  const airports: ActionType[] = (getAllCode?.data?.airport || []).map((e) => ({
    value: e.code,
    label: e.value,
  }));

  // const handleFilterType = useCa

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
    // console.log("Searching flights with:", formData);
    // Navigate to results page or show results
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

        <Activity mode={activeSelect === "oneway" ? "hidden" : "visible"}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            RETURN
          </Typography>
          <SelectDropdown
            value={formData.origin}
            options={optionDataFlightTypes}
            onChange={handleInputChange("type")}
            variant="outlined"
            placeholder="Select Types"
          />
        </Activity>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <Grid container spacing={3} alignItems="flex-end">
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
              />
            </Grid>

            <Grid size={3}>
              {/* <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                RETURN
              </Typography>
              <SelectDropdown
                value={formData.origin}
                options={optionDataFlightTypes}
                onChange={handleInputChange("type")}
                variant="outlined"
                placeholder="Select Types"
              /> */}
            </Grid>

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
              />
            </Grid>

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

            <Grid size={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Ticket code
              </Typography>
              <InputTextField
                value={formData.discountCode}
                onChange={handleInputChange("ticket")}
                variant="outlined"
                placeholder="Select ticket"
              />
            </Grid>

            <Grid size={12} display="flex" justifyContent="end" mt={2}>
              {" "}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{
                  maxWidth: "20rem",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#B91097",
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
