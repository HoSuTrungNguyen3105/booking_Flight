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
      <AppBar className="header" ref={ref}>
        <Box sx={{ width: "100%", padding: 0 }}>
          <AppBar position="static" className="app-bar">
            <Toolbar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 10,
                }}
              >
                <Box
                  sx={{ display: "flex", width: "30%", alignItems: "center" }}
                >
                  <IconButton
                    size="large"
                    edge="start"
                    className="menu-icon"
                    onClick={toggleSidebar}
                    sx={{ mr: 2 }}
                  >
                    <LocalAirportSharpIcon />
                  </IconButton>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      fontWeight="bold"
                      fontSize="2.2rem"
                      sx={{
                        color: "#135678",
                        ml: 2,
                        cursor: "pointer",
                      }}
                    >
                      HSTN
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        height: 40,
                        borderColor: "#ccc",
                        mx: 2,
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        px: 2,
                        height: 40,
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: "#135678",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        한글시스템명
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    maxWidth: 800,
                    position: "relative",
                  }}
                  className="height-tab"
                >
                  <AppBar position="static" color="default" elevation={0}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      textColor="primary"
                      variant="fullWidth"
                    >
                      {menuMap.map((menu, index) => (
                        <Tab key={index} label={menu} />
                      ))}
                    </Tabs>
                  </AppBar>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "40%",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  {/* <IconButton className="icon-button">
                    <HelpOutlineRoundedIcon />
                  </IconButton> */}
                  {/* <IconButton className="icon-button">
                    <MoreHorizSharpIcon />
                  </IconButton> */}
                  {/* <IconButton className="icon-button">
                    <StarOutlineRoundedIcon />
                  </IconButton> */}
                  {/* <IconButton className="icon-button">
                    <SettingsRoundedIcon />
                  </IconButton> */}
                  <FormControlLabel
                    control={<PlainSwitch defaultChecked />}
                    label=""
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <LanguageDropdown />
                  </Box>
                  {isAuthenticated ? (
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <Button
                        sx={{ display: "flex", alignItems: "center" }}
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
                    <Link to="/login">
                      <Button
                        priority="normal"
                        size="small"
                        appearance="unfilled"
                        icon={<Login />}
                        label="Login"
                      />
                    </Link>
                  )}
                  <Button
                    size="medium"
                    icon={<AppsIcon />}
                    priority="normal"
                    appearance="unfilled"
                  />
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      </AppBar>
    );
  }
);
