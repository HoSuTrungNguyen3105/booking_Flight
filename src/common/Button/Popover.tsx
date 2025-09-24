import { Box, Button, Popover, styled } from "@mui/material";
import React, { memo, useState, type ReactNode } from "react";

export interface IButtonSettingProps {
  option?: ReactNode[];
  icon: ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  handleAction: (opt: any) => void;
}

const StyledPopover = styled(Popover)<{}>(() => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    padding: "10px",
    minWidth: "120px",
  },
}));

const CustomPopover: React.FC<IButtonSettingProps> = ({
  buttonProps,
  icon,
  handleAction,
  option = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = Array.isArray(option) ? option : [];

  return (
    <>
      <Button
        {...buttonProps}
        variant="contained"
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
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1 }}>
          {options.map((item, index) => (
            <Box
              key={index}
              sx={{
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "default",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
              onClick={() => {
                handleAction?.(item);
              }}
            >
              {item}
            </Box>
          ))}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
              handleAction?.(null); // hoặc truyền options nếu cần
              handleClose();
            }}
          >
            Submit
          </Button>
        </Box>
      </StyledPopover>
    </>
  );
};

export default memo(CustomPopover);
