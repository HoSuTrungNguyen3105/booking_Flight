import React from "react";
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Switch,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  useDeletePermissionDefinition,
  useUpdatePermissionDefinition,
  type PermissionDefinition,
} from "../../../../context/Api/PermissionsApi";
import { ResponseCode } from "../../../../utils/response";

const PermissionDefinitionCard: React.FC<{
  definition: PermissionDefinition;
  onRefresh: () => void;
}> = ({ definition, onRefresh }) => {
  const { updatePermissionDefinition, loadingUpdateDefinition } =
    useUpdatePermissionDefinition(definition.id);
  const { deletePermissionDefinition, loadingDeleteDefinition } =
    useDeletePermissionDefinition(definition.id);

  const handleToggleActive = async () => {
    const result = await updatePermissionDefinition({
      isActive: !definition.isActive,
    });
    if (result?.resultCode === ResponseCode.SUCCESS) {
      onRefresh();
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${definition.key}"?`)) {
      const result = await deletePermissionDefinition();
      if (result?.resultCode === "00") {
        alert("Permission definition deleted successfully!");
        onRefresh();
      } else {
        alert("Failed to delete permission definition");
      }
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={2}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ wordBreak: "break-word" }}
          >
            {definition.key}
          </Typography>
          <Chip
            label={definition.isActive ? "Active" : "Inactive"}
            color={definition.isActive ? "success" : "default"}
            size="small"
          />
        </Box>
        <Box mb={1}>
          <Chip label={definition.category} size="small" sx={{ mr: 1 }} />
          <Chip label={definition.action} size="small" variant="outlined" />
        </Box>
        {definition.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {definition.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Tooltip title={definition.isActive ? "Deactivate" : "Activate"}>
          <Switch
            checked={definition.isActive}
            onChange={handleToggleActive}
            disabled={loadingUpdateDefinition}
            size="small"
          />
        </Tooltip>
        <Box flexGrow={1} />
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={loadingDeleteDefinition}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
export default PermissionDefinitionCard;
