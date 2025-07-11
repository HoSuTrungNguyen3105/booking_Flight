import { forwardRef, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, FormControlLabel, Tab, Tabs } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AppsIcon from "@mui/icons-material/Apps";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useSidebar } from "../../context/SidebarContext";
import "./index.scss";
import { Button } from "../Button/Button";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowDownward,
  ArrowUpward,
  Language,
  Login,
} from "@mui/icons-material";
import { Dropdown } from "../Dropdown/Dropdown";
import type { DropdownOptions } from "../Dropdown/type";
import { Controller, useForm } from "react-hook-form";
import SignOut from "../../components/Auth/SignOut";
import { useTranslation } from "react-i18next";
import { PlainSwitch } from "../Switch/PlainSwitch";
import { Link, useNavigate } from "react-router-dom";

export const Header = forwardRef<HTMLElement>((_, ref) => {
  const { isAuthenticated } = useAuth();
  const { toggleSidebar, setSelectedMenu } = useSidebar();
  const [tabValue, setTabValue] = useState(0);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpenProfile = async () => {
    // const result = await loginAPI();
    // if (result.success) {
    navigate("/profile");
    //}
  };
  // const handleChange = (event: SelectChangeEvent) => {
  //   setValue(event.target.value);
  // };

  const IconComponent = () => (open ? <ArrowUpward /> : <ArrowDownward />);
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // 'en', 'jp', 'kr', v.v.
  };
  const menuMap = [
    "1Depth Menu1",
    "1Depth Menu2",
    "1Depth Menu3",
    "1Depth Menu4",
    "1Depth Menu5",
  ];
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
    setSelectedMenu(menuMap[newValue]);
  };
  const [lng, setLng] = React.useState<string>(() => {
    return localStorage.getItem("language") || "en";
  });

  React.useEffect(() => {
    localStorage.setItem("language", lng);
  }, [lng]);

  const {
    control,
    setValue: setValueLang,
    watch: watchLang,
  } = useForm<{ language: string }>({
    defaultValues: {
      language: lng,
    },
  });
  const selectedLang = watchLang("language");

  const valueTrans: DropdownOptions[] = [
    { value: "en", label: "English" },
    { value: "kr", label: "Korean" },
    { value: "jp", label: "Japan" },
  ];

  const Android12Switch = styled(Switch)(() => ({
    padding: 8,
    width: 65,
    height: 44,
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "lightgrey !important",
      opacity: 1.8,
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#ffffff !important",
    },
    "& .MuiSwitch-track": {
      borderRadius: 22 / 1,
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 18,
        height: 18,
      },
      "&::before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18.5" width="18.5" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#000"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        left: 12,
        top: 22,
      },
      "&::after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18.5" width="18.5" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        right: 14,
        top: 21,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 21,
      height: 21,
      margin: 2,
      marginLeft: 3,
      marginTop: 2.2,
    },
  }));
  return (
    <AppBar className="header" data-testid="headerTest" ref={ref}>
      {/* Outer container for full width and padding */}
      <Box sx={{ width: "100%", padding: 0 }}>
        {/* Main AppBar container */}
        <AppBar position="static" className="app-bar">
          <Toolbar>
            {/* Main flex container for all sections */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              {/* Left section: Menu and Logo */}
              <Box sx={{ display: "flex", width: "30%", alignItems: "center" }}>
                {/* Menu Icon */}
                <IconButton
                  size="large"
                  edge="start"
                  className="menu-icon"
                  aria-label="menu"
                  data-testid="button-menu"
                  onClick={toggleSidebar}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>

                {/* Logo and System Name */}
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

              {/* Middle section: Tabs */}
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
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="action tabs"
                  >
                    {menuMap.map((menu, index) => (
                      <Tab key={index} label={menu} />
                    ))}
                  </Tabs>
                </AppBar>
              </Box>

              {/* Right section: icons, language, user actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "40%",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                {/* Utility icons */}
                <IconButton className="icon-button">
                  <HelpOutlineRoundedIcon />
                </IconButton>
                <IconButton className="icon-button">
                  <MoreHorizSharpIcon />
                </IconButton>
                <IconButton className="icon-button">
                  <StarOutlineRoundedIcon />
                </IconButton>
                <IconButton className="icon-button">
                  <SettingsRoundedIcon />
                </IconButton>
                <FormControlLabel
                  control={<PlainSwitch defaultChecked />}
                  label=""
                  sx={{ mr: 2 }}
                />
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      label="Language"
                      customInput={<Language />}
                      sx={{
                        display: "flex",
                        minWidth: 80,
                        maxWidth: 90,
                      }}
                      size="medium" // hoặc "small"
                      options={valueTrans}
                      value={
                        valueTrans.find((opt) => opt.label === field.value) ??
                        (field.value
                          ? { label: field.value, value: field.value }
                          : null)
                      }
                      onChange={(e, selected: any) => {
                        const newVal = selected?.value ?? "";
                        field.onChange(newVal);
                        setLng(newVal);
                        handleChangeLanguage(newVal);
                      }}
                    />
                  )}
                />
                {isAuthenticated ? (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <Button
                      sx={{ display: "flex", alignItems: "center" }}
                      priority="normal"
                      onClick={handleOpenProfile}
                      iconPosition="trailing"
                      size="medium"
                      appearance="unfilled"
                      label={<Avatar sx={{ mr: 1 }} alt="User" src="" />}
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

  //   return (
  //     <AppBar className="header" data-testid="headerTest" ref={ref}>
  //       <Box
  //         sx={{
  //           width: "100%",
  //           padding: 0,
  //         }}
  //       >
  //         <AppBar position="static" className="app-bar">
  //           <Toolbar>
  //             <Box sx={{ gap: 10, display: "flex" }}>
  //               <Box sx={{ display: "flex", width: "30%" }}>
  //                 <Box sx={{ display: "flex", flexDirection: "column" }}>
  //                   <IconButton
  //                     size="large"
  //                     edge="start"
  //                     className="menu-icon"
  //                     aria-label="menu"
  //                     data-testid="button-menu"
  //                     onClick={toggleSidebar}
  //                     sx={{
  //                       mr: 2,
  //                     }}
  //                   >
  //                     <MenuIcon />
  //                   </IconButton>
  //                 </Box>
  //                 <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
  //                   <Typography
  //                     // variant="h6"
  //                     fontWeight="bold"
  //                     fontSize="2.2rem"
  //                     alignContent="center"
  //                     sx={{
  //                       color: "#135678",
  //                       ml: 2,
  //                       mr: "10px",
  //                       height: "100%",
  //                       cursor: "pointer", // hoặc 'pointer', 'default'... tùy bạn thích
  //                     }}
  //                   >
  //                     HSTN
  //                   </Typography>
  //                   <Divider
  //                     orientation="vertical"
  //                     flexItem
  //                     sx={{
  //                       height: 40,
  //                       borderColor: "#ccc",
  //                       alignSelf: "center",
  //                     }}
  //                   />{" "}
  //                   <Box
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       ml: 1,
  //                       mr: 1,
  //                       textAlign: "start",
  //                       height: "100%",
  //                       borderRadius: 2,
  //                       bgcolor: "grey.100",
  //                     }}
  //                   >
  //                     {" "}
  //                     <Typography
  //                       // variant="body2"
  //                       fontWeight="bold"
  //                       sx={{
  //                         color: "#135678",
  //                         whiteSpace: "nowrap",
  //                         cursor: "pointer",
  //                       }}
  //                     >
  //                       한글시스템명
  //                     </Typography>
  //                   </Box>{" "}
  //                 </Box>{" "}
  //               </Box>{" "}
  //               <Box
  //                 sx={{
  //                   bgcolor: "background.paper",
  //                   width: 800,
  //                   position: "relative",
  //                 }}
  //                 className="height-tab"
  //               >
  //                 <AppBar position="static" color="default">
  //                   <Tabs
  //                     value={tabValue}
  //                     onChange={handleTabChange}
  //                     indicatorColor="primary"
  //                     textColor="primary"
  //                     variant="fullWidth"
  //                     aria-label="action tabs example"
  //                   >
  //                     {menuMap.map((menu, index) => {
  //                       return <Tab key={index} label={menu} />;
  //                     })}
  //                   </Tabs>
  //                 </AppBar>
  //               </Box>
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   width: "40%",
  //                   justifyContent: "end",
  //                 }}
  //               >
  //                 <IconButton className="icon-button">
  //                   <HelpOutlineRoundedIcon />
  //                 </IconButton>
  //                 <IconButton className="icon-button">
  //                   <MoreHorizSharpIcon />
  //                 </IconButton>
  //                 <IconButton className="icon-button">
  //                   <StarOutlineRoundedIcon />
  //                 </IconButton>
  //                 <IconButton className="icon-button">
  //                   <SettingsRoundedIcon />
  //                 </IconButton>
  //                 <FormControlLabel
  //                   control={
  //                     // <IconButton className="icon-button">
  //                     <Android12Switch defaultChecked />
  //                     // </IconButton>
  //                   }
  //                   label=""
  //                   sx={{ mr: "5px" }}
  //                 />
  //                 <FormControlLabel
  //                   control={
  //                     // <IconButton className="icon-button">
  //                     <PlainSwitch defaultChecked />
  //                     // </IconButton>
  //                   }
  //                   label=""
  //                   sx={{ mr: "5px" }}
  //                 />
  //                 <Controller
  //                   name="language"
  //                   control={control}
  //                   render={({ field }) => (
  //                     <Dropdown
  //                       customInput={<Language />}
  //                       sx={{
  //                         display: "flex",
  //                         minWidth: 80,
  //                         maxWidth: 90,
  //                       }}
  //                       options={valueTrans}
  //                       value={
  //                         valueTrans.find((opt) => opt.label === field.value) ??
  //                         (field.value
  //                           ? { label: field.value, value: field.value }
  //                           : null)
  //                       }
  //                       onChange={(e, selected: any) => {
  //                         const newValue = selected?.value ?? "";
  //                         field.onChange(newValue);
  //                         setLng(newValue);
  //                         handleChangeLanguage(newValue);
  //                       }}
  //                     />
  //                   )}
  //                 />
  //                 {isAuthenticated ? (
  //                   <Box>
  //                     <Button
  //                       sx={{
  //                         flex: "10px",
  //                         display: "flex",
  //                       }}
  //                       priority="normal"
  //                       iconPosition="trailing" //leading trailing
  //                       size="medium"
  //                       appearance="unfilled" //"unfilled" "unfilledInverse";
  //                       label={
  //                         <Box>
  //                           <Avatar sx={{ mr: 1 }} alt="Remy Sharp" src="" />
  //                           {user?.userName}
  //                         </Box>
  //                       }
  //                     />
  //                     <SignOut />
  //                   </Box>
  //                 ) : (
  //                   <Stack>
  //                     <Button
  //                       priority="normal"
  //                       iconPosition="trailing" //leading trailing
  //                       size="small"
  //                       appearance="unfilled"
  //                       icon={<Login />}
  //                       label="Login"
  //                     />
  //                   </Stack>
  //                 )}
  //                 <Stack>
  //                   <Button
  //                     size="medium"
  //                     icon={<AppsIcon />}
  //                     priority="normal"
  //                     // iconPosition="leading" //leading trailing
  //                     appearance="unfilled"
  //                     sx={{ mr: 2 }}
  //                   />
  //                 </Stack>
  //               </Box>
  //             </Box>
  //           </Toolbar>
  //         </AppBar>
  //       </Box>
  //     </AppBar>
  //   );
});
