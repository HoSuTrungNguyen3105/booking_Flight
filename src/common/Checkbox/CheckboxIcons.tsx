import "./index.scss";
import { Typography } from "@mui/material";

export const UncheckedIcon = () => <span className="checkbox-icon unchecked" />;

export const CheckedIcon = ({
  color,
}: {
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "default";
}) => (
  <Typography className={`checkbox-icon checked ${color}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  </Typography>
);

export const IndeterminateIcon = ({
  color,
}: {
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "default";
}) => (
  <Typography className={`checkbox-icon indeterminate ${color}`}>
    <span />
  </Typography>
);
