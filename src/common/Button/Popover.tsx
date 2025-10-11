import { Box, Button, Popover, styled } from "@mui/material";
import React, { memo, useState, type ReactNode } from "react";

export interface IButtonSettingProps {
  option?: ReactNode[];
  icon: ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  handleAction: (opt: any) => void;
  hideSubmitButton?: boolean;
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

  return (
    <>
      <Button
        {...buttonProps}
        variant="contained"
        onClick={handleClick}
        sx={{ minWidth: "23px", position: "relative", ...buttonProps?.sx }}
      >
        {icon}
      </Button>

      <StyledPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1 }}>
          {Array.isArray(option) && option.length > 0
            ? option.map((item, index) => {
                if (typeof item === "string") {
                  return (
                    <Box
                      key={index}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        handleAction?.(item);
                        handleClose();
                      }}
                    >
                      {item}
                    </Box>
                  );
                } else {
                  return <Box key={index}>{item}</Box>;
                }
              })
            : null}

          {/* Button luôn render nếu hideSubmitButton = false */}
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
