import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  type SxProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { memo, useMemo } from "react";
import theme from "../../scss/theme";

interface IBaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  sx?: SxProps;
  subtitle?: string;
  Icon: React.ElementType;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  slots?: {
    header?: React.ReactNode;
    content?: React.ReactNode;
    actions?: React.ReactNode;
  };
}

const BaseModal = ({
  open,
  Icon,
  title,
  sx,
  subtitle,
  onClose,
  maxWidth,
  fullWidth,
  slots,
}: IBaseModalProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultHeader = useMemo(
    () => (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Icon />
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    ),
    [Icon, onClose, subtitle, title]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: "2px",
          backgroundImage: "none",
          ...(isMobile && {
            margin: "16px",
            maxHeight: "calc(100% - 32px)",
          }),
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          ...sx,
        }}
      >
        <DialogTitle>{slots?.header || defaultHeader}</DialogTitle>
        <DialogContent
          sx={{
            overflow: "auto",
            scrollBehavior: "smooth",
            ...sx,
          }}
        >
          {subtitle && (
            <Typography color="grey.600" variant="body1">
              {subtitle}
            </Typography>
          )}
          {slots?.content}
        </DialogContent>
        <DialogActions>{slots?.actions}</DialogActions>
      </Box>
    </Dialog>
  );
};

export default memo(BaseModal);
