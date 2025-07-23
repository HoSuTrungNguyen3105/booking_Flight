import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";

const OrderButton = ({
  disabled,
  onClick,
}: {
  disabled: { up: boolean; down: boolean };
  onClick: (direction: "up" | "down") => void;
}) => (
  <Stack justifyContent="center" alignItems="center">
    <IconButton
      size="small"
      disabled={disabled.up}
      onClick={() => onClick("up")}
    >
      <ArrowUpward fontSize="inherit" />
    </IconButton>
    <IconButton
      size="small"
      disabled={disabled.down}
      onClick={() => onClick("down")}
    >
      <ArrowDownward fontSize="inherit" />
    </IconButton>
  </Stack>
);
export default OrderButton;
