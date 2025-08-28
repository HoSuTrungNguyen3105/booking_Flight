import { forwardRef, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocalAirportSharpIcon from "@mui/icons-material/LocalAirportSharp";
import { Button, Divider, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SignOut from "../../components/Auth/SignOut";
import { PlainSwitch } from "../Switch/PlainSwitch";
import { Link, useNavigate } from "react-router-dom";
import { LanguageDropdown } from "../Dropdown/Changelng";

export const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleOpenProfile = () => {
    navigate("/admin");
  };

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        bgcolor: "rgba(25, 118, 210, 0.9)",
        px: { xs: 2, md: 4 },
        py: 1.5,
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton size="large" sx={{ color: "white" }}>
            <LocalAirportSharpIcon sx={{ height: 46, width: 46 }} />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "white", cursor: "pointer" }}
          >
            HSTN
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "white" }}
          />
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.2)",
            }}
          >
            <Typography fontWeight="bold" color="white" noWrap>
              한글시스템명
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          justifyContent="center"
        >
          {["About", "Tour", "Package", "Contact"].map((item) => (
            <Button
              key={item}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {item}
            </Button>
          ))}
          <Button
            variant="contained"
            color="secondary"
            sx={{
              ml: 2,
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Book Trip
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LanguageDropdown />
          <PlainSwitch defaultChecked />
          {isAuthenticated ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                onClick={handleOpenProfile}
                sx={{
                  color: "white",
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                {user?.email}
              </Button>
              <SignOut />
            </Stack>
          ) : (
            <Link to="/init/loginPage">
              <Button size="small" sx={{ color: "white" }}>
                Login
              </Button>
            </Link>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
