// import { useEffect, useRef, useState, type ReactNode } from "react";
// import {
//   Box,
//   Breadcrumbs,
//   Collapse,
//   List,
//   ListItem,
//   Typography,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";

// export interface MenuData {
//   label: string;
//   url?: string;
// }

// interface BreadcrumbProps {
//   data: MenuData[];
//   maxLength?: number;
//   limitWidth?: number;
// }

// const Breadcrumb = ({
//   data,
//   limitWidth = 100,
//   maxLength = 4,
// }: BreadcrumbProps) => {
//   const [open, setOpen] = useState(false);
//   const collapseRef = useRef<HTMLDivElement>(null);
//   const moreRef = useRef<HTMLSpanElement>(null);
//   const maxWidth = `${limitWidth}px`;

//   // Tách dữ liệu: hiển thị đầu-cuối, ẩn ở giữa
//   const hiddenItems =
//     data.length > maxLength ? data.slice(1, data.length - (maxLength - 2)) : [];

//   const visibleItems: MenuData[] =
//     data.length > maxLength
//       ? [data[0], ...data.slice(data.length - (maxLength - 2))]
//       : data;

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       collapseRef.current &&
//       !collapseRef.current.contains(event.target as Node) &&
//       !moreRef.current?.contains(event.target as Node)
//     ) {
//       setOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   return (
//     <Box sx={{ position: "relative", px: 2, py: 1 }}>
//       <Breadcrumbs separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}>
//         {visibleItems.map(({ label, url }, idx) => (
//           <Typography
//             key={label + idx}
//             component="span"
//             color="text.primary"
//             className="breadcrumb-item-typography"
//             maxWidth={maxWidth}
//             title={label}
//           >
//             {url ? <Link to={url}>{label}</Link> : label}
//           </Typography>
//         ))}

//         {hiddenItems.length > 0 && (
//           <Typography
//             component="span"
//             ref={moreRef}
//             sx={{ cursor: "pointer", color: "primary.main", fontWeight: 600 }}
//             onClick={() => setOpen((prev) => !prev)}
//           >
//             ...
//           </Typography>
//         )}
//       </Breadcrumbs>

//       {/* Collapse ẩn phần giữa */}
//       {hiddenItems.length > 0 && (
//         <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
//           <List sx={{ mt: 1, ml: 1 }}>
//             {hiddenItems.map(({ label, url }) => (
//               <ListItem key={label} disablePadding>
//                 <Link
//                   to={url || ""}
//                   style={{
//                     display: "block",
//                     padding: "8px 16px",
//                     color: "#1976d2",
//                     textDecoration: "none",
//                   }}
//                 >
//                   {label}
//                 </Link>
//               </ListItem>
//             ))}
//           </List>
//         </Collapse>
//       )}
//     </Box>
//   );
// };

// export default Breadcrumb;

import { useState } from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";

export interface MenuData {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  data: MenuData[];
  maxLength?: number;
  limitWidth?: number;
}

const Breadcrumb = ({
  data,
  limitWidth = 120,
  maxLength = 4,
}: BreadcrumbProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWidth = `${limitWidth}px`;

  const hiddenItems =
    data.length > maxLength ? data.slice(1, data.length - (maxLength - 2)) : [];

  const visibleItems = isExpanded
    ? data
    : data.length > maxLength
    ? [
        data[0],
        { label: "...", url: undefined },
        ...data.slice(data.length - (maxLength - 2)),
      ]
    : data;

  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Breadcrumbs
        separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}
        sx={{ flexWrap: "wrap" }}
      >
        {visibleItems.map(({ label, url }, idx) => {
          const isEllipsis = label === "...";

          if (isEllipsis) {
            return (
              <Typography
                key={`ellipsis-${idx}`}
                component="span"
                onClick={handleExpand}
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  fontWeight: 600,
                  maxWidth,
                }}
                title="Hiện tất cả"
              >
                ...
              </Typography>
            );
          }

          return (
            <Typography
              key={label + idx}
              component="span"
              sx={{
                maxWidth,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={label}
            >
              {url ? (
                <Link
                  to={url}
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                  }}
                >
                  {label}
                </Link>
              ) : (
                label
              )}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
