import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material";
import Logo from "../../svgs/logo-github.svg";
import UserIcon from "../../svgs/user-icon.svg";
import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTE_PATHS } from "../../routers/RoutePath";
import theme from "../../scss/theme";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";
import { LanguageDropdown } from "../Dropdown/Changelng";
import RadioUI from "../Radio/RadioUI";

const Header = () => {
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const [jobCode, setJobCode] = useState<string>("");
  // const [jobCodeOptions, setJobCodeOptions] = useState<DropdownOption[]>([]);

  const jobCodeOptions: ActionType[] = [
    {
      label: "Trang chủ",
      value: "",
    },
    {
      label: "Khách hàng",
      value: "flightmeals",
    },
    {
      label: "Báo cáo",
      value: "notifications",
    },
  ];

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClickProfile = useCallback(() => {
    handleClose();
    if (isAdmin) {
      navigate(ROUTE_PATHS.HOME);
    } else {
      navigate(ROUTE_PATHS.ADMIN);
    }
  }, [handleClose, navigate, isAdmin]);

  const handleChangeJobCodeList = useCallback(
    (value: string) => {
      setJobCode(value);
      navigate(value);
    },
    [navigate]
  );

  const renderUserMenu = useCallback(() => {
    // if (!user) return null;

    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
      >
        <Stack direction="column" spacing={3} sx={{ pt: 2, pb: 2 }}>
          <LanguageDropdown />
        </Stack>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={handleClick}
          gap={1}
          sx={{ cursor: "pointer" }}
        >
          <Box
            sx={{ height: "24px", width: "24px" }}
            component="img"
            src={UserIcon}
            alt="Avatar"
          />
          <Typography variant="subtitle1" color={theme.palette.grey[500]}>
            {user?.email}
          </Typography>
        </Box>
        <Menu
          slotProps={{
            paper: {
              sx: {
                width: anchorEl?.offsetWidth,
                minWidth: 100,
              },
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClickProfile}>나의 프로필</MenuItem>
          <MenuItem onClick={logout} sx={{ color: "red" }}>
            나가기
          </MenuItem>
        </Menu>
      </Box>
    );
  }, [
    anchorEl,
    handleChangeJobCodeList,
    handleClick,
    handleClickProfile,
    handleClose,
    jobCode,
    jobCodeOptions,
    logout,
    open,
    user,
  ]);

  //   useEffect(() => {
  //     const jobCodeOptions =
  //       user?.jobTypeListForHeader.map((job) => ({
  //         label: job.codeName,
  //         value: job.code,
  //       })) || [];

  //     setJobCode(jobCodeOptions[0]?.value ?? '');
  //     setJobCodeOptions(jobCodeOptions);
  //   }, [userInfo]);

  return (
    <Stack
      component="header"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        height: "56px",
        background: "var(--bg-header)",
        px: "15px",
      }}
    >
      <Box sx={{ height: "24px", width: "24px" }} component="img" src={Logo} />
      {renderUserMenu()}
    </Stack>
  );
};

export default memo(Header);
