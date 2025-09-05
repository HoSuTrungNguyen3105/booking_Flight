import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocalAirportSharpIcon from "@mui/icons-material/LocalAirportSharp";
import {
  Button,
  Drawer,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SignOut from "../../components/Auth/SignOut";
import ImageThumbnailIcon from "../../svgs/account-avatar-profile-user-11.svg";
import { Link, useNavigate } from "react-router-dom";
import { LanguageButton } from "../Dropdown/Changelng";
import { GridMenuIcon, GridSearchIcon } from "@mui/x-data-grid";
import { ImageThumbnail } from "../Profile/ImageThumbnail";

export const Header = () => {
  const navItems = ["About", "Tour", "Package", "Contact"];
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = React.useCallback(
    () => (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          HSTN
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
                한글시스템명
              </Typography>
            </Box>
          </Stack>

          {/* Middle section - Navigation links and Search (visible on desktop) */}
          {!isMobile && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              flexGrow={1}
              justifyContent="center"
            >
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      color: theme.palette.primary.main,
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Stack>
          )}

          {/* Right section - Actions and Login */}
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
            ) : (
              <Button
                variant="contained"
                sx={{
                  borderRadius: "25px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Book a Trip
              </Button>
            )}

            <Stack direction="row" alignItems="center" spacing={1}>
              <LanguageButton />
              {isAuthenticated ? (
                <Stack direction="row" alignItems="center">
                  <ImageThumbnail url={ImageThumbnailIcon} />
                  <Button
                    onClick={handleOpenProfile}
                    sx={{
                      color: theme.palette.text.primary,
                      textTransform: "none",
                    }}
                  >
                    {user?.email}
                  </Button>
                  <SignOut />
                </Stack>
              ) : (
                <Link to="/init/loginPage">
                  <Button
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Login
                  </Button>
                </Link>
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
