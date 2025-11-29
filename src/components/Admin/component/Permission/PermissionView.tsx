import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { useGetAllPermissions } from "../../../../context/Api/PermissionsApi";

interface PermissionResponse {
  resultCode: string;
  resultMessage: string;
  data: Record<string, string>;
}

const PermissionPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Record<string, string>>({});

  const { allPermissions, errorAllPermissions, loadingAllPermissions } =
    useGetAllPermissions();

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      if (newPermissions[permission]) {
        delete newPermissions[permission];
      } else {
        newPermissions[permission] = permission;
      }
      return newPermissions;
    });
  };

  const renderPermissionCheckboxes = () => {
    return Object.keys(permissions).map((permission) => (
      <FormControlLabel
        key={permission}
        control={
          <Checkbox
            checked={permissions[permission] !== undefined}
            onChange={() => handlePermissionChange(permission)}
            color="primary"
          />
        }
        label={permission}
      />
    ));
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Manage Permissions
          </Typography>

          {loadingAllPermissions && <Typography>Loading...</Typography>}

          {errorAllPermissions && (
            <Typography color="error">{errorAllPermissions}</Typography>
          )}

          {Object.keys(allPermissions?.list || {}).length > 0 && (
            <FormGroup>{renderPermissionCheckboxes()}</FormGroup>
          )}

          {Object.keys(permissions).length > 0 && (
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 3 }}
              onClick={() => alert("Permissions saved!")} // Implement saving functionality here
              fullWidth
            >
              Save Changes
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionPage;
