import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AdminPanelSettings,
  FlightClassSharp,
  HomeRepairServiceOutlined,
  SearchOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Button } from "../../common/Button/Button";
import ContentModal from "../../common/Modal/ContentModal";

const SidebarAdmin = () => {
  const location = useLocation();
  const drawerWidth = 200;
  const { isAuthenticated, user, logout } = useAuth();
  const adminPath = "/admin";
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const menuItems = [
    { text: "Admin Page", icon: <AdminPanelSettings />, path: `${adminPath}` },
    {
      text: "Search Flight",
      icon: <SearchOff />,
      path: `${adminPath}/sampleFormDemo`,
    },
    {
      text: "Create Flight",
      icon: <FlightClassSharp />,
      path: `${adminPath}/createFlight`,
    },
    { text: "Home", icon: <HomeRepairServiceOutlined />, path: "/" },
  ];
  const [isLogout, setIsLogout] = useState(false);
  const handleConfirmLogout = async () => {
    if (isLogout) return;
    setIsLogout(true);
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error("Log out failed:", error);
    } finally {
      setIsLogout(false);
    }
  };
  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 1,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Link to="/">
            <Avatar
              alt={user?.email}
              src=""
              sx={{ width: "50%", height: "50%", mb: 1 }}
            />
          </Link>
          <Typography variant="subtitle1">Remember:{user?.remember}</Typography>
          <Button size="large" label="Logout" onClick={handleOpen} />
          <ContentModal
            open={open}
            closeLabel="Cancel"
            submitLabel="Confirm log out"
            handleClose={handleClose}
            handleSubmit={handleConfirmLogout}
            contentArea={
              <Typography>Are you sure you want to log out?</Typography>
            }
          />
        </Box>
        <List sx={{ width: "100%" }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              title={item.text}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e0f7fa",
                  "&:hover": {
                    backgroundColor: "#b2ebf2",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
export default SidebarAdmin;
