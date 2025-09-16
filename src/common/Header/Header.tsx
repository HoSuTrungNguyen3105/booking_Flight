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
import ImageThumbnailIcon from "../../svgs/account-avatar-profile-user-11.svg";
import { Link, useNavigate } from "react-router-dom";
import { LanguageButton } from "../Dropdown/Changelng";
import { GridMenuIcon } from "@mui/x-data-grid";
import { ImageThumbnail } from "../Profile/ImageThumbnail";
import CustomPopover from "../Button/Popover";
import { Login } from "@mui/icons-material";

export const Header = () => {
  const navItems = ["About", "Package", "Contact"];
  const { isAuthenticated } = useAuth();
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
            ) : null}

            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 2 }}
              sx={{
                padding: { xs: "2px 4px", sm: "4px 8px" },
                borderRadius: "8px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              }}
            >
              <Box
                sx={{
                  padding: { xs: "4px", sm: "6px" },
                  borderRadius: "6px",
                  display: { xs: "none", sm: "block" },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <LanguageButton />
              </Box>

              {isAuthenticated ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CustomPopover
                    icon="Profile"
                    option={["Dashboard"]}
                    handleAction={handleOpenProfile}
                  />
                  <ImageThumbnail
                    url={ImageThumbnailIcon}
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      borderRadius: "50%",
                    }}
                  />
                  <SignOut />
                </Stack>
              ) : (
                <Link to="/init/loginPage" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      borderRadius: "20px",
                      padding: { xs: "4px 12px", sm: "6px 16px" },
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <Login sx={{ fontSize: 16, mr: { xs: 0, sm: 0.5 } }} />
                    <Box
                      component="span"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      Login
                    </Box>
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
