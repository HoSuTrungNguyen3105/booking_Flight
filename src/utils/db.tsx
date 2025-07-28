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
  | "user"
  | "flightSchedule"
  | "flightStatus"
  | "flightManagement"
  | "airplaneManagement"
  | "airplaneType"
  | "airplaneStatus"
  | "airplaneSchedule"
  | "airplaneTicket"
  | "airplaneUser"
  | "international"
  | "overview"
  | "food"
  | "sampleTimepicker"
  | "sampleButton"
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
          { id: "sampleButton", label: "Chuyến bay hôm nay" },
          { id: "hero", label: "Bảng mẫu", icon: <OtherHousesTwoToneIcon /> },
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
              { id: "staffs", label: "Nhân viên" },
            ],
          },
        ],
      },
    ],
  },
];
