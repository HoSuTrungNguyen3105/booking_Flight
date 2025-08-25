import { forwardRef, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocalAirportSharpIcon from "@mui/icons-material/LocalAirportSharp";
import { Divider, FormControlLabel, Tab, Tabs } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useSidebar } from "../../context/SidebarContext";
import "./index.scss";
import { Button } from "../Button/Button";
import { useAuth } from "../../context/AuthContext";
import { Login } from "@mui/icons-material";
import SignOut from "../../components/Auth/SignOut";
import { PlainSwitch } from "../Switch/PlainSwitch";
import { Link, useNavigate } from "react-router-dom";
import { LanguageDropdown } from "../Dropdown/Changelng";
import { ImageThumbnail } from "../Profile/ImageThumbnail";
import UserInfo from "../../svgs/eye.png";
import { useGetUserById } from "../../components/Api/useGetApi";
export const Header = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>(
  (props, ref) => {
    const { isAuthenticated } = useAuth();
    const { toggleSidebar, setSelectedMenu } = useSidebar();
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const handleOpenProfile = async () => {
      navigate("/admin");
    };
    const menuMap = ["1Depth Menu1", "1Depth Menu2", "1Depth Menu3"];
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      event.stopPropagation();
      setTabValue(newValue);
      setSelectedMenu(menuMap[newValue]);
    };
    const { user } = useAuth();
    // const { refetchUserById } = useGetUserById();

    return (
      <AppBar
        className="header"
        ref={ref}
        position="static"
        sx={{
          background: "transparent",
          boxShadow: "none",
          position: "relative",
        }}
      >
        {/* Nền Gradient + Bóng Tròn */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "10%",
              left: "10%",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              animation: "float 6s ease-in-out infinite",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "60%",
              right: "15%",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              animation: "float 8s ease-in-out infinite reverse",
            },
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Toolbar sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 10,
            }}
          >
            {/* Logo + Menu */}
            <Box sx={{ display: "flex", width: "30%", alignItems: "center" }}>
              <IconButton
                size="large"
                edge="start"
                onClick={toggleSidebar}
                sx={{ mr: 2, color: "white" }}
              >
                <LocalAirportSharpIcon />
              </IconButton>
              <Typography
                fontWeight="bold"
                fontSize="2.2rem"
                sx={{
                  ml: 2,
                  cursor: "pointer",
                  background: "linear-gradient(45deg, #fff 30%, #f0f8ff 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                HSTN
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  height: 40,
                  borderColor: "rgba(255,255,255,0.5)",
                  mx: 2,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                  px: 2,
                  height: 40,
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{
                    color: "white",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  한글시스템명
                </Typography>
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="secondary"
                variant="fullWidth"
              >
                {menuMap.map((menu, index) => (
                  <Tab key={index} label={menu} sx={{ color: "white" }} />
                ))}
              </Tabs>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "40%",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <FormControlLabel
                control={<PlainSwitch defaultChecked />}
                label=""
              />
              <LanguageDropdown />
              {isAuthenticated ? (
                <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                  <Button
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                    onClick={handleOpenProfile}
                    iconPosition="trailing"
                    size="large"
                    appearance="contained"
                    icon={<ImageThumbnail url={UserInfo} />}
                    label={user?.name}
                  />
                  <SignOut />
                </Box>
              ) : (
                <Link to="/init/loginPage">
                  <Button
                    size="small"
                    icon={<Login />}
                    label="Login"
                    sx={{ color: "white" }}
                  />
                </Link>
              )}
              <Button
                size="medium"
                icon={<AppsIcon />}
                sx={{ color: "white" }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
);
