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
