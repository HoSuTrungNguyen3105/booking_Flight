import type { ReactNode } from "react";
import {
  AccountCircle,
  GppBad,
  WifiPasswordRounded,
  OtherHousesTwoTone,
  FlightTakeoff,
  Apartment,
  Groups,
  BusinessCenter,
  Email,
  Notifications,
  BarChart,
  Restaurant,
  Forum,
  TimeToLeave,
} from "@mui/icons-material";
import type { ROUTE_PATHS } from "../routers/RoutePath";

export type SideBarValueTypes = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export type MenuItem = {
  id: SideBarValueTypes;
  label: string;
  icon?: ReactNode;
  displayYn?: string;
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
        id: "/admin",
        label: "Tổng quan",
        subItems: [
          {
            id: "TerminalContainer",
            label: "Quản lý Terminal",
            icon: <Apartment />,
          },
          {
            id: "FlightManagement",
            label: "FlightManagement",
            icon: <BarChart />,
          },
          { id: "notifications", label: "Thông báo", icon: <Notifications /> },
          { id: "service", label: "Dịch vụ", icon: <WifiPasswordRounded /> },
          {
            id: "manage-my-info",
            label: "Thông tin cá nhân",
            icon: <AccountCircle />,
          },
          { id: "setting", label: "Cài đặt", icon: <OtherHousesTwoTone /> },
          {
            id: "payroll-management",
            label: "Quản lý lương",
            icon: <BusinessCenter />,
          },
          {
            id: "TerminalGateContainer",
            label: "Quản lý Gate",
            icon: <Apartment />,
          },
          { id: "CreateGateForm", label: "Tạo Gate", icon: <GppBad /> },
          {
            id: "BulkMealCreator",
            label: "Tạo suất ăn hàng loạt",
            icon: <Restaurant />,
          },
        ],
      },
    ],
  },
  {
    title: "Tab 2",
    items: [
      {
        id: "/admin",
        label: "Sân bay",
        subItems: [
          {
            id: "AirportManagement",
            label: "Danh sách sân bay",
            subItems: [
              { id: "meals", label: "Suất ăn", icon: <Restaurant /> },
              {
                id: "domestic",
                label: "Chuyến bay nội địa",
                icon: <FlightTakeoff />,
              },
              { id: "bookticket", label: "Đặt vé", icon: <FlightTakeoff /> },
              {
                id: "international",
                label: "Chuyến bay quốc tế",
                icon: <FlightTakeoff />,
              },
              {
                id: "TransferAdminTable",
                label: "Quảnê lý Terminal",
              },
              {
                id: "LeaveRequestTable",
                label: "Leave Request Table",
                icon: <TimeToLeave />,
              },
              // {
              //   id: "FlightStatisticsPage",
              //   label: "FlightStatisticsPage",
              //   icon: <BusinessCenter />,
              // },
              {
                id: "FlightBatchCreator",
                label: "Quản lý FlightBatchCreator",
                icon: <Apartment />,
              },
              {
                id: "AirportManagementDetail",
                label: "Chi tiết sân bay",
                icon: <Apartment />,
              },
              {
                id: "AirportManagement",
                label: "Quản lý sân bay",
                icon: <Apartment />,
              },
            ],
          },
        ],
      },
      {
        id: "SendEmailToUsers",
        label: "Người dùng",
        subItems: [
          {
            id: "/dashboard",
            label: "Quản lý tài khoản",
            subItems: [
              {
                id: "support",
                label: "Khách hàng",
                icon: <AccountCircle />,
              },
              {
                id: "unlock_request",
                label: "Yêu cầu mở khóa",
                icon: <GppBad />,
              },
              { id: "special", label: "Nhân viên", icon: <Groups /> },
              { id: "message", label: "Tin nhắn", icon: <Forum /> },
              { id: "aircraft", label: "Máy bay", icon: <FlightTakeoff /> },
              { id: "SendEmailToUsers", label: "Gửi email", icon: <Email /> },
            ],
          },
        ],
      },
    ],
  },
];
