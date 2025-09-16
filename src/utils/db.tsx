import type { ReactNode } from "react";
import { AccountCircle } from "@mui/icons-material";
import GppBadIcon from "@mui/icons-material/GppBad";
import WifiPasswordRoundedIcon from "@mui/icons-material/WifiPasswordRounded";
import OtherHousesTwoToneIcon from "@mui/icons-material/OtherHousesTwoTone";

type SideBarValueTypes =
  | "security"
  | "setting"
  | "sampleFileUploader"
  | "flight-book"
  | "airplane"
  | "airport"
  | "ticket"
  | "bookseat"
  | "user"
  | "flightSchedule"
  | "flightStatus"
  | "flightManagement"
  | "airplaneManagement"
  | "airplaneType"
  | "aircraft"
  | "flightmeals"
  | "airplaneSchedule"
  | "airplaneTicket"
  | "service"
  | "international"
  | "overview"
  | "food"
  | "bookticket"
  | "sampleTimepicker"
  | "manage-my-info"
  | "special"
  | "data-secure"
  | "airports"
  | "airport-list"
  | "domestic"
  | "users"
  | "flight_update"
  | "user-list"
  | "customers"
  | "unlock_request"
  | "notifications"
  | "sampleDatePicker"
  | "payroll-management";

export type MenuItem = {
  id: SideBarValueTypes;
  label: string;
  icon?: ReactNode;
  displayYn?: string; // hoặc SideBarValueTypes nếu có định nghĩa
  adminOnly?: boolean;
  visible?: boolean;
  path?: string;
  subItems?: MenuItem[];
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export const menuData: MenuSection[] = [
  {
    title: "Tab 1",
    items: [
      {
        id: "overview",
        label: "Tổng quan",
        subItems: [
          {
            id: "sampleFileUploader",
            label: "FileUploader",
            icon: <AccountCircle />,
          },
          { id: "food", label: "Button", icon: <GppBadIcon /> },
          { id: "notifications", label: "notifications", icon: <GppBadIcon /> },
          {
            id: "service",
            label: "Timepicker",
            icon: <WifiPasswordRoundedIcon />,
          },
          {
            id: "manage-my-info",
            label: "Chuyến bay hôm nay",
            icon: <GppBadIcon />,
          },
          {
            id: "setting",
            label: "Bảng mẫu",
            icon: <OtherHousesTwoToneIcon />,
          },
        ],
      },
    ],
  },
  {
    title: "Tab 2",
    items: [
      {
        id: "airports",
        label: "Sân bay",
        subItems: [
          {
            id: "airport-list",
            label: "Danh sách",
            subItems: [
              { id: "flightmeals", label: "Nhân viên" },
              { id: "domestic", label: "Nội địa" },
              { id: "bookticket", label: "book ticket" },
              { id: "international", label: "Quốc tế" },
              { id: "sampleDatePicker", label: "secure" },
              { id: "payroll-management", label: "Quản lý bảng lương" },
            ],
          },
        ],
      },
      {
        id: "users",
        label: "Người dùng",
        subItems: [
          {
            id: "user-list",
            label: "Tài khoản",
            subItems: [
              { id: "flight-book", label: "Khách hàng" },
              { id: "unlock_request", label: "Đặt chỗ" },
              { id: "special", label: "Nhân viên" },
              { id: "aircraft", label: "aircraft" },
            ],
          },
        ],
      },
    ],
  },
];
