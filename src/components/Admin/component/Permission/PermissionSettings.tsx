import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";

interface PermissionItem {
  module: string;
  action: string;
  key: string; // e.g. "FLIGHT_VIEW"
}

interface PermissionsResponse {
  resultCode: string;
  resultMessage: string;
  data: Record<string, Record<string, string>>; // matches your API response
}

const PermissionAdminSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [permissionGroups, setPermissionGroups] = useState<
    Record<string, PermissionItem[]>
  >({});

  // Fetch permissions from backend
  useEffect(() => {
    axios
      .get<PermissionsResponse>(
        "http://localhost:3000/auth/permissions/role/ADMIN"
      )
      .then((response) => {
        const data = response.data.data;
        const groups: Record<string, PermissionItem[]> = {};
        const initialSet = new Set<string>();

        Object.entries(data).forEach(([module, actions]) => {
          groups[module] = Object.entries(actions).map(([action, key]) => {
            initialSet.add(key);
            return { module, action, key };
          });
        });

        setPermissionGroups(groups);
        setPermissions(initialSet);
      })
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []);

  const handlePermissionChange = (key: string) => {
    setPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const handleSave = () => {
    axios
      .post("http://localhost:3000/auth/permissions/role/ADMIN", {
        permissions: Array.from(permissions),
      })
      .then((res) => alert(res.data.resultMessage))
      .catch((err) => {
        console.error(err);
        alert("Error saving permissions");
      });
  };

  const renderPermissionGroup = (module: string, items: PermissionItem[]) => (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }} key={module}>
      <Typography variant="h6" gutterBottom>
        {module} Permissions
      </Typography>
      <FormGroup>
        {items.map((item) => (
          <FormControlLabel
            key={item.key}
            control={
              <Checkbox
                checked={permissions.has(item.key)}
                onChange={() => handlePermissionChange(item.key)}
                color="primary"
              />
            }
            label={item.action}
          />
        ))}
      </FormGroup>
    </Paper>
  );

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Admin Permission Management
          </Typography>

          {Object.entries(permissionGroups).map(([module, items]) =>
            renderPermissionGroup(module, items)
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 3 }}
            onClick={handleSave}
            fullWidth
          >
            Save Changes
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionAdminSettings;
