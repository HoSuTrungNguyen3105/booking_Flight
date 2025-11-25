import { User, Star, Folder, Info, Tag, Users, Headphones } from "lucide-react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Building2, Zap } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "../svgs/Huongdan_muave_Thumb.webp";
import {
  FlightClass,
  PermScanWifiSharp,
  SetMealOutlined,
} from "@mui/icons-material";
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

import { ROUTE_PATHS } from "../routers/RoutePath";

export const menuData: TabData = {
  Customers: {
    name: "Customers",
    items: [
      {
        value: "contact",
        icon: <User size={24} />,
        label: "Contact Us",
        image: Icon,
      },
      {
        value: "profile",
        icon: <Star size={24} />,
        label: "My Profile",
        image: Icon,
      },
      {
        value: "flight/info-page",
        icon: <Folder size={24} />,
        label: "Flight Info",
        image: Icon,
      },
      {
        value: "hotels",
        icon: <DirectionsRunIcon />,
        label: "Hotels",
        image: Icon,
      },
      {
        value: "ticket/search",
        icon: <DirectionsRunIcon />,
        label: "Search Tickets",
        image: Icon,
      },
      {
        value: "BookingDemo",
        icon: <DirectionsRunIcon />,
        label: "Booking Demo",
        image: Icon,
      },
      {
        value: "SomeComponent",
        icon: <DirectionsRunIcon />,
        label: "Some Component",
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
        label: "Flight Schedule",
        image: Icon,
      },
      {
        value: "SeatSelection",
        icon: <SetMealOutlined />,
        label: "Seat Selection",
        image: Icon,
      },
      {
        value: "FlightMealList",
        icon: <FlightClass />,
        label: "Flight Meals",
        image: Icon,
      },
      {
        value: "flight/deals",
        icon: <Info size={24} />,
        label: "Flight Deals",
        image: Icon,
      },
      {
        icon: <PermScanWifiSharp />,
        value: "PermissionPage",
        label: "PermissionPage",
      },
      {
        icon: <PermScanWifiSharp />,
        value: "PermissionMatrix",
        label: "PermissionMatrix",
      },
      {
        icon: <PermScanWifiSharp />,
        value: "PermissionSettings",
        label: "PermissionSettings",
      },
      {
        icon: <PermScanWifiSharp />,
        value: "PermissionAdminSettings",
        label: "PermissionAdminSettings",
      },
    ],
  },
  Admin: {
    name: "Admin",
    items: [
      {
        icon: <Building2 size={24} />,
        value: ROUTE_PATHS.ADMIN.replace("/", ""),
        label: "Admin Dashboard",
      },
      {
        icon: <Folder size={24} />,
        value: "AttendancePage",
        label: "Attendance",
      },
      {
        icon: <Tag size={24} />,
        value: "discount-management",
        label: "Discount Management",
      },
    ],
  },
  Solutions: {
    name: "Solutions",
    items: [
      {
        icon: <Headphones size={24} />,
        value: "hotel/Batch",
        label: "Hotel Batch",
        image: Icon,
      },
      {
        icon: <Star size={24} />,
        value: "TripSummary",
        label: "Trip Summary",
        image: Icon,
      },
    ],
  },
  Pricing: {
    name: "Pricing",
    items: [
      { icon: <Tag size={24} />, value: "OrderMeal", label: "Order Meal" },
      {
        icon: <Info size={24} />,
        value: "flight/dealsAcceppst",
        label: "Flight Deals Accepted",
      },
    ],
  },
  Resources: {
    name: "Resources",
    items: [
      { icon: <Info size={24} />, value: "seat/select", label: "Select Seat" },
      { icon: <Info size={24} />, value: "OrderTable", label: "Order Table" },
      {
        icon: <Headphones size={24} />,
        value: "CreateRandomFlights",
        label: "Create Random Flights",
      },
      {
        value: "DiscountBatchCreator",
        icon: <DirectionsRunIcon />,
        label: "Discount Batch Creator",
        image: Icon,
      },
    ],
  },
  Company: {
    name: "Company",
    items: [
      { icon: <Zap size={24} />, value: "select", label: "Select" },
      {
        icon: <Users size={24} />,
        value: "flight/select",
        label: "Select Flight",
      },
      {
        icon: <Zap size={24} />,
        value: "AdvancedAnalytics",
        label: "Advanced Analytics",
      },
    ],
  },
};
