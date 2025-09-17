import { Chair, StarHalfSharp, Wc, Window } from "@mui/icons-material";
import { Box, Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { memo, useCallback } from "react";

type LegendItemProps = {
  color: string;
  label: string;
  icon?: React.ReactNode;
};

const LegendItemSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderColorForLegendItem = useCallback(() => {
    return [
      { color: "#f5f5f5", label: "Available" },
      { color: "#d3d3d3", label: "Booked" },
      {
        color: "#f9a825",
        label: "VIP",
        icon: (
          <StarHalfSharp
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        ),
      },
      {
        color: "#29b6f6",
        label: "Economy",
        icon: (
          <Chair sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        ),
      },
      {
        color: "#e3f2fd",
        label: "Window",
        icon: (
          <Window sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        ),
      },
      {
        color: "#fff3e0",
        label: "Restroom",
        icon: <Wc sx={{ color: theme.palette.primary.main, fontSize: 16 }} />,
      },
    ];
  }, [theme.palette.primary.main]);

  const renderLegendItem = useCallback(
    ({ color, label, icon }: LegendItemProps) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box
            sx={{
              width: "20px",
              height: "20px",
              backgroundColor: color,
              borderRadius: "4px",
              border: "1px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            {label}
          </Typography>
        </Box>
      );
    },
    [theme.palette.primary.main, isMobile]
  );

  return (
    <Card
      sx={{
        padding: { xs: "12px", sm: "16px" },
        marginBottom: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid ${theme.palette.primary.light}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        {renderColorForLegendItem().map((item, index) => (
          <React.Fragment key={index}>
            {renderLegendItem({
              color: item.color,
              label: item.label,
              icon: item.icon,
            })}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default memo(LegendItemSection);
