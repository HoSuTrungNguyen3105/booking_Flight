// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocalAirportSharpIcon from "@mui/icons-material/LocalAirportSharp";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SignOut from "../../components/Auth/SignOut";
import { Link, useNavigate } from "react-router-dom";
import { GridMenuIcon } from "@mui/x-data-grid";
import CustomPopover from "../Button/Popover";
import { AccountCircle, Login } from "@mui/icons-material";
import LanguageButton from "../../components/Common/ChangeLanguageSelect";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

export const Header = () => {
  const [time, setTime] = useState(new Date());
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const now = time.toLocaleTimeString();
  const today = time.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    setUsername(user?.name ?? null);
  }, []);

  const drawer = useCallback(
    () => (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          HSTN
        </Typography>
        {/* <List>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Box>
    ),
    []
  );

  const handleOpenProfile = () => {
    navigate("/admin");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
          px: { xs: 2, md: 4 },
          py: 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {/* Left section - Logo and System Name */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="large" sx={{ color: theme.palette.primary.main }}>
              <LocalAirportSharpIcon sx={{ height: 40, width: 40 }} />
            </IconButton>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="black"
              sx={{ cursor: "pointer" }}
            >
              HSTN
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                bgcolor: theme.palette.primary.light,
              }}
            >
              <Typography
                fontWeight="bold"
                color={theme.palette.primary.dark}
                variant="caption"
                noWrap
              >
                {t("system_name")}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: { xs: "4px", sm: "6px" },
              }}
            >
              <LanguageButton />
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            {isMobile ? (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <GridMenuIcon />
              </IconButton>
            ) : null}

            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 2 }}
              sx={{ p: { xs: "2px 4px", sm: "4px 8px" } }}
            >
              {isAuthenticated ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CustomPopover
                    icon={<AccountCircle sx={{ fontSize: 20 }} />}
                    text="Profile"
                    option={["Dashboard"]}
                    handleAction={handleOpenProfile}
                    hideSubmitButton
                  />

                  {/* <ImageThumbnail
                    url={ImageThumbnailIcon}
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      borderRadius: "50%",
                    }}
                  /> */}

                  <SignOut />
                </Stack>
              ) : (
                <Button
                  component={Link}
                  to="/init/loginPage"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    borderRadius: "20px",
                    px: { xs: 1.5, sm: 2 },
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <Login sx={{ fontSize: 16, mr: { xs: 0, sm: 0.5 } }} />
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Login
                  </Typography>
                </Button>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer()}
      </Drawer>
    </>
  );
};
