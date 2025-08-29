import React, { memo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AsideLnb from "./Sidebar";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { menuData, type MenuItem } from "./../../utils/db";
import Header from "../../common/Setting/Header";

const ResizeLayout = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState<Record<string, boolean>>({});

  const handleMenuToggle = (id: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const buildPath = (id: string) => `/admin/${id}`;

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const hasSubItems = !!item.subItems?.length;
      const isOpen = openMenu[item.id] || false;
      const fullPath = buildPath(item.id);

      return (
        <React.Fragment key={item.id}>
          <ListItemButton
            key={item.label}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
            })}
            onClick={() => {
              if (hasSubItems) {
                handleMenuToggle(item.id);
              } else {
                navigate(fullPath);
              }
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
            )}
            <ListItemText primary={item.label} />
            {hasSubItems &&
              (isOpen ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              ))}
          </ListItemButton>

          {hasSubItems && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component={"div"} sx={{ height: "100%" }} disablePadding>
                {renderMenuItems(item.subItems!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <AsideLnb>
      <Box
        sx={(theme) => ({
          height: "100%",
          py: "20px",
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.grey[200]}`,
        })}
      >
        {menuData.map((section, index) => (
          <List
            key={index}
            subheader={
              <Typography variant="subtitle2">{section.title}</Typography>
            }
          >
            {renderMenuItems(section.items)}
          </List>
        ))}
      </Box>
      <Box flex={1} sx={{ overflow: "auto" }}>
        <Outlet />
      </Box>
    </AsideLnb>
  );
};

const ManageLayout = () => {
  return (
    <Stack direction={"column"} sx={{ height: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{ height: "calc(100vh - 48px)" }}
        flexGrow={1}
        bgcolor={"var(--bg-green-md)"}
      >
        <Box display="flex" height="100%">
          <ResizeLayout />
          <Box
            component="article"
            flexGrow={1}
            p={2}
            bgcolor="grey.50"
            sx={{
              transition: "width 200ms",
              overflow: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default memo(ManageLayout);
