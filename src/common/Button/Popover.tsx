import { Box, Button, Popover, styled } from "@mui/material";
import React, { useMemo, useState, type ReactNode } from "react";
import theme from "../../scss/theme";

export interface IButtonSettingProps {
  option?: ReactNode[]; // nhieu option
  icon: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  handleAction: (opt: any) => void; // sửa: truyền option khi click
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
  option = [],
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

  const options = Array.isArray(option) ? option : [];

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
        {options.map((item, index) => (
          <Button
            key={index}
            onClick={() => {
              handleAction?.(item);
              handleClose();
            }}
            sx={{
              color: theme.palette.text.primary,
              textTransform: "none",
              cursor: "pointer",
            }}
          >
            {item}
          </Button>
        ))}
      </StyledPopover>
    </div>
  );
};

export default CustomPopover;
