// import React, { useState } from 'react';
// import { Checkbox, FormControlLabel, FormGroup, Typography, Button, Grid, Paper } from '@mui/material';

// const PermissionSettings: React.FC = () => {
//   const [permissions, setPermissions] = useState<Set<Permission>>(new Set(MONITOR_PERMISSIONS));

//   const handlePermissionChange = (permission: Permission) => {
//     setPermissions((prevPermissions) => {
//       const newPermissions = new Set(prevPermissions);
//       if (newPermissions.has(permission)) {
//         newPermissions.delete(permission); // Remove permission if already selected
//       } else {
//         newPermissions.add(permission); // Add permission if not selected
//       }
//       return newPermissions;
//     });
//   };

//   const handleSave = () => {
//     // Logic to save the updated permissions
//     console.log('Permissions saved:', Array.from(permissions));
//   };

//   const renderPermissionGroup = (category: string, categoryPermissions: Permission[]) => {
//     return (
//       <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           {category}
//         </Typography>
//         <FormGroup>
//           {categoryPermissions.map((permission) => (
//             <FormControlLabel
//               key={permission}
//               control={
//                 <Checkbox
//                   checked={permissions.has(permission)}
//                   onChange={() => handlePermissionChange(permission)}
//                   color="primary"
//                 />
//               }
//               label={permission}
//             />
//           ))}
//         </FormGroup>
//       </Paper>
//     );
//   };

//   return (
//     <Grid container spacing={3} justifyContent="center">
//       <Grid size={6}>
//         <Paper elevation={3} sx={{ padding: 3 }}>
//           <Typography variant="h5" gutterBottom>
//             Admin Permission Management
//           </Typography>

//           {renderPermissionGroup('Flight Permissions', [
//             Permission.FLIGHT_VIEW,
//             Permission.FLIGHT_CREATE,
//             Permission.FLIGHT_EDIT,
//             Permission.FLIGHT_DELETE,
//           ])}

//           {renderPermissionGroup('Passenger Permissions', [
//             Permission.PASSENGER_VIEW,
//             Permission.PASSENGER_EDIT,
//             Permission.PASSENGER_DELETE,
//           ])}

//           {renderPermissionGroup('Booking Permissions', [
//             Permission.BOOKING_VIEW,
//             Permission.BOOKING_EDIT,
//             Permission.BOOKING_DELETE,
//           ])}

//           {renderPermissionGroup('Aircraft Permissions', [
//             Permission.AIRCRAFT_VIEW,
//             Permission.AIRCRAFT_CREATE,
//             Permission.AIRCRAFT_EDIT,
//             Permission.AIRCRAFT_DELETE,
//           ])}

//           {renderPermissionGroup('Airport Permissions', [
//             Permission.AIRPORT_VIEW,
//             Permission.AIRPORT_CREATE,
//             Permission.AIRPORT_EDIT,
//             Permission.AIRPORT_DELETE,
//           ])}

//           {renderPermissionGroup('User/Admin Permissions', [
//             Permission.USER_VIEW,
//             Permission.USER_CREATE,
//             Permission.USER_EDIT,
//             Permission.USER_DELETE,
//           ])}

//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ marginTop: 3 }}
//             onClick={handleSave}
//             fullWidth
//           >
//             Save Changes
//           </Button>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// };

// export default PermissionSettings;

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

const PermissionSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<Set<Permission>>(new Set());
  //   const [role, setRole] = useState<string>('ADMIN'); // Default role, you can change this dynamically

  useEffect(() => {
    // Fetch permissions when the component is mounted
    axios
      .get(`/api/permissions/role/${role}`)
      .then((response) => {
        const permissionsData = response.data.permissions;
        const permissionsSet = new Set<Permission>(
          Object.keys(permissionsData).filter((key) => permissionsData[key])
        );
        setPermissions(permissionsSet);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });
  }, [role]); // Fetch again if the role changes

  const handlePermissionChange = (permission: Permission) => {
    setPermissions((prevPermissions) => {
      const newPermissions = new Set(prevPermissions);
      if (newPermissions.has(permission)) {
        newPermissions.delete(permission); // Remove permission if already selected
      } else {
        newPermissions.add(permission); // Add permission if not selected
      }
      return newPermissions;
    });
  };

  const handleSave = () => {
    // Logic to save the updated permissions
    console.log("Permissions saved:", Array.from(permissions));
  };

  const renderPermissionGroup = (
    category: string,
    categoryPermissions: Permission[]
  ) => {
    return (
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          {category}
        </Typography>
        <FormGroup>
          {categoryPermissions.map((permission) => (
            <FormControlLabel
              key={permission}
              control={
                <Checkbox
                  checked={permissions.has(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  color="primary"
                />
              }
              label={permission}
            />
          ))}
        </FormGroup>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Admin Permission Management
          </Typography>

          {renderPermissionGroup("Flight Permissions", [
            Permission.FLIGHT_VIEW,
            Permission.FLIGHT_CREATE,
            Permission.FLIGHT_EDIT,
            Permission.FLIGHT_DELETE,
          ])}

          {renderPermissionGroup("Passenger Permissions", [
            Permission.PASSENGER_VIEW,
            Permission.PASSENGER_EDIT,
            Permission.PASSENGER_DELETE,
          ])}

          {renderPermissionGroup("Booking Permissions", [
            Permission.BOOKING_VIEW,
            Permission.BOOKING_EDIT,
            Permission.BOOKING_DELETE,
          ])}

          {renderPermissionGroup("Aircraft Permissions", [
            Permission.AIRCRAFT_VIEW,
            Permission.AIRCRAFT_CREATE,
            Permission.AIRCRAFT_EDIT,
            Permission.AIRCRAFT_DELETE,
          ])}

          {renderPermissionGroup("Airport Permissions", [
            Permission.AIRPORT_VIEW,
            Permission.AIRPORT_CREATE,
            Permission.AIRPORT_EDIT,
            Permission.AIRPORT_DELETE,
          ])}

          {renderPermissionGroup("User/Admin Permissions", [
            Permission.USER_VIEW,
            Permission.USER_CREATE,
            Permission.USER_EDIT,
            Permission.USER_DELETE,
          ])}

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

export default PermissionSettings;
