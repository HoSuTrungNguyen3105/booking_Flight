import { User, Star, Folder, Info, Tag, Users, Headphones } from "lucide-react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Building2, Zap } from "lucide-react";
import type { ReactNode } from "react";

type MenuItemProps = {
  value: string; // route string
  icon: ReactNode;
  label: string;
};

type TabSection = {
  name: string;
  items: MenuItemProps[];
};

export type TabData = Record<string, TabSection>;

// type MenuItemProps = {
//   value: string;
//   icon: ReactNode;
//   label: string;
// };

// type MenuItem = {
//     name: string;
//   columns: Array<{
//     title: string;
//     items: MenuItemProps[];
//   }>;
//   specialItems: string[];
// };

// type TabData = {
//   [key: string]: {
//     name: string;
//     items: MenuItem[];
//   };
// };

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
        label: "Quản lý hotel batch",
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
