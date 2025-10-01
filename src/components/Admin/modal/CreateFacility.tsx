import React, { useState, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { type Terminal } from "../../../utils/type";
import { OpeningHoursPicker } from "../../../common/DayPicker/date-picker";
import {
  mapStringToDropdown,
  useFindAllFacilityTypes,
  useFindTerminalIDStatuses,
} from "../../Api/useGetApi";
import type { ActionType } from "../../../common/Dropdown/SelectDropdown";
import SelectDropdown from "../../../common/Dropdown/SelectDropdown";
import {
  useCreateFacilities,
  type CreateFacilityProps,
} from "../../Api/usePostApi";
import InputTextArea from "../../../common/Input/InputTextArea";
import InputTextField from "../../../common/Input/InputTextField";

type Props = {
  terminalId: string;
  onClose: () => void;
};

const CreateFacility = ({ onClose, terminalId }: Props) => {
  const [formData, setFormData] = useState<CreateFacilityProps>({
    name: "",
    type: "",
    description: "",
    terminalId,
    location: "",
    openingHours: "",
  });

  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();

  const dataTerminalIdOptions = useCallback((): ActionType[] => {
    const res =
      dataTerminalIDStatuses?.list?.map((i) => ({
        value: i.value,
        label: i.label,
      })) ?? [];
    return res;
  }, [dataTerminalIDStatuses]);

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange =
    (field: keyof CreateFacilityProps) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const { refetchCreateFacilities } = useCreateFacilities();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await refetchCreateFacilities(formData);
      console.log("response", response);
      if (response?.resultCode === "00") {
        setFormData({
          name: "",
          type: "",
          description: "",
          terminalId: "",
          location: "",
          openingHours: "",
        });
        onClose();
      } else {
        setMessage({
          type: "error",
          text: "Failed to create facility",
        });
      }
    } catch (error) {
      console.error("Error creating facility:", error);
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const { dataFacilityTypes } = useFindAllFacilityTypes();

  const facilityTypeOptions = mapStringToDropdown(
    dataFacilityTypes?.data || []
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight="bold"
        >
          Create New Facility
        </Typography>

        <Button onClick={onClose} variant="contained">
          {" "}
          Return
        </Button>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add a new facility to the airport management system
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Facility Name */}
            <Grid size={6}>
              <InputTextField
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter facility name"
              />
            </Grid>

            {/* Facility Type */}
            <Grid size={6}>
              <FormControl fullWidth required>
                <SelectDropdown
                  options={facilityTypeOptions}
                  value={formData.type}
                  placeholder="Select facility type options"
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value as string, // value ở đây là string | number
                    }))
                  }
                />
              </FormControl>
            </Grid>

            {/* Terminal Selection */}
            <Grid size={6}>
              <FormControl fullWidth required>
                <SelectDropdown
                  value={formData.terminalId}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      terminalId: value as string, // value ở đây là string | number
                    }))
                  }
                  placeholder="Select terminal ID"
                  options={dataTerminalIdOptions()}
                  disabled={loading}
                />
              </FormControl>
              {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
            </Grid>

            {/* Location */}
            <Grid size={6}>
              <InputTextField
                value={formData.location}
                onChange={handleChange("location")}
                placeholder="e.g., Near Gate A1, Level 2"
              />
            </Grid>

            {/* Opening Hours */}
            <Grid size={6}>
              <OpeningHoursPicker
                value={formData.openingHours}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, openingHours: val }))
                }
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <InputTextArea
                name="description"
                value={formData.description}
                onChange={handleChange("description")}
                placeholder="Enter facility description and services offered"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting || !formData.name || !formData.terminalId}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? "Creating..." : "Create Facility"}
            </Button>
          </Box>
        </Box>

        {/* Preview Section */}
        {formData.name && (
          <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Typography variant="body2">
                  <strong>Name:</strong> {formData.name}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2">
                  <strong>Type:</strong>
                  {/* <Chip
                    label={
                      dataFacilityTypes?.data?.find((t) => t.value === formData.type)
                        ?.label
                    }
                    size="small"
                    sx={{ ml: 1 }}
                  /> */}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2">
                  <strong>Terminal:</strong>{" "}
                  {terminals.find((t) => t.id === formData.terminalId)?.name ||
                    "Not selected"}
                </Typography>
              </Grid>
              {formData.location && (
                <Grid size={6}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {formData.location}
                  </Typography>
                </Grid>
              )}
              {formData.openingHours && (
                <Grid size={6}>
                  {/* <Typography variant="body2">
                    <strong>Hours:</strong> {formData.openingHours}
                  </Typography> */}
                  <OpeningHoursPicker
                    value={formData.openingHours}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, openingHours: val }))
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default memo(CreateFacility);
