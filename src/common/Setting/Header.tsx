import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material";
import Logo from "../../svgs/logo-github.svg";
import UserIcon from "../../svgs/user-icon.svg";
// import Dropdown, { IDropdownOption } from 'components/atoms/Dropdown';
// import { ROUTE_PATHS } from 'constants/routes';
// import { useAuth } from 'contexts/AuthProvider';
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { DropdownOption } from "../Dropdown/MultiDropdown";
import { ROUTE_PATHS } from "../../routers/RoutePath";
import CSelect from "../Dropdown/CSelect";
// import { Dropdown } from '../Dropdown/Dropdown';

const Header = () => {
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const [jobCode, setJobCode] = useState<string>("");
  const [jobCodeOptions, setJobCodeOptions] = useState<DropdownOption[]>([]);

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
      navigate(ROUTE_PATHS.PROFILE);
    },
    [navigate]
  );

  const renderUserMenu = useCallback(() => {
    if (!user) return null;

    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
      >
        <Box>
          <CSelect
            sx={{ backgroundColor: "primary.main", minWidth: 100 }}
            value={jobCode}
            options={jobCodeOptions}
            onChange={(val) => handleChangeJobCodeList(val as string)}
          />
        </Box>
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
          <Typography variant="subtitle1" color="white">
            {user.userName || user.userId}
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
        height: "48px",
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
