import React, { useState } from "react";
import {
  Paper,
  Typography,
  FormControlLabel,
  Button,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  CloudUpload as SeedIcon,
} from "@mui/icons-material";
import {
  useGetPermissionDefinitions,
  useAddPermissionDefinition,
  useSeedPermissionDefinitions,
  type CreatePermissionDefinitionDto,
} from "../../../../context/Api/PermissionsApi";
import PermissionDefinitionCard from "./PermissionDefinitionCard";
import { ResponseCode } from "../../../../utils/response";
import InputTextField from "../../../../common/Input/InputTextField";
import Switch from "../../../../common/Switch/Switch";
import InputTextArea from "../../../../common/Input/InputTextArea";
import { useToast } from "../../../../context/ToastContext";

const PermissionDefinitionsTab: React.FC = () => {
  const toast = useToast();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<CreatePermissionDefinitionDto>({
    key: "",
    category: "",
    action: "",
    description: "",
  });

  const { refetchPermissionDefinitions, loadingPermissionDefinitions } =
    useGetPermissionDefinitions(categoryFilter, isActiveFilter);

  const { addPermissionDefinition, loadingAddDefinition } =
    useAddPermissionDefinition();

  const { seedPermissionDefinitions, loadingSeedDefinitions } =
    useSeedPermissionDefinitions();

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({ key: "", category: "", action: "", description: "" });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setFormData({ key: "", category: "", action: "", description: "" });
  };

  const handleSaveNew = async () => {
    if (!formData.key || !formData.category || !formData.action) {
      toast("Please fill in all required fields");
      return;
    }

    const result = await addPermissionDefinition(formData);
    if (result?.resultCode === ResponseCode.SUCCESS) {
      toast("Permission definition added successfully!");
      setIsAddingNew(false);
      setFormData({ key: "", category: "", action: "", description: "" });
      refetchPermissionDefinitions();
    } else {
      toast("Failed to add permission definition");
    }
  };

  const handleSeedDefinitions = async () => {
    if (confirm("This will seed permission definitions from code. Continue?")) {
      const result = await seedPermissionDefinitions();
      if (result?.resultCode === "00") {
        toast("Permission definitions seeded successfully!");
        refetchPermissionDefinitions();
      } else {
        toast("Failed to seed permission definitions");
      }
    }
  };

  console.log("loading", loadingPermissionDefinitions);

  if (loadingPermissionDefinitions || !permissionDefinitions) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Actions Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <InputTextField
            placeholder="Filter by Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isActiveFilter === true}
                onChange={(e) =>
                  setIsActiveFilter(e.target.checked ? true : undefined)
                }
              />
            }
            label="Active Only"
          />
          <Box flexGrow={1} />
          <Button
            variant="outlined"
            startIcon={<SeedIcon />}
            onClick={handleSeedDefinitions}
            disabled={loadingSeedDefinitions}
          >
            Seed Definitions
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            disabled={isAddingNew}
          >
            Add New
          </Button>
          <IconButton
            onClick={() => refetchPermissionDefinitions()}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Add New Form */}
      {isAddingNew && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h6" gutterBottom>
            Add New Permission Definition
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputTextField
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e })}
                placeholder="e.g., FLIGHT:VIEW"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <InputTextField
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e })}
                placeholder="e.g., FLIGHT"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <InputTextField
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e })}
                placeholder="e.g., VIEW"
              />
            </Grid>
            <Grid size={12}>
              <InputTextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e })}
                placeholder="e.g., View flight details"
              />
            </Grid>
            <Grid size={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveNew}
                  disabled={loadingAddDefinition}
                >
                  {loadingAddDefinition ? "Saving..." : "Save"}
                </Button>
                <Button variant="outlined" onClick={handleCancelAdd}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Definitions List */}
      <Grid container spacing={2}>
        {permissionDefinitions?.data?.map((definition) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={definition.id}>
            <PermissionDefinitionCard
              definition={definition}
              onRefresh={refetchPermissionDefinitions}
            />
          </Grid>
        ))}
      </Grid>

      {/* {permissionDefinitions?.data?.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No permission definitions found. Click "Seed Definitions" to populate
          from code.
        </Alert>
      )} */}
    </Box>
  );
};

export default PermissionDefinitionsTab;
