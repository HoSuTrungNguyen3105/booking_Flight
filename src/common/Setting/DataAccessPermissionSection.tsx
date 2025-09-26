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

const DataAccessPermissionSection = () => {
  const serviceTypes = [
    { label: "Dữ liệu chuyến bay", color: "primary" },
    { label: "Dữ liệu sân bay", color: "secondary" },
    { label: "Dữ liệu máy bay", color: "success" },
    { label: "Quản lý nhân viên", color: "warning" },
    { label: "Hệ thống đặt vé", color: "error" },
  ];

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "10px 16px",
          border: 1,
          borderColor: "grey.200",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <Typography component="p" variant="subtitle1" fontWeight="600">
          Quyền truy cập dữ liệu
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Các dịch vụ mà bạn (Admin) có quyền kiểm tra và quản lý.
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
        <Typography component="p" p={1} variant="body2">
          서비스 유형
        </Typography>
        <List
          dense
          disablePadding
          sx={{
            maxHeight: "8rem", // Giới hạn chiều cao toàn bộ danh sách
            overflowY: "auto", // Khi vượt quá thì sẽ có scroll
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
                <CheckCircle color={service.color as any} />
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
