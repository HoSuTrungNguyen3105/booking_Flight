import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { memo, useMemo } from "react";

interface IBaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  Icon: React.ElementType;
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
  subtitle,
  onClose,
  slots,
}: IBaseModalProps) => {
  // Default header rendering
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
    <Dialog open={open} onClose={onClose}>
      <Box width="456px" p="16px">
        <DialogTitle>{slots?.header || defaultHeader}</DialogTitle>
        <DialogContent>
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
