// import { Typography } from "@mui/material";

// export const UncheckedIcon = () => (
//   <span className="w-5 h-5 border border-gray-400 rounded"></span>
// );

// export const CheckedIcon = ({ color }: { color: "primary" | "secondary" }) => (
//   <Typography
//     className={`w-5 h-5 flex items-center justify-center rounded ${
//       color === "primary"
//         ? "bg-blue-500 border border-blue-500"
//         : "bg-purple-500 border border-purple-500"
//     }`}
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-3 h-3 text-white"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M5 13l4 4L19 7"
//       />
//     </svg>
//   </Typography>
// );

// export const IndeterminateIcon = ({
//   color,
// }: {
//   color: "primary" | "secondary";
// }) => (
//   <Typography
//     className={`w-5 h-5 flex items-center justify-center rounded ${
//       color === "primary"
//         ? "bg-blue-300 border border-blue-500"
//         : "bg-purple-300 border border-purple-500"
//     }`}
//   >
//     <span className="w-3 h-0.5 bg-white"></span>
//   </Typography>
// );

import "./index.scss";
import { Typography } from "@mui/material";

export const UncheckedIcon = () => <span className="checkbox-icon unchecked" />;

export const CheckedIcon = ({ color }: { color: "primary" | "secondary" }) => (
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
  color: "primary" | "secondary";
}) => (
  <Typography className={`checkbox-icon indeterminate ${color}`}>
    <span />
  </Typography>
);
