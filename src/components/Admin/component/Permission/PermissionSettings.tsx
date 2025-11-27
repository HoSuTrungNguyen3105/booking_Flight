import React, { useState, useEffect, useMemo } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

const PermissionAdminSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  // Initialize permissions state when data is fetched
  // useEffect(() => {
  //   if (dataPermissionsByRole?.list) {
  //     setPermissions(new Set(dataPermissionsByRole.list));
  //   }
  // }, [dataPermissionsByRole]);

  // // Group permissions by module
  // const permissionGroups = useMemo(() => {
  //   if (!dataPermissionsByRole?.list) return {};

  //   const groups: Record<string, Record<string, string>> = {};

  //   dataPermissionsByRole.list.forEach((perm) => {
  //     const parts = perm.split("_");
  //     const action = parts.pop(); // Last part is the action (VIEW, CREATE, etc.)
  //     const module = parts.join("_"); // Rest is the module

  //     if (action && module) {
  //       if (!groups[module]) {
  //         groups[module] = {};
  //       }
  //       groups[module][action] = perm;
  //     }
  //   });

  //   return groups;
  // }, [dataPermissionsByRole]);

  const handlePermissionChange = (key: string) => {
    setPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const handleSave = async () => {
    // await refetchUpdatePermissions({ permissions: Array.from(permissions) })
    //   .then((res) => {
    //     if (res?.resultMessage) alert(res.resultMessage);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     alert("Error saving permissions");
    //   });
  };

  const renderPermissionGroup = (
    module: string,
    items: Record<string, string>
  ) => {
    return (
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }} key={module}>
        <Typography variant="h6" gutterBottom>
          {module} Permissions
        </Typography>
        <FormGroup row>
          {Object.entries(items).map(([action, key]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={permissions.has(key)}
                  onChange={() => handlePermissionChange(key)}
                  color="primary"
                />
              }
              label={action}
              sx={{ marginRight: 4 }}
            />
          ))}
        </FormGroup>
      </Paper>
    );
  };

  // if (!dataPermissionsByRole) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Admin Permission Management
          </Typography>

          {/* {Object.entries(permissionGroups).map(([module, items]) =>
            renderPermissionGroup(module, items)
          )} */}

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
