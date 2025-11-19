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
        icon: <User size={24} />,
        label: "contact",
        image: Icon,
      },
      {
        value: "profile",
        icon: <Star size={24} />,
        label: "profile",
        image: Icon,
      },
      {
        value: "flight/info-page",
        icon: <Folder size={24} />,
        label: "flight/info-page",
        image: Icon,
      },
      {
        value: "hotels",
        icon: <DirectionsRunIcon />,
        label: "hotels",
        image: Icon,
      },
      {
        value: "ticket/search",
        icon: <DirectionsRunIcon />,
        label: "ticket/search",
        image: Icon,
      },
      {
        value: "FareComparison",
        icon: <DirectionsRunIcon />,
        label: "FareComparison",
        image: Icon,
      },
      {
        value: "Confirmation",
        icon: <DirectionsRunIcon />,
        label: "Confirmation",
        image: Icon,
      },
      {
        value: "FlightScheduleDashboard",
        icon: <DirectionsRunIcon />,
        label: "FlightScheduleDashboard",
        image: Icon,
      },
      {
        value: "SeatSelection",
        icon: <FlightClass />,
        label: "SeatSelection",
        image: Icon,
      },
      {
        value: "FlightMealList",
        icon: <FlightClass />,
        label: "FlightMealList",
        image: Icon,
      },
      {
        value: "flight/deals",
        icon: <Info size={24} />,
        label: "flight/deals",
        image: Icon,
      },
    ],
  },
  Admin: {
    name: "Admin",
    items: [
      { icon: <Building2 size={24} />, value: "admin", label: "admin" },
      {
        icon: <Folder size={24} />,
        value: "AttendancePage",
        label: "AttendancePage",
      },
      {
        icon: <Tag size={24} />,
        value: "discount-management",
        label: "discount-management",
      },
    ],
  },
  Solutions: {
    name: "Solutions",
    items: [
      {
        icon: <Headphones size={24} />,
        value: "hotel/Batch",
        label: "hotel/Batch",
        image: Icon,
      },
      {
        icon: <Star size={24} />,
        value: "TripSummary",
        label: "TripSummary",
        image: Icon,
      },
    ],
  },
  Pricing: {
    name: "Pricing",
    items: [
      { icon: <Tag size={24} />, value: "OrderMeal", label: "OrderMeal" },
      {
        icon: <Info size={24} />,
        value: "flight/dealsAcceppst",
        label: "flight/dealsAcceppst",
      },
    ],
  },
  Resources: {
    name: "Resources",
    items: [
      { icon: <Info size={24} />, value: "seat/select", label: "seat/select" },
      { icon: <Info size={24} />, value: "OrderTable", label: "OrderTable" },
      {
        icon: <Headphones size={24} />,
        value: "CreateRandomFlights",
        label: "CreateRandomFlights",
      },
    ],
  },
  Company: {
    name: "Company",
    items: [
      { icon: <Zap size={24} />, value: "select", label: "select" },
      {
        icon: <Users size={24} />,
        value: "flight/select",
        label: "flight/select",
      },
      {
        icon: <Zap size={24} />,
        value: "AdvancedAnalytics",
        label: "AdvancedAnalytics",
      },
    ],
  },
};
