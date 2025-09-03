import type { ReactNode } from "react";
import { AccountCircle } from "@mui/icons-material";
import GppBadIcon from "@mui/icons-material/GppBad";
import WifiPasswordRoundedIcon from "@mui/icons-material/WifiPasswordRounded";
import OtherHousesTwoToneIcon from "@mui/icons-material/OtherHousesTwoTone";

type SideBarValueTypes =
  | "security"
  | "setting"
  | "sampleFileUploader"
  | "flight"
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
  | "flightmeals"
  | "airplaneSchedule"
  | "airplaneTicket"
  | "airplaneUser"
  | "international"
  | "overview"
  | "food"
  | "sampleTimepicker"
  | "manage-my-info"
  | "hero"
  | "airports"
  | "airport-list"
  | "domestic"
  | "users"
  | "user-list"
  | "customers"
  | "staffs";

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
          {
            id: "sampleTimepicker",
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
              { id: "international", label: "Quốc tế" },
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
              { id: "customers", label: "Khách hàng" },
              { id: "bookseat", label: "Đặt chỗ" },
              { id: "hero", label: "Nhân viên" },
            ],
          },
        ],
      },
    ],
  },
];
