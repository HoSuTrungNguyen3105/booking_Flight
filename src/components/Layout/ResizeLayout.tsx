import React, { memo, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
import theme from "../../scss/theme";

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
              pl: 2 + level * 2,
              py: 0.5,
              minHeight: "36px",
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
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  fontSize: `${14 - level}px`,
                  "& .MuiSvgIcon-root": {
                    fontSize: 18,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
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
          py: 1,
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.grey[200]}`,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
        })}
      >
        {menuData.map((section, index) => (
          <List
            key={index}
            dense
            subheader={
              <Typography
                sx={{
                  display: "block",
                  px: 2,
                  py: 0.5,
                  letterSpacing: 0.5,
                  bgcolor: theme.palette.grey[50],
                  borderRadius: 1,
                  mb: 0.5,
                }}
                variant="subtitle2"
              >
                {section.title}
              </Typography>
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
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <Stack
      direction="column"
      sx={{
        transition: "width 200ms",
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "grey.400",
          borderRadius: 2,
        },
      }}
    >
      <Header />
      <Box component="main" sx={{ height: "calc(100vh - 48px)" }} flexGrow={1}>
        <Box display="flex" height="100%">
          <ResizeLayout />
          <Box
            ref={contentRef}
            component="article"
            flexGrow={1}
            p={2}
            bgcolor="grey.50"
            sx={{
              transition: "width 200ms",
              overflow: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                width: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "grey.400",
                borderRadius: 2,
              },
              border: `1px solid`,
              borderColor: "grey.300",
              borderRadius: 1,
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
