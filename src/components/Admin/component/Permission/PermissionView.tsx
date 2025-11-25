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

interface PermissionResponse {
  resultCode: string;
  resultMessage: string;
  data: Record<string, string>;
}

const PermissionPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<PermissionResponse>(
          "http://localhost:3000/auth/permissions/type/all"
        );
        if (response.data.resultCode === "00") {
          setPermissions(response.data.data);
        } else {
          setError("Failed to fetch permissions");
        }
      } catch (err) {
        setError("Error fetching permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      if (newPermissions[permission]) {
        delete newPermissions[permission]; // Remove permission if already selected
      } else {
        newPermissions[permission] = permission; // Add permission if not selected
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

          {isLoading && <Typography>Loading...</Typography>}

          {error && <Typography color="error">{error}</Typography>}

          {Object.keys(permissions).length > 0 && (
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
