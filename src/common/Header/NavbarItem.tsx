import { Box, Button, Typography, Paper } from "@mui/material";
import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Person as PersonIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  DirectionsRun as DirectionsRunIcon,
  Info as InfoIcon,
  FlightTakeoff as FlightTakeoffIcon,
  Flight as FlightIcon,
  LocalOffer as LocalOfferIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import ButtonLink from "../AdditionalCustomFC/ButtonLink";

type MenuItem = {
  value: string;
  icon: ReactNode;
  label: string;
};

type TabData = {
  [key: string]: MenuItem[];
};

export const menuData: TabData = {
  Customers: [
    { value: "contact", icon: <PersonIcon />, label: "Hồ sơ khách hàng" },
    { value: "profile", icon: <StarIcon />, label: "Đánh giá khách hàng" },
    { value: "flight/info-page", icon: <FolderIcon />, label: "Lưu trữ hồ sơ" },
    {
      value: "hotels",
      icon: <DirectionsRunIcon />,
      label: "Hướng dẫn sử dụng",
    },
    { value: "flight/deals", icon: <InfoIcon />, label: "Trung tâm hỗ trợ" },
  ],

  Platform: [
    { icon: <FlightIcon />, value: "admin", label: "Admin dashboard" },
    { icon: <FolderIcon />, label: "Quản lý hồ sơ vé" },
    { icon: <LocalOfferIcon />, label: "Quản lý giảm giá" },
  ],

  Solutions: [
    { icon: <SupportAgentIcon />, label: "Quản lý đại lý" },
    { icon: <StarIcon />, label: "Chính sách hạng vé" },
  ],

  Pricing: [
    { icon: <LocalOfferIcon />, label: "Bảng giá" },
    { icon: <InfoIcon />, label: "Điều khoản giá" },
  ],

  Resources: [
    { icon: <InfoIcon />, label: "Tài liệu" },
    { icon: <SupportAgentIcon />, label: "Hỗ trợ kỹ thuật" },
  ],

  Company: [
    { icon: <InfoIcon />, label: "Về chúng tôi" },
    { icon: <PersonIcon />, label: "Nhân sự" },
  ],
};

export default function NavbarItem() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: string) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* ==== NAV BAR ==== */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          py: 2,
          px: 5,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          NAVAN
        </Typography>

        {Object.keys(menuData).map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabClick(tab)}
            sx={{
              fontSize: "14px",
              px: 1,
              pb: 0.5,
              color: activeTab === tab ? "#6a0dad" : "#000",
              borderBottom: activeTab === tab ? "2px solid #6a0dad" : "none",
              borderRadius: 0,
              textTransform: "none",
              "&:hover": {
                color: "#6a0dad",
                background: "transparent",
              },
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* ==== DROPDOWN ==== */}
      {activeTab && menuData[activeTab].length > 0 && (
        <Paper
          ref={dropdownRef}
          elevation={4}
          sx={{
            position: "absolute",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            py: 6,
            px: 15,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 4,
            zIndex: 50,
          }}
        >
          {menuData[activeTab].map((item, e) => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <ButtonLink
                key={e}
                url={item.value}
                text={item.label}
                variant="text"
              />
              {/* <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgColor: "primary.main",
                  background: "#23005a",
                  color: "#fff",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {item.icon}
              </Box>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {item.label}
              </Typography> */}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
