import React, { memo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AsideLnb from "./../Admin/Sidebar";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { menuData, type MenuItem } from "../../../public/db";

const ResizeLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState<Record<string, boolean>>({});

  const handleMenuToggle = (id: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const buildPath = (id: string) => `/admin/${id}`;

  // Đệ quy render menu
  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const hasSubItems = !!item.subItems?.length;
      const isOpen = openMenu[item.id] || false;

      const fullPath = buildPath(item.id);
      const isActive = pathname === fullPath;

      return (
        <React.Fragment key={item.id}>
          <ListItemButton
            sx={{
              pl: 2 + level * 2,
              bgcolor: !hasSubItems && isActive ? "action.selected" : "inherit",
            }}
            onClick={() => {
              if (hasSubItems) {
                handleMenuToggle(item.id);
              } else {
                navigate(fullPath);
              }
            }}
          >
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
              <List disablePadding>
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
          overflowY: "auto",
          bgcolor: theme.palette.background.paper,
        })}
      >
        <List
          subheader={
            <Typography
              variant="subtitle2"
              py="20px"
              fontWeight="bold"
              sx={{ pl: 2, pt: 2 }}
            >
              Tab 1
            </Typography>
          }
        >
          {renderMenuItems(menuData.tab1Items)}
        </List>
        <List
          subheader={
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ pl: 2, pt: 2 }}
            >
              Tab 2
            </Typography>
          }
        >
          {renderMenuItems(menuData.tab2Items)}
        </List>
      </Box>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet /> {/* ✅ Quan trọng để render route con */}
      </div>
    </AsideLnb>
  );
};
const ManageLayout = () => {
  return (
    <Stack sx={{ direction: "column", height: "100vh" }}>
      <Box
        component="main"
        sx={{ height: "calc(100vh - 48px)" }}
        flexGrow={1}
        bgcolor="var(--bg-green-md)"
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
