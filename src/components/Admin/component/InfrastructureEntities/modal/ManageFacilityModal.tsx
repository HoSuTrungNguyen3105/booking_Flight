import React, { useState, useCallback, memo, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { type Facility } from "../../../../../utils/type";
import { OpeningHoursPicker } from "../../../../../common/DayPicker/date-picker";
import {
  mapStringToDropdown,
  useFindAllFacilityTypes,
  useFindTerminalIDStatuses,
} from "../../../../Api/useGetApi";
import type { ActionType } from "../../../../../common/Dropdown/SelectDropdown";
import SelectDropdown from "../../../../../common/Dropdown/SelectDropdown";
import {
  useCreateFacilities,
  useUpdateFacilities,
  type FacilityFormProps,
} from "../../../../Api/usePostApi";
import InputTextArea from "../../../../../common/Input/InputTextArea";
import InputTextField from "../../../../../common/Input/InputTextField";
import BaseModal from "../../../../../common/Modal/BaseModal";
import { ManageAccountsSharp } from "@mui/icons-material";

type IManageFacilityModalProps = {
  open: boolean;
  terminalId: string;
  updateData?: Facility;
  mode: "update" | "create";
  onClose: () => void;
  onSuccess: () => void;
};

const ManageFacilityModal = ({
  open,
  mode,
  onClose,
  onSuccess,
  terminalId,
  updateData,
}: IManageFacilityModalProps) => {
  const [formData, setFormData] = useState<FacilityFormProps>({
    name: "",
    type: "",
    description: "",
    terminalId: mode === "create" ? terminalId : "",
    location: "",
    openingHours: "",
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "update" && updateData) {
      setFormData({
        name: updateData.name || "",
        type: updateData.type || "",
        description: updateData.description || "",
        location: updateData.location || "",
        openingHours: updateData.openingHours || "",
        terminalId: updateData.terminalId || "",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        type: "",
        description: "",
        terminalId: terminalId || "",
        location: "",
        openingHours: "",
      });
    }
  }, [mode, updateData, open, terminalId]);

  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();

  const dataTerminalIdOptions = useCallback((): ActionType[] => {
    return (
      dataTerminalIDStatuses?.list?.map((i) => ({
        value: i.value,
        label: i.label,
      })) ?? []
    );
  }, [dataTerminalIDStatuses]);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FacilityFormProps) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { refetchCreateFacilities } = useCreateFacilities();

  const { refetchUpdateFacilities } = useUpdateFacilities(terminalId);

  console.log("terminalId", terminalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
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
          onClose();
        }
      } else if (mode === "update") {
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
        console.error("Error submitting facility");
      }
    } catch (error) {
      console.error("Error submitting facility:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const { dataFacilityTypes } = useFindAllFacilityTypes();

  const facilityTypeOptions = mapStringToDropdown(
    dataFacilityTypes?.data || []
  );

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" size="large" onClick={onClose}>
          Cancel
        </Button>
        <Button
          // type="submit"
          variant="contained"
          size="large"
          onClick={handleSubmit}
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
    );
  }, [handleSubmit, onClose, onSuccess, submitting, formData]);

  const renderContent = useCallback(() => {
    const handleSelectChange =
      (key: keyof typeof formData) => (value: string | number) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    return (
      <Box sx={{ pt: 1, height: "30rem" }}>
        <Grid container spacing={2}>
          {/* Facility Name */}
          <Grid size={12}>
            <InputTextField
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Enter facility name"
            />
          </Grid>

          {/* Facility Type */}
          <Grid size={12}>
            <FormControl fullWidth required>
              <SelectDropdown
                options={facilityTypeOptions}
                value={formData.type}
                placeholder="Select facility type"
                onChange={handleSelectChange("type")}
              />
            </FormControl>
          </Grid>

          {/* Terminal ID (Only in Create Mode) */}
          {mode === "create" && (
            <Grid size={12}>
              <FormControl fullWidth required>
                <SelectDropdown
                  value={formData.terminalId}
                  onChange={handleSelectChange("terminalId")}
                  placeholder="Select terminal"
                  options={dataTerminalIdOptions()}
                />
              </FormControl>
            </Grid>
          )}

          {/* Location */}
          <Grid size={12}>
            <InputTextField
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="e.g., Near Gate A1, Level 2"
            />
          </Grid>

          {/* Opening Hours */}
          <Grid size={12}>
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
      </Box>
    );
  }, [formData, handleChange, mode]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create New Facility" : "Update Facility"}
      subtitle={
        mode === "create"
          ? "Add a new facility to the airport management system"
          : "Update facility information"
      }
      Icon={ManageAccountsSharp}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(ManageFacilityModal);
