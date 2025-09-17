import { memo } from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

interface CustomBreadCrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const BreadCrumb: React.FC<CustomBreadCrumbProps> = ({
  items,
  separator = <NavigateNext fontSize="small" />,
}) => {
  const theme = useTheme();

  return (
    <MuiBreadcrumbs
      separator={separator}
      aria-label="breadcrumb"
      sx={{
        "& .MuiBreadcrumbs-separator": {
          margin: theme.spacing(0, 0.5),
          color: theme.palette.text.secondary,
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.palette.text.primary,
            }}
          >
            {item.icon && (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "inherit",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ) : (
          <Link
            key={index}
            href={item.href}
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: theme.palette.primary.main,
              "&:hover": {
                textDecoration: "underline",
                color: theme.palette.primary.dark,
              },
            }}
          >
            {item.icon && (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
            )}
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default memo(BreadCrumb);
