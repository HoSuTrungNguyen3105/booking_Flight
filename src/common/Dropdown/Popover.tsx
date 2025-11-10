import { Box, Button, Popover, styled } from "@mui/material";
import React, { memo, useState, type ReactNode } from "react";

export interface IButtonSettingProps {
  option?: (string | ReactNode)[];
  text: string;
  icon?: ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  handleAction?: (opt: string | null) => void;
  hideSubmitButton?: boolean;
}

const StyledPopover = styled(Popover)(() => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    padding: "10px",
    minWidth: "120px",
  },
}));

const CustomPopover: React.FC<IButtonSettingProps> = ({
  buttonProps,
  icon,
  text,
  handleAction,
  option,
  hideSubmitButton = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        {...buttonProps}
        variant="outlined"
        startIcon={icon}
        onClick={handleClick}
        sx={{
          minWidth: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...buttonProps?.sx,
        }}
      >
        {text}
      </Button>

      <StyledPopover
        open={open}
        disableScrollLock
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1 }}>
          {option?.map((item, index) => {
            if (typeof item === "string") {
              return (
                <Box
                  key={index}
                  sx={{
                    cursor: "pointer",
                    py: 0.5,
                    px: 1,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => {
                    handleAction?.(item);
                    handleClose();
                  }}
                >
                  {item}
                </Box>
              );
            }

            // Nếu là ReactNode (icon, element, component,…)
            return <Box key={index}>{item}</Box>;
          })}

          {!hideSubmitButton && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                handleAction?.(null);
                handleClose();
              }}
            >
              Submit
            </Button>
          )}
        </Box>
      </StyledPopover>
    </>
  );
};

export default memo(CustomPopover);
