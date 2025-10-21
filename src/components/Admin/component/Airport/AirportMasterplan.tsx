import React, { useState } from "react";
import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import DetailTerminalModal from "../InfrastructureEntities/modal/DetailTerminalModal";
// import DetailTerminalModal from "../../modal/DetailTerminalModal";

export type AreaKey =
  | "all"
  | "runway"
  | "taxiway"
  | "apron"
  | "terminalA"
  | "terminalB"
  | "controlTower"
  | "cargo"
  | "maintenance"
  | "parking"
  | "road";

const AREA_LABELS: Record<AreaKey, string> = {
  all: "Toàn bộ",
  runway: "Đường băng",
  taxiway: "Đường lăn",
  apron: "Apron / Sân đỗ",
  terminalA: "Terminal A",
  terminalB: "Terminal B",
  controlTower: "Control Tower",
  cargo: "Cargo",
  maintenance: "Maintenance",
  parking: "Parking",
  road: "Road / Drop-off",
};

// Thông tin chi tiết cho từng khu vực
const AREA_DETAILS: Record<
  AreaKey,
  { title: string; description: string; features?: string[] }
> = {
  all: {
    title: "Toàn bộ sân bay",
    description: "Tổng quan toàn bộ kiến trúc và các khu vực của sân bay.",
  },
  runway: {
    title: "Đường băng",
    description: "Đường băng là khu vực máy bay cất cánh và hạ cánh.",
    features: ["Chiều dài: 3000m", "Hướng: 09/27", "Vật liệu: Bê tông asphalt"],
  },
  taxiway: {
    title: "Đường lăn",
    description:
      "Đường nối giữa đường băng và nhà ga, máy bay di chuyển đến vị trí đỗ.",
    features: [
      "Hệ thống đèn hiệu",
      "Đường lăn song song",
      "Kết nối toàn bộ khu vực",
    ],
  },
  apron: {
    title: "Apron / Sân đỗ máy bay",
    description: "Khu vực đỗ máy bay, tiếp nhiên liệu và hàng hóa.",
    features: [
      "20 vị trí đỗ",
      "Hệ thống tiếp nhiên liệu",
      "Kết nối với Terminal A & B",
    ],
  },
  terminalA: {
    title: "Terminal A (Nội địa)",
    description: "Nhà ga phục vụ các chuyến bay nội địa.",
    features: [
      "6 cổng lên máy bay",
      "Khu check-in",
      "Khu thương mại & dịch vụ",
    ],
  },
  terminalB: {
    title: "Terminal B (Quốc tế)",
    description: "Nhà ga phục vụ các chuyến bay quốc tế.",
    features: [
      "4 cổng lên máy bay",
      "Khu kiểm tra hải quan",
      "Khu mua sắm miễn thuế",
    ],
  },
  controlTower: {
    title: "Đài kiểm soát không lưu",
    description:
      "Điều phối hoạt động cất cánh, hạ cánh và di chuyển của máy bay.",
    features: [
      "Tầm nhìn toàn sân bay",
      "Hệ thống radar hiện đại",
      "Hoạt động 24/7",
    ],
  },
  cargo: {
    title: "Khu vực hàng hóa",
    description: "Khu vực xử lý hàng hóa, vận chuyển hàng không.",
    features: ["Kho lạnh", "Hệ thống băng chuyền", "Khu vực thông quan"],
  },
  maintenance: {
    title: "Khu bảo trì & Hangar",
    description: "Bảo dưỡng, sửa chữa máy bay và thiết bị mặt đất.",
    features: [
      "2 hangar lớn",
      "Xưởng bảo dưỡng động cơ",
      "Khu vực kiểm tra kỹ thuật",
    ],
  },
  parking: {
    title: "Bãi đỗ xe",
    description: "Khu vực đỗ xe cho hành khách và nhân viên.",
    features: [
      "Sức chứa 500 xe",
      "Khu vực đỗ xe ngắn hạn",
      "Khu vực đỗ xe dài hạn",
    ],
  },
  road: {
    title: "Đường giao thông & Khu đón tiễn",
    description: "Hệ thống đường giao thông kết nối sân bay với thành phố.",
    features: [
      "Đường vào thẳng terminal",
      "Khu đón/tiễn khách",
      "Kết nối với đường cao tốc",
    ],
  },
};

