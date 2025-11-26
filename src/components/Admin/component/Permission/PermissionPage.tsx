import React from "react";
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
import { useGetPermissionsByRole } from "../../../../context/Api/AuthApi";

interface RolePermissionTableProps {
  role: string;
}

const RolePermissionTable: React.FC<RolePermissionTableProps> = ({ role }) => {
  const { dataPermissionsByRole } = useGetPermissionsByRole(role);

  if (!dataPermissionsByRole) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const permissions = dataPermissionsByRole.data || {};

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
      <Typography variant="h6" sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        {role} Permissions
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Module</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {Object.entries(permissions).map(([module, actions]) =>
            Object.entries(actions).map(([action, key], index) => (
              <TableRow key={key}>
                {index === 0 && (
                  <TableCell
                    rowSpan={Object.keys(actions).length}
                    sx={{ verticalAlign: "top", fontWeight: "bold" }}
                  >
                    {module}
                  </TableCell>
                )}
                <TableCell>{action}</TableCell>
                <TableCell>{key}</TableCell>
              </TableRow>
            ))
          )} */}
          {Object.keys(permissions).length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No permissions found for this role.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PermissionPage: React.FC = () => {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Manage Permissions
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            View permissions assigned to each role.
          </Typography>

          <RolePermissionTable role="ADMIN" />
          <RolePermissionTable role="MONITOR" />
          <RolePermissionTable role="USER" />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionPage;
