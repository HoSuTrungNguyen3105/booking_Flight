import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";

interface DialogConfirmProps {
  icon?: string;
  open: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DialogConfirm = ({
  icon,
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
}: DialogConfirmProps) => {
  return (
    <Dialog disableScrollLock open={open} onClose={onClose}>
      <Box height={"10rem"} minHeight={"12rem"} width="478px" px="8px">
        <DialogTitle>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            {icon && (
              <Box
                component={"img"}
                src={icon}
                sx={{ height: 30, width: 30 }}
                alt="icon"
              />
            )}
            <Typography variant="body1">{title}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="grey.600">
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box
            display="flex"
            gap={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="outlined" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default memo(DialogConfirm);
