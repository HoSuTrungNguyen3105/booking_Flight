import React, { useState, useCallback, memo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { type Facility, type Terminal } from "../../../utils/type";
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
  useUpdateFacilities,
  type FacilityFormProps,
} from "../../Api/usePostApi";
import InputTextArea from "../../../common/Input/InputTextArea";
import InputTextField from "../../../common/Input/InputTextField";

type Props = {
  terminalId: string;
  updateData?: Facility;
  mode: "update" | "create";
  onClose: () => void;
};

const CreateFacility = ({ onClose, terminalId, updateData, mode }: Props) => {
  const [formData, setFormData] = useState<FacilityFormProps>({
    name: "",
    type: "",
    description: "",
    terminalId: mode === "create" ? terminalId : "",
    location: "",
    openingHours: "",
  });

  // Nếu update thì set lại formData bằng updateData
  useEffect(() => {
    if (mode === "update" && updateData) {
      setFormData({
        name: updateData.name || "",
        type: updateData.type || "",
        description: updateData.description || "",
        location: updateData.location || "",
        openingHours: updateData.openingHours || "",
        terminalId: updateData.terminalId || "",
      });
    }
  }, [mode, updateData]);

  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();

  const dataTerminalIdOptions = useCallback((): ActionType[] => {
    return (
      dataTerminalIDStatuses?.list?.map((i) => ({
        value: i.value,
        label: i.label,
      })) ?? []
    );
  }, [dataTerminalIDStatuses]);

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (field: keyof FacilityFormProps) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { refetchCreateFacilities } = useCreateFacilities();
  const { refetchUpdateFacilities } = useUpdateFacilities(terminalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      let response;
      if (mode === "create") {
        response = await refetchCreateFacilities(formData);
      } else if (mode === "update") {
        response = await refetchUpdateFacilities(formData);
      }

      if (response?.resultCode === "00") {
        if (mode === "create") {
          setFormData({
            name: "",
            type: "",
            description: "",
            terminalId: "",
            location: "",
            openingHours: "",
          });
        }
        onClose();
      } else {
        setMessage({
          type: "error",
          text:
            mode === "create"
              ? "Failed to create facility"
              : "Failed to update facility",
        });
      }
    } catch (error) {
      console.error("Error submitting facility:", error);
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
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="primary"
        fontWeight="bold"
      >
        {mode === "create" ? "Create New Facility" : "Update Facility"}
      </Typography>

      <Button onClick={onClose} variant="contained">
        Return
      </Button>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {mode === "create"
          ? "Add a new facility to the airport management system"
          : "Update facility information"}
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
                    type: value as string,
                  }))
                }
              />
            </FormControl>
          </Grid>

          {/* Terminal Selection (chỉ hiện khi create) */}
          {mode === "create" && (
            <Grid size={6}>
              <FormControl fullWidth required>
                <SelectDropdown
                  value={formData.terminalId}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      terminalId: value as string,
                    }))
                  }
                  placeholder="Select terminal ID"
                  options={dataTerminalIdOptions()}
                  disabled={loading}
                />
              </FormControl>
              {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
            </Grid>
          )}

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
            {submitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Facility"
              : "Update Facility"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default memo(CreateFacility);
