// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SignOut from "../../components/Common/SignOut";
import { Link, useNavigate } from "react-router-dom";
import { GridMenuIcon } from "@mui/x-data-grid";
import { Login } from "@mui/icons-material";
import LanguageButton from "../../components/Common/HeaderOptionSelect";
import { useCallback, useState } from "react";
import theme from "../../scss/theme";
import ButtonLink from "../AdditionalCustomFC/ButtonLink";

export const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { value: "contact", label: "Contact us" },
    { value: "profile", label: "Profile" },
    { value: "flight/info-page", label: "flpage" },
    { value: "admin", label: "Admin dashboard" },
    { value: "hotels", label: " hotels" },
    { value: "flight/deals", label: " deals" },
  ];

  const handleNavigate = useCallback((value: string) => {
    navigate(value);
  }, []);

  const drawer = useCallback(
    () => (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          HSTN
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    []
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          margin: " 0 auto",
          padding: "0 20px",
          maxWidth: "1700px",
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
            <IconButton
              onClick={() => navigate("/")}
              size="large"
              sx={{
                width: "100px",
                whiteSpace: "nowrap",
                color: theme.palette.primary.main,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                <path d="M 9 16 C 6.8026661 16 5 17.802666 5 20 L 5 60 C 5 62.197334 6.8026661 64 9 64 L 51 64 C 52.210938 64 53.264444 63.423754 54 62.564453 C 54.735556 63.423754 55.789062 64 57 64 L 71 64 C 73.197334 64 75 62.197334 75 60 L 75 20 C 75 17.802666 73.197334 16 71 16 L 57 16 C 55.789062 16 54.735556 16.576246 54 17.435547 C 53.264444 16.576246 52.210938 16 51 16 L 9 16 z M 9 18 L 51 18 C 52.116666 18 53 18.883334 53 20 A 1 1 0 0 0 54 21 A 1 1 0 0 0 55 20 C 55 18.883334 55.883334 18 57 18 L 71 18 C 72.116666 18 73 18.883334 73 20 L 73 60 C 73 61.116666 72.116666 62 71 62 L 57 62 C 55.883334 62 55 61.116666 55 60 A 1 1 0 0 0 54 59 A 1 1 0 0 0 53 60 C 53 61.116666 52.116666 62 51 62 L 9 62 C 7.8833339 62 7 61.116666 7 60 L 7 20 C 7 18.883334 7.8833339 18 9 18 z M 54 23 A 1 1 0 0 0 53 24 A 1 1 0 0 0 54 25 A 1 1 0 0 0 55 24 A 1 1 0 0 0 54 23 z M 54 27 A 1 1 0 0 0 53 28 A 1 1 0 0 0 54 29 A 1 1 0 0 0 55 28 A 1 1 0 0 0 54 27 z M 15 31 A 1.0001 1.0001 0 1 0 15 33 L 32 33 A 1.0001 1.0001 0 1 0 32 31 L 15 31 z M 39 31 A 1.0001 1.0001 0 1 0 39 33 L 44 33 A 1.0001 1.0001 0 1 0 44 31 L 39 31 z M 54 31 A 1 1 0 0 0 53 32 A 1 1 0 0 0 54 33 A 1 1 0 0 0 55 32 A 1 1 0 0 0 54 31 z M 60 31 A 1.0001 1.0001 0 1 0 60 33 L 68 33 A 1.0001 1.0001 0 1 0 68 31 L 60 31 z M 54 35 A 1 1 0 0 0 53 36 A 1 1 0 0 0 54 37 A 1 1 0 0 0 55 36 A 1 1 0 0 0 54 35 z M 15 39 A 1.0001 1.0001 0 1 0 15 41 L 38 41 A 1.0001 1.0001 0 1 0 38 39 L 15 39 z M 54 39 A 1 1 0 0 0 53 40 A 1 1 0 0 0 54 41 A 1 1 0 0 0 55 40 A 1 1 0 0 0 54 39 z M 60 39 A 1.0001 1.0001 0 1 0 60 41 L 65 41 A 1.0001 1.0001 0 1 0 65 39 L 60 39 z M 54 43 A 1 1 0 0 0 53 44 A 1 1 0 0 0 54 45 A 1 1 0 0 0 55 44 A 1 1 0 0 0 54 43 z M 15 47 A 1.0001 1.0001 0 1 0 15 49 L 32 49 A 1.0001 1.0001 0 1 0 32 47 L 15 47 z M 39 47 A 1.0001 1.0001 0 1 0 39 49 L 44 49 A 1.0001 1.0001 0 1 0 44 47 L 39 47 z M 54 47 A 1 1 0 0 0 53 48 A 1 1 0 0 0 54 49 A 1 1 0 0 0 55 48 A 1 1 0 0 0 54 47 z M 60 47 A 1.0001 1.0001 0 1 0 60 49 L 68 49 A 1.0001 1.0001 0 1 0 68 47 L 60 47 z M 54 51 A 1 1 0 0 0 53 52 A 1 1 0 0 0 54 53 A 1 1 0 0 0 55 52 A 1 1 0 0 0 54 51 z M 54 55 A 1 1 0 0 0 53 56 A 1 1 0 0 0 54 57 A 1 1 0 0 0 55 56 A 1 1 0 0 0 54 55 z" />
              </svg>
            </IconButton>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="black"
              sx={{ cursor: "pointer" }}
            >
              HSTN
            </Typography>
          </Stack>

          {/* <Switch /> */}

          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <GridMenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              display: "flex",
              alignItems: "start",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {navItems
              .filter((item) => {
                if (isAdmin) {
                  return item.value.includes("admin");
                } else {
                  return (
                    item.value === "profile" || !item.value.includes("admin")
                  );
                }
              })
              .map((e, i) => (
                <ButtonLink
                  key={i}
                  url={e.value}
                  text={e.label}
                  variant="text"
                />
              ))}
          </Box>
          {isAuthenticated ? (
            <Stack
              direction="row-reverse"
              alignItems="center"
              spacing={1}
              sx={{
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  padding: { xs: "4px", sm: "6px" },
                }}
              >
                <LanguageButton />
              </Box>
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
