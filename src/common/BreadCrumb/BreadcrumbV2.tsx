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

// const Breadcrumb = ({ data, limitWidth, maxLength = 4 }: BreadcrumbProps) => {
//   const [open, setOpen] = useState(false);
//   const collapseRef = useRef<HTMLDivElement>(null);
//   const moreRef = useRef<any>(null);
//   const maxWidth = `${limitWidth}px`;

//   const dataBreadcrumbs: ReactNode[] = data.map(({ label }) => {
//     return (
//       <Typography
//         key={label}
//         color="text.primary"
//         className="breadcrumb-item-typography"
//         maxWidth={maxWidth}
//         title={label}
//       >
//         {label}
//       </Typography>
//     );
//   });

//   const renderCollapse = () => {
//     const menuDataCollapse = [];
//     if (data.length > maxLength) {
//       for (let index = 1; index < data.length - (maxLength - 2); index++) {
//         const element = data[index];
//         menuDataCollapse.push(element);
//       }
//     }
//     return menuDataCollapse;
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       collapseRef.current &&
//       !collapseRef.current.contains(event.target as Node) &&
//       event.target !== moreRef.current
//     ) {
//       setOpen(false);
//     }
//   };

//   useEffect(() => {
//     const element = document.querySelector(".MuiBreadcrumbs-ol li button");
//     if (element) {
//       const elementMore = document.createElement("a");
//       elementMore.innerText = "...";
//       elementMore.classList.add("text-more");
//       element?.replaceWith(elementMore);
//       moreRef.current = elementMore;
//       elementMore.addEventListener("click", () => {
//         setOpen((pre) => !pre);
//       });
//     }
//   }, [open]);

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   //   return (
//   //     <Box sx={{ position: "relative" }}>
//   //       <Breadcrumbs
//   //         separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}
//   //         maxItems={maxLength}
//   //         itemsAfterCollapse={maxLength - 2}
//   //       >
//   //         {dataBreadcrumbs}
//   //       </Breadcrumbs>

//   //       {renderCollapse().length > 0 && (
//   //         <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
//   //           <List>
//   //             {renderCollapse().map(({ label, url }) => (
//   //               <ListItem key={label}>
//   //                 <Link to={url || ""}>{label}</Link>
//   //               </ListItem>
//   //             ))}
//   //           </List>
//   //         </Collapse>
//   //       )}
//   //     </Box>
//   //   );
//   // };
//   return (
//     <Box sx={{ position: "relative", px: 2, py: 1 }}>
//       <Breadcrumbs
//         separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}
//         maxItems={maxLength}
//         itemsAfterCollapse={maxLength - 2}
//       >
//         {dataBreadcrumbs}
//       </Breadcrumbs>

//       {renderCollapse().length > 0 && (
//         <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
//           <List sx={{ mt: 1, ml: 1 }}>
//             {renderCollapse().map(({ label, url }) => (
//               <ListItem
//                 key={label}
//                 disablePadding
//                 sx={{
//                   pl: 2,
//                   "& a": {
//                     color: "primary.main",
//                     textDecoration: "none",
//                     fontSize: 14,
//                     "&:hover": {
//                       textDecoration: "underline",
//                     },
//                   },
//                 }}
//               >
//                 <Link to={url || ""}>{label}</Link>
//               </ListItem>
//             ))}
//           </List>
//         </Collapse>
//       )}
//     </Box>
//   );
// };
// export default Breadcrumb;

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Box,
  Breadcrumbs,
  Collapse,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
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

const Breadcrumb = ({ data, limitWidth, maxLength = 4 }: BreadcrumbProps) => {
  const [open, setOpen] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<any>(null);
  const maxWidth = `${limitWidth}px`;
  const location = useLocation();

  const dataBreadcrumbs: ReactNode[] = data.map(({ label }) => {
    return (
      <Typography
        key={label}
        color="text.primary"
        className="breadcrumb-item-typography"
        maxWidth={maxWidth}
        title={label}
      >
        {label}
      </Typography>
    );
  });

  const renderCollapse = () => {
    const menuDataCollapse = [];
    if (data.length > maxLength) {
      for (let index = 1; index < data.length - (maxLength - 2); index++) {
        const element = data[index];
        menuDataCollapse.push(element);
      }
    }
    return menuDataCollapse;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      collapseRef.current &&
      !collapseRef.current.contains(event.target as Node) &&
      event.target !== moreRef.current
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const element = document.querySelector(".MuiBreadcrumbs-ol li button");
    if (element) {
      const elementMore = document.createElement("a");
      elementMore.innerText = "...";
      elementMore.classList.add("text-more");
      element?.replaceWith(elementMore);
      moreRef.current = elementMore;
      elementMore.addEventListener("click", () => {
        setOpen((pre) => !pre);
      });
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <Breadcrumbs
        separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}
        maxItems={maxLength}
        itemsAfterCollapse={maxLength - 2}
      >
        {dataBreadcrumbs}
      </Breadcrumbs>

      {renderCollapse().length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
          <List>
            {renderCollapse().map(({ label, url }) => (
              <ListItem key={label}>
                <Link to={url || ""}>{label}</Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};
// return (
//   <Box sx={{ position: "relative", px: 2, py: 1 }}>
//     <Breadcrumbs
//       separator={<ArrowForwardIosTwoToneIcon fontSize="small" />}
//       maxItems={maxLength}
//       itemsAfterCollapse={maxLength - 2}
//     >
//       {dataBreadcrumbs}
//     </Breadcrumbs>

{
  /* {renderCollapse().length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
          <List sx={{ mt: 1, ml: 1 }}>
            {renderCollapse().map(({ label, url }) => (
              <ListItem
                key={label}
                disablePadding
                sx={{
                  pl: 2,
                  "& a": {
                    color: "primary.main",
                    textDecoration: "none",
                    fontSize: 14,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  },
                }}
              >
                <Link to={url || ""}>{label}</Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )} */
}
{
  /* {renderCollapse().length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
          <List sx={{ mt: 1 }}>
            {renderCollapse().map(({ label, url }) => (
              <ListItem key={label} disablePadding>
                {url ? (
                  <Link
                    to={url}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#1976d2",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                ) : (
                  <Typography sx={{ px: 2, py: 1 }} color="text.secondary">
                    {label}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </Collapse>
      )} */
}
//       {renderCollapse().map(({ label, url }) => {
//         const isActive = url === location.pathname;

//         return (
//           <ListItem key={label} disablePadding>
//             <Link
//               to={url || ""}
//               style={{
//                 display: "block",
//                 padding: "8px 16px",
//                 textDecoration: "none",
//                 color: isActive ? "#1976d2" : "#555", // ✅ màu khi active
//                 fontWeight: isActive ? 600 : 400,
//               }}
//             >
//               {label}
//             </Link>
//           </ListItem>
//         );
//       })}
//     </Box>
//   );
// };
export default Breadcrumb;
