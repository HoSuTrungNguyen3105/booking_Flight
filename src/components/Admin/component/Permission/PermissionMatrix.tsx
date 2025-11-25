import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

interface Permissions {
  [module: string]: {
    [action: string]: boolean;
  };
}

interface PermissionMatrixProps {
  role?: string; // Nếu quản lý role
  userId?: number; // Nếu quản lý user
  passengerId?: string; // Nếu quản lý passenger
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  role,
  userId,
  passengerId,
}) => {
  const [permissions, setPermissions] = useState<Permissions>({});

  // Fetch permissions từ backend
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        let res;
        if (role) {
          res = await axios.get(`/role-permissions/${role}`);
        } else if (userId) {
          res = await axios.get(`/user-permissions/${userId}`);
        } else if (passengerId) {
          res = await axios.get(`/user-permissions/passenger/${passengerId}`);
        }
        setPermissions(res?.data?.permissions || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchPermissions();
  }, [role, userId, passengerId]);

  // Toggle action checkbox
  const handleToggle = (module: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  // Lưu permissions
  const handleSave = async () => {
    try {
      let res;
      if (role) {
        res = await axios.post(`/role-permissions/${role}`, { permissions });
      } else {
        res = await axios.post(`/user-permissions`, {
          userId,
          passengerId,
          permissions,
        });
      }
      alert(res.data.resultMessage);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu permissions");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {role ? `Quyền Role: ${role}` : `Quyền User`}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              {Object.keys(permissions[Object.keys(permissions)[0]] || {}).map(
                (action) => (
                  <TableCell key={action}>{action}</TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(permissions).map(([module, actions]) => (
              <TableRow key={module}>
                <TableCell>{module}</TableCell>
                {Object.entries(actions).map(([action, value]) => (
                  <TableCell key={action}>
                    <Checkbox
                      checked={value}
                      onChange={() => handleToggle(module, action)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Lưu Quyền
        </Button>
      </Box>
    </Box>
  );
};

export default PermissionMatrix;
