import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HorizontalRuleSharpIcon from "@mui/icons-material/HorizontalRuleSharp";
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
      <KeyboardArrowUpIcon fontSize="inherit" />
    </IconButton>
    {/* <IconButton size="small">
      <HorizontalRuleSharpIcon />
    </IconButton> */}

    <IconButton
      size="small"
      disabled={disabled.down}
      onClick={() => onClick("down")}
    >
      <KeyboardArrowDownIcon fontSize="inherit" />
    </IconButton>
  </Stack>
);
export default OrderButton;