const AirportMasterplan: React.FC = () => {
  const [highlight, setHighlight] = useState<AreaKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaKey>("all");

  const onEnter = (k: AreaKey) => setHighlight(k);
  const onLeave = () => setHighlight("all");

  const onClick = (k: AreaKey) => {
    if (k !== "all") {
      setSelectedArea(k);
      setModalOpen(true);
    }
    setHighlight((prev) => (prev === k ? "all" : k));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const isHighlighted = (k: AreaKey) =>
    highlight === "all" ? true : highlight === k;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sơ đồ kiến trúc sân bay (masterplan) — minh hoạ
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 1,
            minHeight: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Map */}
          <svg
            viewBox="0 0 1200 700"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Airport masterplan diagram"
          >
            <defs>
              <filter
                id="softShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="6"
                  floodOpacity="0.12"
                />
              </filter>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="1200" height="700" fill="#f5f7fa" />

            {/* Roads / drop-off */}
            <g
              onMouseEnter={() => onEnter("road")}
              onMouseLeave={onLeave}
              onClick={() => onClick("road")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("road") ? 1 : 0.25}
            >
              <rect
                x="40"
                y="520"
                width="1120"
                height="80"
                rx="8"
                fill="#e0e0e0"
              />
              <text x="60" y="556" fontSize="14" fill="#333">
                Road / Drop-off
              </text>
            </g>

            {/* Parking */}
            <g
              onMouseEnter={() => onEnter("parking")}
              onMouseLeave={onLeave}
              onClick={() => onClick("parking")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("parking") ? 1 : 0.25}
            >
              <rect
                x="960"
                y="420"
                width="180"
                height="88"
                rx="6"
                fill="#dfe7ff"
              />
              <text x="970" y="460" fontSize="13" fill="#123" fontWeight="600">
                Parking
              </text>
            </g>

            {/* Terminal A (main concourse) */}
            <g
              transform="translate(120,360)"
              onMouseEnter={() => onEnter("terminalA")}
              onMouseLeave={onLeave}
              onClick={() => onClick("terminalA")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("terminalA") ? 1 : 0.35}
              filter={
                isHighlighted("terminalA") ? "url(#softShadow)" : undefined
              }
            >
              <rect
                x="0"
                y="0"
                width="600"
                height="120"
                rx="12"
                fill="#ffffff"
                stroke="#cfe0ff"
                strokeWidth={2}
              />
              <text x="14" y="26" fontSize="16" fill="#0b4f8a" fontWeight="700">
                Terminal A (Domestic)
              </text>

              {/* Gates A1-A6 along top edge */}
              {Array.from({ length: 6 }).map((_, i) => {
                const x = 20 + i * 92;
                return (
                  <g key={i} transform={`translate(${x},40)`}>
                    <rect
                      width="72"
                      height="44"
                      rx="6"
                      fill="#f8fbff"
                      stroke="#bcd4ff"
                    />
                    <text x="10" y="26" fontSize="12" fill="#0b4f8a">
                      Gate A{i + 1}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Apron */}
            <g
              onMouseEnter={() => onEnter("apron")}
              onMouseLeave={onLeave}
              onClick={() => onClick("apron")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("apron") ? 1 : 0.25}
            >
              <rect
                x="110"
                y="260"
                width="630"
                height="120"
                rx="6"
                fill="#eef8ff"
                stroke="#cde7ff"
              />
              <text x="120" y="290" fontSize="13" fill="#045" fontWeight="600">
                Apron / Aircraft Stands
              </text>
            </g>

            {/* Taxiways */}
            <g
              onMouseEnter={() => onEnter("taxiway")}
              onMouseLeave={onLeave}
              onClick={() => onClick("taxiway")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("taxiway") ? 1 : 0.2}
            >
              <rect
                x="370"
                y="200"
                width="28"
                height="140"
                fill="#c8d7ff"
                rx="4"
              />
              <rect
                x="640"
                y="200"
                width="28"
                height="140"
                fill="#c8d7ff"
                rx="4"
              />
              <text x="460" y="240" fontSize="12" fill="#113">
                Taxiways
              </text>
            </g>

            {/* Runway */}
            <g
              onMouseEnter={() => onEnter("runway")}
              onMouseLeave={onLeave}
              onClick={() => onClick("runway")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("runway") ? 1 : 0.2}
            >
              <rect
                x="120"
                y="40"
                width="960"
                height="80"
                rx="8"
                fill="#2f3540"
              />
              {/* runway markings */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x={160 + i * 72}
                  y={64}
                  width={36}
                  height={8}
                  fill="#fff"
                  opacity={0.85}
                />
              ))}
              <text x="140" y="92" fontSize="14" fill="#fff">
                Runway 09/27
              </text>
            </g>

            {/* Terminal B (satellite) */}
            <g
              transform="translate(760,190)"
              onMouseEnter={() => onEnter("terminalB")}
              onMouseLeave={onLeave}
              onClick={() => onClick("terminalB")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("terminalB") ? 1 : 0.35}
              filter={
                isHighlighted("terminalB") ? "url(#softShadow)" : undefined
              }
            >
              <rect
                x="0"
                y="0"
                width="260"
                height="120"
                rx="14"
                fill="#fff7f0"
                stroke="#ffd6b3"
                strokeWidth={2}
              />
              <text x="12" y="26" fontSize="15" fill="#8a4b00" fontWeight="700">
                Terminal B (International)
              </text>
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i} transform={`translate(${12 + i * 60},44)`}>
                  <rect
                    width="52"
                    height="44"
                    rx="6"
                    fill="#fff8f3"
                    stroke="#ffd9c2"
                  />
                  <text x="6" y="26" fontSize="12" fill="#8a4b00">
                    Gate B{i + 1}
                  </text>
                </g>
              ))}
            </g>

            {/* Control Tower */}
            <g
              onMouseEnter={() => onEnter("controlTower")}
              onMouseLeave={onLeave}
              onClick={() => onClick("controlTower")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("controlTower") ? 1 : 0.25}
            >
              <circle
                cx="720"
                cy="360"
                r="22"
                fill="#ffe082"
                stroke="#ffb74d"
              />
              <rect
                x="712"
                y="380"
                width="16"
                height="28"
                rx="4"
                fill="#ffc107"
              />
              <text x="700" y="410" fontSize="12" fill="#733d00">
                Control Tower
              </text>
            </g>

            <g
              onMouseEnter={() => onEnter("cargo")}
              onMouseLeave={onLeave}
              onClick={() => onClick("cargo")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("cargo") ? 1 : 0.25}
            >
              <rect
                x="40"
                y="120"
                width="180"
                height="100"
                rx="10"
                fill="#e8f5e9"
                stroke="#bfe6c7"
              />
              <text
                x="60"
                y="150"
                fontSize="13"
                fill="#0a6b2a"
                fontWeight="600"
              >
                Cargo / Freight
              </text>
            </g>

            <g
              onMouseEnter={() => onEnter("maintenance")}
              onMouseLeave={onLeave}
              onClick={() => onClick("maintenance")}
              style={{ cursor: "pointer" }}
              opacity={isHighlighted("maintenance") ? 1 : 0.25}
            >
              <rect
                x="240"
                y="120"
                width="220"
                height="100"
                rx="8"
                fill="#fff4f6"
                stroke="#ffc7d1"
              />
              <text
                x="260"
                y="150"
                fontSize="13"
                fill="#7a1f3d"
                fontWeight="600"
              >
                Maintenance / Hangar
              </text>
            </g>
          </svg>
        </Paper>

        <Paper sx={{ width: 320, p: 2 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Legend & Controls
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {(Object.keys(AREA_LABELS) as AreaKey[]).map((k) => (
              <Chip
                key={k}
                label={AREA_LABELS[k]}
                clickable
                onClick={() => onClick(k)}
                onMouseEnter={() => onEnter(k)}
                onMouseLeave={onLeave}
                variant={highlight === k ? "filled" : "outlined"}
                size="small"
                color={k === "all" ? "default" : "primary"}
              />
            ))}
          </Box>

          <Typography variant="subtitle2">Notes</Typography>
          <Typography variant="body2" color="text.secondary">
            - Click hoặc hover trên map để highlight khu tương ứng.
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1, fontWeight: "bold" }}
          >
            - Click vào từng khu vực để xem thông tin chi tiết.
          </Typography>
        </Paper>
      </Stack>

      <DetailTerminalModal
        open={modalOpen}
        onClose={handleCloseModal}
        AREA_DETAILS={AREA_DETAILS}
        selectedArea={selectedArea}
        onSuccess={handleCloseModal}
      />
    </Box>
  );
};

export default AirportMasterplan;
