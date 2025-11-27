import { useEffect, useMemo, useState } from "react";
import {
  useGetPermissionsForRole,
  useUpdatePermissionsForRole,
  useGetPermissionDefinitions,
  type PermissionDefinition,
} from "../../../../context/Api/PermissionsApi";
import {
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon, Save as SaveIcon } from "@mui/icons-material";
import { ResponseCode } from "../../../../utils/response";
import Switch from "../../../../common/Switch/Switch";
import DetailSection from "../../../../common/AdditionalCustomFC/DetailSection";

const RolePermissionsTab: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "MONITOR">(
    "ADMIN"
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // Fetch all permission definitions to show all available options
  const { refetchPermissionDefinitions, loadingPermissionDefinitions } =
    useGetPermissionDefinitions();
  const [selected, setSelected] = useState("");

  // Fetch current role permissions
  const {
    rolePermissions,
    refetchRolePermissions,
    loadingRolePermissions,
    errorRolePermissions,
  } = useGetPermissionsForRole(selectedRole);

  const { updateRolePermissions, loadingUpdateRolePermissions } =
    useUpdatePermissionsForRole(selectedRole);

  // Update local state when data is fetched
  useEffect(() => {
    if (rolePermissions?.list) {
      setPermissions(rolePermissions.list.permissions);
      setHasChanges(false);
    }
  }, [rolePermissions]);

  const handlePermissionToggle = (key: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
    const result = await updateRolePermissions(permissions);
    if (result?.resultCode === ResponseCode.SUCCESS) {
      setHasChanges(false);
      alert(`Permissions for ${selectedRole} updated successfully!`);
      refetchRolePermissions();
    } else {
      alert("Failed to update permissions");
    }
  };

  const handleRoleChange = (role: "ADMIN" | "MONITOR") => {
    if (hasChanges) {
      if (!confirm("You have unsaved changes. Do you want to discard them?")) {
        return;
      }
    }
    setSelectedRole(role);
    setHasChanges(false);
  };

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    if (!permissionDefinitions?.data) return {};
    const groups: Record<string, PermissionDefinition[]> = {};

    permissionDefinitions.data.forEach((def) => {
      if (!groups[def.category]) {
        groups[def.category] = [];
      }
      groups[def.category].push(def);
    });
    return groups;
  }, [permissionDefinitions]);

  if (loadingRolePermissions || loadingPermissionDefinitions) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorRolePermissions) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load permissions. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Role Selector */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Role
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Chip
            label="ADMIN"
            color={selectedRole === "ADMIN" ? "primary" : "default"}
            onClick={() => handleRoleChange("ADMIN")}
            sx={{ cursor: "pointer", fontSize: "1rem", py: 2.5, px: 1 }}
          />
          <Chip
            label="MONITOR"
            color={selectedRole === "MONITOR" ? "secondary" : "default"}
            onClick={() => handleRoleChange("MONITOR")}
            sx={{ cursor: "pointer", fontSize: "1rem", py: 2.5, px: 1 }}
          />
          <Box flexGrow={1} />
          <Tooltip title="Refresh permissions">
            <IconButton
              onClick={() => {
                refetchRolePermissions();
              }}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Permissions Grid */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">
            Permissions for {selectedRole}
            {hasChanges && (
              <Chip
                label="Unsaved Changes"
                color="warning"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSavePermissions}
            disabled={!hasChanges || loadingUpdateRolePermissions}
          >
            {loadingUpdateRolePermissions ? "Saving..." : "Save Changes"}
          </Button>
        </Box>

        {Object.keys(groupedPermissions).length === 0 ? (
          <Alert severity="info">No permission definitions found.</Alert>
        ) : (
          Object.entries(groupedPermissions).map(([category, items]) => (
            <Box key={category} mb={4}>
              <DetailSection
                title={category}
                data={items.map((item) => ({
                  title: item.action, // Display Action (e.g., VIEW, CREATE)
                  description: (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={!!permissions[item.key]}
                        onChange={() => handlePermissionToggle(item.key)}
                        color="primary"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.description || item.key}
                      </Typography>
                    </Box>
                  ),
                  size: 4, // 3 items per row (12/4 = 3)
                }))}
                itemPerRow={3}
                border
              />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};
export default RolePermissionsTab;
