import { User, Star, Folder, Info, Tag, Users, Headphones } from "lucide-react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Building2, Zap } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "../svgs/Huongdan_muave_Thumb.webp";
import { FlightClass } from "@mui/icons-material";
type MenuItemProps = {
  value: string; // route string
  icon: ReactNode;
  label: string;
  image?: string;
};

type TabSection = {
  name: string;
  items: MenuItemProps[];
  image?: string;
};

export type TabData = Record<string, TabSection>;

export const menuData: TabData = {
  Customers: {
    name: "Customers",
    items: [
      {
        value: "contact",
        icon: <User size={24} color="#6a1b9a" strokeWidth={1.5} />,
        label: "Hồ sơ khách hàng",
        image: Icon,
      },
      {
        value: "profile",
        icon: <Star size={24} />,
        label: "Đánh giá khách hàng",
        image: Icon,
      },
      {
        value: "flight/info-page",
        icon: <Folder size={24} />,
        label: "Lưu trữ hồ sơ",
        image: Icon,
      },
      {
        value: "hotels",
        icon: <DirectionsRunIcon />,
        label: "Hướng dẫn sử dụng",
        image: Icon,
      },
      {
        value: "SeatSelection",
        icon: <FlightClass />,
        label: "SeatSelection",
        image: Icon,
      },
      {
        value: "flight/deals",
        icon: <Info size={24} />,
        label: "Trung tâm hỗ trợ",
        image: Icon,
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
        image: Icon,
      },
      {
        icon: <Star size={24} />,
        value: "TripSummary",
        label: "Chính sách hạng vé",
        image: Icon,
      },
    ],
  },
  Pricing: {
    name: "Pricing",
    items: [
      { icon: <Tag size={24} />, value: "OrderMeal", label: "Bảng giá" },
      {
        icon: <Info size={24} />,
        value: "flight/dealsAcceppst",
        label: "Điều khoản /flight/dealsAcceppst",
      },
    ],
  },
  Resources: {
    name: "Resources",
    items: [
      { icon: <Info size={24} />, value: "seat/select", label: "Tài liệu" },
      {
        icon: <Headphones size={24} />,
        value: "CreateRandomFlights",
        label: "Hỗ trợ kỹ thuật",
      },
    ],
  },
  Company: {
    name: "Company",
    items: [
      { icon: <Zap size={24} />, value: "select", label: "Về chúng tôi" },
      { icon: <Users size={24} />, value: "flight/select", label: "Nhân sự" },
    ],
  },
};
