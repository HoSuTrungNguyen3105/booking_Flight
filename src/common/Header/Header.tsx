import { forwardRef, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AppsIcon from "@mui/icons-material/Apps";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useSidebar } from "../../context/SidebarContext";
import "./index.scss";
import { Button } from "../Button/Button";
import { useAuth } from "../../context/AuthContext";
import { Language, Login } from "@mui/icons-material";
import { Dropdown } from "../Dropdown/Dropdown";
import type { DropdownOptions } from "../Dropdown/type";
import { Controller, useForm } from "react-hook-form";
import SignOut from "../../components/Auth/SignOut";
export const Header = forwardRef<HTMLElement>((_, ref) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar, setSelectedMenu } = useSidebar();
  const [tabValue, setTabValue] = useState(0);
  // const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  const handleOpenSubMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSubMenu = () => {
    setAnchorEl(null);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  };
  const [lng, setLng] = React.useState<string>("ENG");

  const { control } = useForm({
    defaultValues: {
      language: lng,
    },
  });
  const valueTrans: DropdownOptions[] = [
    { value: "ENG", label: "ENG" },
    { value: "KOR", label: "KOR" },
  ];

  // const{control}= useForm({
  //   defaultValues:lng
  // })
  // const menuMap = [
  //   "1Depth Menu1",
  //   "1Depth Menu2",
  //   "1Depth Menu3",
  //   "1Depth Menu4",
  //   "1Depth Menu3",
  //   "1Depth Menu4",
  // ];
  // setSelectedMenu(menuMap[newValue]);
  const handleChange2 = (event: SelectChangeEvent) => {
    setLng(event.target.value as string);
  };
  const Android12Switch = styled(Switch)(({ theme }) => ({
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
      <Box
        sx={{
          width: "100%",
          padding: 0,
        }}
      >
        <AppBar position="static" className="app-bar">
          <Toolbar>
            <Box sx={{ gap: 10, display: "flex" }}>
              <Box sx={{ display: "flex", width: "30%" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <IconButton
                    size="large"
                    edge="start"
                    className="menu-icon"
                    aria-label="menu"
                    data-testid="button-menu"
                    onClick={toggleSidebar}
                    sx={{
                      mr: 2,
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    fontSize="2.2rem"
                    alignContent="center"
                    sx={{ color: "#135678", ml: 2, mr: "10px", height: "100%" }}
                  >
                    HSTN{" "}
                  </Typography>{" "}
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      height: 40,
                      borderColor: "#ccc",
                      alignSelf: "center",
                    }}
                  />{" "}
                  <Box
                    alignContent="center"
                    sx={{ ml: 1, mr: 1, textAlign: "start", height: "100%" }}
                  >
                    {" "}
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        color: "#135678",
                        fontSize: 18,
                        mt: 1,
                        maxHeight: "fit-content",
                        lineHeight: 1.1,
                      }}
                    >
                      한글시스템명{" "}
                    </Typography>{" "}
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      sx={{ textAlign: "start", mb: 1, lineHeight: 1.1 }}
                    >
                      English System{" "}
                    </Typography>{" "}
                  </Box>{" "}
                </Box>{" "}
              </Box>{" "}
              <Box
                sx={{
                  bgcolor: "background.paper",
                  width: 800,
                  position: "relative",
                }}
                className="height-tab"
              >
                {" "}
                <AppBar position="static" color="default">
                  {" "}
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="action tabs example"
                  >
                    <Tab label="Home" data-testid="Menu1" />
                    <Tab
                      label="Flight Ticket"
                      // onMouseEnter={handleOpenSubMenu}
                      // onMouseLeave={handleCloseSubMenu}
                    />
                    {/* <Tab
                      label="Your carts"
                      onMouseEnter={handleOpenSubMenu}
                      onMouseLeave={handleCloseSubMenu}
                    /> */}
                    <Tab label="Favorites" data-testid="Menu3" />
                    <Tab label="Contact" data-testid="Menu4" />
                    <Tab label="Service" data-testid="Menu5" />
                  </Tabs>{" "}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseSubMenu}
                    MenuListProps={{
                      onMouseEnter: handleOpenSubMenu,
                      onMouseLeave: handleCloseSubMenu,
                    }}
                  >
                    <MenuItem>Vé nội địa</MenuItem>
                    <MenuItem>Vé quốc tế</MenuItem>
                    <MenuItem>Chuyến bay giá rẻ</MenuItem>
                  </Menu>
                </AppBar>{" "}
              </Box>{" "}
              <Box
                sx={{ display: "flex", width: "40%", justifyContent: "end" }}
              >
                {/* <Stack> */}
                {/* <Button
                  size="large"
                  appearance="unfilled"
                  icon={<MoreHorizSharpIcon />}
                  // sx={{ alignItems: "center", mr: 1 }}
                  sx={{
                    // height: "50%",
                    // maxWidth: "50%",
                    display: "flex",
                    // flex: "10px",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                /> */}
                <Stack>
                  <Button
                    sx={{
                      width: 60, // hoặc anh có thể dùng "4rem", tuỳ thích
                      height: 60,
                      minWidth: 60,
                      minHeight: 60,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "#f0f0f0", // tuỳ ý
                    }}
                    priority="normal"
                    iconPosition="trailing" //leading trailing
                    size="small"
                    appearance="unfilled"
                    icon={
                      <MoreHorizSharpIcon
                        sx={{
                          fontSize: "32px", // Tăng kích cỡ icon
                          stroke: "black",
                        }}
                      />
                    }
                  ></Button>
                </Stack>
                <Stack>
                  <Button
                    sx={{
                      width: 60, // hoặc anh có thể dùng "4rem", tuỳ thích
                      height: 60,
                      minWidth: 60,
                      minHeight: 60,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "#f0f0f0", // tuỳ ý
                    }}
                    priority="normal"
                    iconPosition="trailing" //leading trailing
                    size="large"
                    appearance="unfilled"
                    icon={
                      <StarOutlineRoundedIcon
                        sx={{
                          fontSize: "32px", // Tăng kích cỡ icon
                          stroke: "black",
                        }}
                      />
                    }
                  ></Button>
                </Stack>
                <Stack>
                  <Button
                    sx={{
                      width: 60, // hoặc anh có thể dùng "4rem", tuỳ thích
                      height: 60,
                      minWidth: 60,
                      minHeight: 60,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "#f0f0f0", // tuỳ ý
                    }}
                    priority="normal"
                    iconPosition="trailing" //leading trailing
                    size="small"
                    appearance="unfilled"
                    icon={
                      <HelpOutlineRoundedIcon
                        sx={{
                          fontSize: "32px", // Tăng kích cỡ icon
                          stroke: "black",
                        }}
                      />
                    }
                  ></Button>
                </Stack>
                {/* <Button
                  size="large"
                  appearance="unfilled"
                  icon={<HelpOutlineRoundedIcon />}
                  sx={{ textAlign: "center" }}
                /> */}
                {/* <Button
                  // sx={{
                  //   // flex: "10px",
                  //   display: "flex",
                  //   alignItems: "center",
                  // }}
                  sx={{
                    flexShrink: 0,
                    height: "100%",
                    display: "flex",
                    flex: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  priority="normal"
                  size="large"
                  appearance="unfilled"
                  icon={
                    <SettingsRoundedIcon
                      sx={{
                        fontSize: "24px",
                        fill: "none !important",
                        stroke: "black",
                      }}
                    />
                  }
                /> */}
                {/* <Stack sx={{}}>
                  <Button
                    sx={{
                      mr: 1,
                      flex: "10px",
                      display: "flex",
                    }}
                    priority="normal"
                    iconPosition="trailing" //leading trailing
                    size="large"
                    appearance="unfilled"
                    icon={
                      <SettingsRoundedIcon
                        sx={{
                          fontSize: "24px",
                          fill: "none !important",
                          stroke: "black",
                        }}
                      />
                    }
                  ></Button>
                </Stack> */}
                <Stack>
                  <Button
                    sx={{
                      display: "flex",
                      flex: "10px",
                      width: 60, // hoặc anh có thể dùng "4rem", tuỳ thích
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    priority="normal"
                    iconPosition="trailing" //leading trailing
                    size="small"
                    appearance="unfilled"
                    icon={
                      <SettingsRoundedIcon
                        sx={{
                          fontSize: "auto", // Tăng kích cỡ icon
                          stroke: "black",
                        }}
                      />
                    }
                  />
                </Stack>
                {/* </Stack> */}
                {/* <IconButton
                  size="large"
                  edge="start"
                  color="default"
                  aria-label="menu"
                  sx={{ mr: 1 }}
                >
                  <HelpOutlineRoundedIcon />{" "}
                </IconButton>{" "} */}
                {/* <IconButton
                  size="large"
                  edge="start"
                  color="default"
                  aria-label="menu"
                  sx={{ mr: 1 }}
                >
                  {" "}
                  <SettingsRoundedIcon
                    sx={{ fill: "none !important", stroke: "black" }}
                  />
                </IconButton>{" "} */}
                <FormControlLabel
                  control={<Android12Switch defaultChecked />}
                  label=""
                  sx={{ mr: 3 }}
                />{" "}
                <FormControl className="form-control">
                  <InputLabel id="demo-simple-select-label" />
                  {/* <Select
                    className="select"
                    sx={{
                      flex: "10px",
                      display: "flex",
                      "& fieldset": { border: "none" },
                      backgroundColor: "#f7f9f8",
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lng}
                    onChange={handleChange2}
                  >
                    <MenuItem value={"ENG"}>ENG</MenuItem>
                    <MenuItem value={"KOR"}>KOR</MenuItem>
                  </Select> */}
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        customInput={<Language />}
                        sx={{
                          flex: "10px",
                          display: "flex",
                          // maxWidth: "100%",
                          // alignContent: "flex-end",
                          // "& fieldset": { border: "none" },
                          backgroundColor: "#f7f9f8",
                          alignItems: "center",
                        }}
                        options={valueTrans}
                        value={
                          valueTrans.find((opt) => opt.value === field.value) ??
                          (field.value
                            ? { label: field.value, value: field.value }
                            : null)
                        }
                        onChange={(e, selected: any) => {
                          // const newValue =
                          //   selected?.map((item: any) => item.value) || "";
                          const newValue = selected?.label ?? "";
                          field.onChange(newValue);
                          setLng(newValue); // cập nhật state bên ngoài
                        }}
                      />
                    )}
                  />

                  {/* <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <MenuItem value="ENG">English</MenuItem>
                        <MenuItem value="VIE">Tiếng Việt</MenuItem>
                      </Select>
                    )}
                  /> */}
                </FormControl>{" "}
                {isAuthenticated ? (
                  <Stack spacing={1}>
                    <Button
                      sx={{
                        flex: "10px",
                        display: "flex",
                      }}
                      priority="normal"
                      iconPosition="trailing" //leading trailing
                      size="medium"
                      appearance="unfilled" //"unfilled" "unfilledInverse";
                      label={
                        <Box>
                          <Avatar sx={{ mr: 1 }} alt="Remy Sharp" src="" />
                          {user?.userName}
                        </Box>
                      }
                    ></Button>
                    <SignOut />
                    {/* icon={<Avatar sx={{ mr: 2 }} />}
                  {/* <Avatar sx={{ mr: 1 }} alt="Remy Sharp" src="" />
                    {/* {user ? user?.userName : <Login/>} 
                    홍길동 */}
                  </Stack>
                ) : (
                  <Stack>
                    <Button
                      sx={{
                        flex: "10px",
                        display: "flex",
                      }}
                      priority="normal"
                      iconPosition="trailing" //leading trailing
                      size="medium"
                      appearance="unfilled"
                      icon={<Login />}
                      label="Login"
                    ></Button>
                  </Stack>
                )}
                <IconButton
                  size="large"
                  edge="start"
                  color="default"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <AppsIcon />{" "}
                </IconButton>{" "}
              </Box>{" "}
            </Box>{" "}
          </Toolbar>{" "}
        </AppBar>{" "}
      </Box>{" "}
    </AppBar>
  );
});
