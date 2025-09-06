import { Box, Button, Popover, styled } from "@mui/material";
import React, { useMemo, useState } from "react";
import theme from "../../scss/theme";

export interface IButtonSettingProps {
  option?: string;
  icon: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  handleAction: () => void;
}
const StyledPopover = styled(Popover)<{}>(() => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    padding: "10px",
  },
}));

const CustomPopover: React.FC<IButtonSettingProps> = ({
  buttonProps,
  icon,
  handleAction,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const id = useMemo(
    () => (anchorEl ? "simple-popover" : undefined),
    [anchorEl]
  );
  return (
    <div>
      <Button
        {...buttonProps}
        variant="contained"
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          minWidth: "23px",
          position: "relative",
          ...buttonProps?.sx,
        }}
      >
        {icon}
        {/* && <Box component={"img"} src={icon} /> */}
      </Button>
      <StyledPopover
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button
          onClick={handleAction}
          sx={{
            color: theme.palette.text.primary,
            textTransform: "none",
          }}
        >
          DashBoard
        </Button>
      </StyledPopover>
    </div>
  );
};

export default CustomPopover;
