import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material";
import Logo from "../../svgs/logo-github.svg";
import UserIcon from "../../svgs/user-icon.svg";
import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTE_PATHS } from "../../routers/RoutePath";
import theme from "../../scss/theme";
import { LanguageButton } from "../Dropdown/Changelng";

const Header = () => {
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const [jobCode, setJobCode] = useState<string>("");

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
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
      >
        <Stack direction="column" spacing={3} sx={{ pt: 2, pb: 2 }}>
          <LanguageButton />
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
          disableScrollLock
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
    logout,
    open,
    user,
  ]);

  return (
    <Stack
      component="header"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        height: "56px",
        px: "15px",
      }}
    >
      <Box sx={{ height: "24px", width: "24px" }} component="img" src={Logo} />
      {renderUserMenu()}
    </Stack>
  );
};

export default memo(Header);
