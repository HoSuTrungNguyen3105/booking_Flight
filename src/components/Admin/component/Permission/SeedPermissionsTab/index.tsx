import React from "react";
import {
  Typography,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { CloudUpload as SeedIcon } from "@mui/icons-material";
import {
  useSeedDefaultPermissions,
  useSeedPermissionsFromDatabase,
} from "../../../../../context/Api/PermissionsApi";
import { ResponseCode } from "../../../../../utils/response";
import { useToast } from "../../../../../context/ToastContext";

const SeedPermissionsTab: React.FC = () => {
  const toast = useToast();
  const { seedDefaultPermissions, loadingSeedDefault } =
    useSeedDefaultPermissions();
  const { seedPermissionsFromDatabase, loadingSeedFromDatabase } =
    useSeedPermissionsFromDatabase();

  const handleSeedDefault = async () => {
    if (
      confirm(
        "This will seed default permissions for ADMIN and MONITOR roles. Continue?"
      )
    ) {
      const result = await seedDefaultPermissions();
      if (result?.resultCode === ResponseCode.SUCCESS) {
        toast(result.resultMessage, "success");
      } else {
        toast(
          result?.resultMessage || "Failed to seed default permissions",
          "error"
        );
      }
    }
  };

  const handleSeedFromDatabase = async () => {
    if (
      confirm("This will seed permissions from database definitions. Continue?")
    ) {
      const result = await seedPermissionsFromDatabase();
      if (result?.resultCode === ResponseCode.SUCCESS) {
        toast(result.resultMessage, "success");
      } else {
        toast(
          result?.resultMessage || "Failed to seed permissions from database",
          "error"
        );
      }
    }
  };

  return (
    <Box pt={1}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seed Default Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This will populate the database with predefined default
                permissions for ADMIN and MONITOR roles based on your
                application's permission constants.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                This operation will reset all role permissions to their default
                values.
              </Alert>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                // color="primary"
                startIcon={<SeedIcon />}
                onClick={handleSeedDefault}
                disabled={loadingSeedDefault}
                fullWidth
              >
                {loadingSeedDefault ? "Seeding..." : "Seed Default Permissions"}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seed from Database Definitions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This will seed permissions based on the permission definitions
                stored in your database. Useful for dynamic permission
                management.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Ensure permission definitions are properly configured before
                seeding.
              </Alert>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                // color="secondary"
                startIcon={<SeedIcon />}
                onClick={handleSeedFromDatabase}
                disabled={loadingSeedFromDatabase}
                fullWidth
              >
                {loadingSeedFromDatabase ? "Seeding..." : "Seed from Database"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default SeedPermissionsTab;
