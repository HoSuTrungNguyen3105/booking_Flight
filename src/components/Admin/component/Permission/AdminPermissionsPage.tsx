import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

type Permission = string;

interface PermissionsResponse {
  resultCode: string;
  resultMessage: string;
  data: Record<Permission, boolean>;
}

const AdminPermissionsPage: React.FC = () => {
  const [role, setRole] = useState<"ADMIN" | "MONITOR">("ADMIN");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | string>(""); // User or Passenger ID
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch permissions when role or user changes
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<PermissionsResponse>(
          `/auth/permissions/role/${role}`
        );
        if (response.data.resultCode === "00") {
          setPermissions(response.data.data);
        } else {
          setError("Failed to fetch permissions.");
        }
      } catch (err) {
        setError("Error fetching permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [role]);

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as "ADMIN" | "MONITOR");
  };

  const handleUserIdChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUserId(event.target.value);
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    const updatePermissions = {
      permissions,
    };

    try {
      await axios.post(`/auth/permissions/user`, {
        userId,
        permissions,
      });
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating permissions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Permission Management
      </Typography>

      {/* Role Selection */}
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={handleRoleChange} label="Role">
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="MONITOR">Monitor</MenuItem>
        </Select>
      </FormControl>

      {/* User/Passenger Selection */}
      <TextField
        label="User or Passenger ID"
        variant="outlined"
        fullWidth
        value={userId}
        onChange={handleUserIdChange}
        sx={{ marginBottom: 2 }}
      />

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Permissions for {role}
          </Typography>

          {/* Render Permissions */}
          <Grid container spacing={2}>
            {Object.keys(permissions).map((permission) => (
              <Grid item xs={12} sm={6} key={permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[permission]}
                      onChange={() => handlePermissionChange(permission)}
                      color="primary"
                    />
                  }
                  label={permission}
                />
              </Grid>
            ))}
          </Grid>

          {/* Save Permissions Button */}
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSavePermissions}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AdminPermissionsPage;
