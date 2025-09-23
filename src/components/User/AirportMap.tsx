import React from "react";
import { Box, Typography, Card, useTheme } from "@mui/material";

export type TerminalType = "INTERNATIONAL" | "DOMESTIC" | "BUSINESS";

export type TerminalView = {
  id: string;
  code: string; // "A", "B"
  name: string;
  type: TerminalType;
  // optional coordinates (percent 0..100). If provided, used for absolute positioning.
  x?: number;
  y?: number;
  description?: string;
};

type Props = {
  airportCode?: string;
  terminals: TerminalView[];
  width?: number | string;
  height?: number | string;
};

const AirportMap: React.FC<Props> = ({
  airportCode,
  terminals,
  width = "100%",
  height = 520,
}) => {
  const theme = useTheme();

  // color mapping for terminal types
  const typeColor = (t?: TerminalType) => {
    switch (t) {
      case "BUSINESS":
        return { bg: "#fff3e0", border: "#ffb74d", text: "#5d4037" };
      case "INTERNATIONAL":
        return { bg: "#e3f2fd", border: "#64b5f6", text: "#0d47a1" };
      default:
        return { bg: "#e8f5e9", border: "#81c784", text: "#1b5e20" }; // DOMESTIC
    }
  };

  const hasCoords = terminals.some(
    (t) => typeof t.x === "number" && typeof t.y === "number"
  );

  return (
    <Box
      sx={{
        width,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Sơ đồ sân bay {airportCode ? `- ${airportCode}` : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (Click / hover từng terminal để xem thông tin)
        </Typography>
      </Box>

      {/* Map container */}
      <Box
        sx={{
          width: "100%",
          height,
          borderRadius: 2,
          position: "relative",
          bgcolor: theme.palette.mode === "dark" ? "#0f1720" : "#f6fbff",
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
        }}
      >
        {/* runway / taxiway background (simple decorative lines) */}
        <Box
          sx={{
            position: "absolute",
            left: "6%",
            right: "6%",
            top: "18%",
            bottom: "18%",
            borderRadius: 1,
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 6px, transparent 6px 18px)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* If coordinates provided -> absolute positioning */}
        {hasCoords ? (
          terminals.map((t) => {
            const { bg, border, text } = typeColor(t.type);
            const px = Math.max(0, Math.min(100, t.x ?? 0));
            const py = Math.max(0, Math.min(100, t.y ?? 0));
            return (
              <Card
                key={t.id}
                variant="outlined"
                sx={{
                  position: "absolute",
                  left: `calc(${px}% - 48px)`, // center the box (width ~96px)
                  top: `calc(${py}% - 28px)`,
                  width: 96,
                  minHeight: 56,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: `2px solid ${border}`,
                  bgcolor: bg,
                  color: text,
                  cursor: "pointer",
                  transition: "transform 0.16s ease, box-shadow 0.16s ease",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.03)",
                    boxShadow: "0 8px 22px rgba(15,23,42,0.12)",
                    zIndex: 10,
                  },
                }}
                title={`${t.code} — ${t.name} (${t.type})`}
              >
                <Typography sx={{ fontWeight: 700 }}>{t.code}</Typography>
                <Typography sx={{ fontSize: 12, color: text, opacity: 0.85 }}>
                  {t.type}
                </Typography>
              </Card>
            );
          })
        ) : (
          /* NO coords -> auto grid layout at bottom area */
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              p: 2,
            }}
          >
            {terminals.map((t) => {
              const { bg, border, text } = typeColor(t.type);
              return (
                <Card
                  key={t.id}
                  variant="outlined"
                  sx={{
                    p: 1.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: `1px solid ${border}`,
                    bgcolor: bg,
                    cursor: "pointer",
                    transition: "transform 0.14s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
                    },
                  }}
                  title={`${t.code} — ${t.name} (${t.type})`}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: border,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{t.code}</Typography>
                    <Typography
                      sx={{ fontSize: 12, color: text, opacity: 0.9 }}
                    >
                      {t.name}
                    </Typography>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AirportMap;
