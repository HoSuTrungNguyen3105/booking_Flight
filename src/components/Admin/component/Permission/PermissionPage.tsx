import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import type {
  DetailResponseMessage,
  RolePermission,
} from "../../../../utils/type";

type PermissionResponse = DetailResponseMessage<RolePermission>;

const PermissionPage: React.FC = () => {
  const [permissionsData, setPermissionsData] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the role-permission data when the component mounts
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // const response = await axios.get<PermissionResponse>('http://your-api-endpoint/permissions');

        if (response.data.resultCode === "00") {
          // Assuming data is returned as a list of roles and their permissions
          const rolePermissions = [
            {
              role: "ADMIN",
              permissions: Object.keys(response.data.data).slice(0, 8),
            },
            {
              role: "MONITOR",
              permissions: Object.keys(response.data.data).slice(8, 14),
            },
            {
              role: "USER",
              permissions: Object.keys(response.data.data).slice(14),
            },
          ];
          setPermissionsData(rolePermissions);
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

  // Render Table for each role
  const renderPermissionTable = (
    role: string,
    permissions: Record<string, boolean>
  ) => {
    return (
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Typography variant="h6" sx={{ padding: 2 }}>
          {role} Permissions
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Permission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission, index) => (
              <TableRow key={index}>
                <TableCell>{permission}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Manage Permissions
          </Typography>

          {isLoading && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          )}

          {error && <Typography color="error">{error}</Typography>}

          {!isLoading && !error && permissionsData.length > 0 && (
            <>
              {permissionsData.map((rolePermission, index) => (
                <React.Fragment key={index}>
                  {renderPermissionTable(
                    rolePermission.role,
                    rolePermission.permissions
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionPage;
