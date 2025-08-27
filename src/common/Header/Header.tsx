import { forwardRef, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocalAirportSharpIcon from "@mui/icons-material/LocalAirportSharp";
import { Divider, FormControlLabel } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import "./index.scss";
import { Button } from "../Button/Button";
import { useAuth } from "../../context/AuthContext";
import { Login } from "@mui/icons-material";
import SignOut from "../../components/Auth/SignOut";
import { PlainSwitch } from "../Switch/PlainSwitch";
import { Link, useNavigate } from "react-router-dom";
import { LanguageDropdown } from "../Dropdown/Changelng";
import TabPanel, { type ITabItem } from "../Setting/TabPanel";

export const Header = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>(
  (props, ref) => {
    const { isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const { user } = useAuth();
    // const { toggleSidebar, setSelectedMenu } = useSidebar();
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const handleOpenProfile = async () => {
      navigate("/admin");
    };

    // const menuMap = ["1Depth Menu1", "1Depth Menu2", "1Depth Menu3"];
    const menuMap: ITabItem[] = [
      { value: "menu1", label: "1Depth Menu1", path: "/profile" },
      { value: "menu2", label: "1Depth Menu2", path: "/setting" },
      { value: "menu3", label: "1Depth Menu3", path: "/setting" },
    ];

    return (
      <AppBar
        position="static"
        color="transparent"
        elevation={2}
        sx={{
          px: 4,
          py: 2,
          bgcolor: "rgba(25, 118, 210, 0.85)", // xanh dương trong suốt
          backdropFilter: "blur(10px)",
          // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo & System Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton size="large" sx={{ color: "white" }}>
              <LocalAirportSharpIcon sx={{ height: "46px", width: "46px" }} />
            </IconButton>
            <Typography
              fontWeight="bold"
              fontSize="2rem"
              sx={{ cursor: "pointer", color: "white" }}
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
              <Typography
                fontWeight="bold"
                color="white"
                sx={{ whiteSpace: "nowrap" }}
              >
                한글시스템명
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TabPanel
              activeTab={tabValue}
              tabs={menuMap}
              onChangeTab={setTabValue}
              sx={{
                "& .MuiTabs-root": {
                  minHeight: 48,
                  bgcolor: "rgba(25, 118, 210, 0.85)", // xanh dương trong suốt
                },
              }}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={<PlainSwitch defaultChecked />}
              label=""
              sx={{ color: "white" }}
            />
            <LanguageDropdown />
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  onClick={handleOpenProfile}
                  size="medium"
                  appearance="unfilled"
                  label={user?.email}
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
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
            <Button size="large" icon={<AppsIcon />} sx={{ color: "white" }} />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
);
