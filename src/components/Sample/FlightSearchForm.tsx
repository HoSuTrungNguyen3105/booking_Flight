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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useFindAllFlightTypes,
  useGetAllCode,
} from "../../context/Api/useGetApi";
import theme from "../../scss/theme";
import FieldRenderer from "../../common/AdditionalCustomFC/FieldRenderer";
import { useDataSection, type SearchFormConfig } from "./search_type_input";

// interface FlightSearchFormProps {
//   initialData?: {
//     origin?: string;
//     destination?: string;
//     departDate?: number;
//     returnDate?: number;
//     type?: string;
//     discountCode?: string;
//   };
// }

// type InputItemsProps = {
//   name : string;
//   label : string;
//   placeholder : string;
//   ty
// }

const FlightSearchForm: React.FC<{ type: keyof SearchFormConfig }> = ({
  type,
}) => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departDate: 0,
    returnDate: 0,
    type: "Economy",
    discountCode: "",
  });
  const dataSection = useDataSection(type, formData);

  // const [activeSelect, setActiveSelect] = useState<"roundtrip" | "oneway">(
  //   "oneway"
  // );

  const handleChange = <
    T extends keyof SearchFormConfig,
    K extends keyof SearchFormConfig[T]
  >(
    section: T,
    key: K,
    value: SearchFormConfig[T][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        // ...prev[section],
        [key]: value,
      },
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

                  {section.fields.map((field, fieldIndex) => (
                    <Box key={fieldIndex} mb={1}>
                      <FieldRenderer
                        type={field.type}
                        value={
                          formData[
                            field.id as keyof SearchFormConfig["flight"]
                          ] ?? ""
                        }
                        disabled={field.disabled}
                        options={field.options}
                        placeholder={field.placeholder}
                        onChange={(val) =>
                          handleChange(
                            "flight",
                            field.id as keyof SearchFormConfig["flight"],
                            val as string
                          )
                        }
                      />
                    </Box>
                  ))}
                </Box>
              )
          )}
          {/* <Grid container spacing={3} alignItems="flex-end">
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
          </Grid> */}
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
