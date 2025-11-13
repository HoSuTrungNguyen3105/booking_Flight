import { Box, Button, Typography, Paper, Divider } from "@mui/material";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { User, Star, Folder, Info, Tag, Users, Headphones } from "lucide-react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ButtonLink from "../AdditionalCustomFC/ButtonLink";
import { Building2, Zap } from "lucide-react";
import theme from "../../scss/theme";
import { useAuth } from "../../context/AuthContext";

type MenuItem = {
  value: string;
  icon: ReactNode;
  label: string;
};

type TabData = {
  [key: string]: {
    name: string;
    items: MenuItem[];
  };
};

export const menuData: TabData = {
  Customers: {
    name: "Customers",
    items: [
      {
        value: "contact",
        icon: <User size={24} color="#6a1b9a" strokeWidth={1.5} />,
        label: "Hồ sơ khách hàng",
      },
      {
        value: "profile",
        icon: <Star size={24} />,
        label: "Đánh giá khách hàng",
      },
      {
        value: "flight/info-page",
        icon: <Folder size={24} />,
        label: "Lưu trữ hồ sơ",
      },
      {
        value: "hotels",
        icon: <DirectionsRunIcon />,
        label: "Hướng dẫn sử dụng",
      },
      {
        value: "flight/deals",
        icon: <Info size={24} />,
        label: "Trung tâm hỗ trợ",
      },
    ],
  },
  Admin: {
    name: "Admin",
    items: [
      {
        icon: <Building2 size={24} />,
        value: "admin",
        label: "Admin dashboard",
      },
      {
        icon: <Folder size={24} />,
        value: "AttendancePage",
        label: "Quản lý hồ sơ vé",
      },
      {
        icon: <Tag size={24} />,
        value: "discount-management",
        label: "Quản lý giảm giá",
      },
    ],
  },
  Solutions: {
    name: "Solutions",
    items: [
      {
        icon: <Headphones size={24} />,
        value: "hotel/Batch",
        label: "Quản lý đại lý",
      },
      {
        icon: <Star size={24} />,
        value: "TripSummary",
        label: "Chính sách hạng vé",
      },
    ],
  },
  Pricing: {
    name: "Pricing",
    items: [
      { icon: <Tag size={24} />, value: "OrderMeal", label: "Bảng giá" },
      {
        icon: <Info size={24} />,
        value: "pricing-terms",
        label: "Điều khoản giá",
      },
    ],
  },
  Resources: {
    name: "Resources",
    items: [
      { icon: <Info size={24} />, value: "documents", label: "Tài liệu" },
      {
        icon: <Headphones size={24} />,
        value: "tech-support",
        label: "Hỗ trợ kỹ thuật",
      },
    ],
  },
  Company: {
    name: "Company",
    items: [
      { icon: <Zap size={24} />, value: "about-us", label: "Về chúng tôi" },
      { icon: <Users size={24} />, value: "teams", label: "Nhân sự" },
    ],
  },
};

export default function NavbarItem() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleTabClick = (tab: string) =>
    setActiveTab((prev) => (prev === tab ? null : tab));

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

  // Lọc tab hiển thị
  const visibleTabs = Object.keys(menuData).filter(
    (tab) => isAdmin || menuData[tab].name !== "Admin"
  );

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* NAV BAR */}
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
        {visibleTabs.map((tab) => (
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
              "&:hover": { color: "#6a0dad", background: "transparent" },
            }}
          >
            {menuData[tab].name}
          </Button>
        ))}
      </Box>

      {/* DROPDOWN */}
      {activeTab && menuData[activeTab].name.length > 0 && (
        <Paper
          ref={dropdownRef}
          elevation={3}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "1200px",
            bgcolor: "#fff",
            py: 3,
            px: 6,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 50,
            animation: "fadeSlideIn 0.25s forwards",
            "@keyframes fadeSlideIn": {
              "0%": { opacity: 0, transform: "translateY(-10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{ gridColumn: "1 / -1", mb: 0.5, fontWeight: 600 }}
          >
            {menuData[activeTab].name}
            <Divider sx={{ my: 3 }} />
          </Typography>

          {menuData[activeTab].items.map((item) => (
            <Box
              key={item.label}
              onClick={() => setActiveTab(null)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ButtonLink
                leftIcon={
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.dark,
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                }
                url={item.value}
                text={item.label}
                variant="text"
              />
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
