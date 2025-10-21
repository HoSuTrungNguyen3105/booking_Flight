import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const DataAccessPermissionSection = () => {
  const { t } = useTranslation();

  const serviceTypes = [
    { label: "Dữ liệu chuyến bay", color: "#0D47A1" },
    { label: "Dữ liệu sân bay", color: "#D32F2F" },
    { label: "Dữ liệu máy bay", color: "#2E7D32" },
  ];

  return (
    <Box gap={1}>
      <Box
        sx={{
          border: 1,
          backgroundColor: "white",
          borderColor: "divider",
          p: 1,
        }}
      >
        <Typography component="p" variant="subtitle1" fontWeight="600">
          {t("data_access_title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("data_access_description")}
        </Typography>
      </Box>

      <Box
        sx={{
          margin: 1,
          border: 1,
          borderColor: "grey.200",
          backgroundColor: "white",
        }}
      >
        <List
          dense
          disablePadding
          sx={{
            maxHeight: "8rem",
            overflowY: "auto",
            border: 1,
            borderColor: "grey.200",
          }}
        >
          {serviceTypes.map((service, index) => (
            <ListItem
              key={index}
              sx={{
                borderTop: index > 0 ? 1 : 0,
                borderColor: "grey.100",
              }}
            >
              <ListItemIcon>
                <CheckCircle sx={{ color: service.color }} />
              </ListItemIcon>
              <ListItemText primary={service.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default memo(DataAccessPermissionSection);
