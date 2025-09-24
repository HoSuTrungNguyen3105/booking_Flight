import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Container,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import { FacilityType, type Terminal } from "../../../utils/type";

interface CreateFacilityForm {
  name: string;
  type: FacilityType;
  description: string;
  terminalId: string;
  location: string;
  openingHours: string;
}

const CreateFacility = () => {
  const [formData, setFormData] = useState<CreateFacilityForm>({
    name: "",
    type: FacilityType.RESTAURANT,
    description: "",
    terminalId: "",
    location: "",
    openingHours: "",
  });

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch terminals on component mount
  useEffect(() => {
    const fetchTerminals = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/terminals");
        if (response.ok) {
          const data = await response.json();
          setTerminals(data);
        }
      } catch (error) {
        console.error("Error fetching terminals:", error);
        setMessage({ type: "error", text: "Failed to load terminals" });
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:3000/facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // setMessage({ type: "success", text: "Facility created successfully!" });
        setFormData({
          name: "",
          type: FacilityType.RESTAURANT,
          description: "",
          terminalId: "",
          location: "",
          openingHours: "",
        });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Failed to create facility",
        });
      }
    } catch (error) {
      console.error("Error creating facility:", error);
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const facilityTypeOptions = [
    { value: FacilityType.RESTAURANT, label: "Restaurant" },
    { value: FacilityType.SHOP, label: "Shop" },
    { value: FacilityType.LOUNGE, label: "Lounge" },
    { value: FacilityType.ATM, label: "ATM" },
    { value: FacilityType.WIFI, label: "WiFi Zone" },
    { value: FacilityType.CHARGING_STATION, label: "Charging Station" },
    { value: FacilityType.INFORMATION, label: "Information Desk" },
    { value: FacilityType.MEDICAL, label: "Medical Facility" },
    { value: FacilityType.PRAYER_ROOM, label: "Prayer Room" },
    { value: FacilityType.SMOKING_AREA, label: "Smoking Area" },
  ];

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

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add a new facility to the airport management system
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Facility Name */}
            <Grid size={6}>
              <TextField
                required
                fullWidth
                label="Facility Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter facility name"
              />
            </Grid>

            {/* Facility Type */}
            <Grid size={6}>
              <FormControl fullWidth required>
                <InputLabel>Facility Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  label="Facility Type"
                >
                  {facilityTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Terminal Selection */}
            <Grid size={6}>
              <FormControl fullWidth required>
                <InputLabel>Terminal</InputLabel>
                <Select
                  name="terminalId"
                  value={formData.terminalId}
                  onChange={handleSelectChange}
                  label="Terminal"
                  disabled={loading}
                >
                  {terminals.map((terminal) => (
                    <MenuItem key={terminal.id} value={terminal.id}>
                      <Box>
                        <Typography variant="body1">
                          {terminal.name} ({terminal.code})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {terminal.type}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
            </Grid>

            {/* Location */}
            <Grid size={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Near Gate A1, Level 2"
              />
            </Grid>

            {/* Opening Hours */}
            <Grid size={6}>
              <TextField
                fullWidth
                label="Opening Hours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleInputChange}
                placeholder="e.g., 06:00-22:00, 24/7"
                helperText="Format: HH:MM-HH:MM or descriptive text"
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
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
                  <Chip
                    label={
                      facilityTypeOptions.find((t) => t.value === formData.type)
                        ?.label
                    }
                    size="small"
                    sx={{ ml: 1 }}
                  />
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
                  <Typography variant="body2">
                    <strong>Hours:</strong> {formData.openingHours}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CreateFacility;
