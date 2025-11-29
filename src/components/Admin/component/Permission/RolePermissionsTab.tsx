import { useCallback, useEffect, useState } from "react";
import {
  useGetPermissionsForRole,
  useUpdatePermissionsForRole,
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
import { useToast } from "../../../../context/ToastContext";

interface PermissionItem {
  action: string; // VIEW, EDIT
  key: string; // FLIGHT_VIEW
  description?: string;
}

type PermissionGroup = Record<string, PermissionItem[]>;

const RolePermissionsTab: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "MONITOR">(
    "ADMIN"
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const {
    rolePermissions,
    refetchRolePermissions,
    loadingRolePermissions,
    // errorRolePermissions,
  } = useGetPermissionsForRole(selectedRole);

  const { updateRolePermissions, loadingUpdateRolePermissions } =
    useUpdatePermissionsForRole(selectedRole);

  useEffect(() => {
    refetchRolePermissions();
  }, [selectedRole]);

  const toast = useToast();

  // Update local state when data is fetched
  useEffect(() => {
    if (rolePermissions?.data) {
      setPermissions(rolePermissions.data.permissions);
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
      toast(`Permissions for ${selectedRole} updated successfully!`);
      refetchRolePermissions();
    } else {
      toast("Failed to update permissions", "error");
    }
  };

  const groupPermissions = (
    permissions: Record<string, boolean>
  ): PermissionGroup => {
    const groups: PermissionGroup = {};

    Object.keys(permissions).forEach((key) => {
      const [module, action] = key.split("_"); // FLIGHT_VIEW => ["FLIGHT", "VIEW"]

      if (!groups[module]) groups[module] = [];

      groups[module].push({
        action,
        key,
      });
    });

    return groups;
  };

  const grouped = groupPermissions(permissions);

  const handleRoleChange = useCallback(
    async (role: "ADMIN" | "MONITOR") => {
      if (hasChanges) {
        if (
          !confirm("You have unsaved changes. Do you want to discard them?")
        ) {
          return;
        }
      }
      setSelectedRole(role);
      //   await refetchRolePermissions();
      setHasChanges(false);
    },
    [hasChanges, refetchRolePermissions]
  );

  if (loadingRolePermissions || loadingUpdateRolePermissions) {
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

        {Object.entries(grouped).length === 0 ? (
          <Alert severity="info">No permission definitions found.</Alert>
        ) : (
          Object.entries(grouped).map(([module, items]) => (
            <Box key={module} mb={4}>
              <DetailSection
                title={module}
                data={items.map((item) => ({
                  title: item.action,
                  hasBorder: false,
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
                  size: 4,
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
