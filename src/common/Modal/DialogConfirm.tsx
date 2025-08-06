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
    <Dialog open={open} onClose={onClose}>
      <Box width="456px" px="16px">
        <DialogTitle>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            {icon && <Box component={"img"} src={icon} alt="icon" />}
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

export default DialogConfirm;
