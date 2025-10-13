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
  Home,
  Forum,
} from "@mui/icons-material";

type SideBarValueTypes =
  | "security"
  | "setting"
  | "sampleFileUploader"
  | "flight-book"
  | "airplane"
  | "airport"
  | "ticket"
  | "bookseat"
  | "manage/message"
  | "CreateGateForm"
  | "user"
  | "SeatLayout"
  | "message"
  | "flightSchedule"
  | "ChatApp"
  | "FlightStatisticsPage"
  | "hero"
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
  | "SendEmailToUsers"
  | "TicketSalesDashboard"
  | "airport-list"
  | "domestic"
  | "users"
  | "AircraftBatchCreator"
  | "flight_update"
  | "user-list"
  | "customers"
  | "unlock_request"
  | "facilities"
  | "TerminalContainer"
  | "BulkMealCreator"
  | "AirportManagementDetail"
  | "TerminalGateContainer"
  | "AirportManagement"
  | "TerminalGateContainer"
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
            label: "Tải file",
            icon: <AccountCircle />,
          },
          {
            id: "TerminalContainer",
            label: "Quản lý Terminal",
            icon: <Apartment />,
          },
          { id: "ChatApp", label: "Trò chuyện", icon: <Forum /> },
          {
            id: "TicketSalesDashboard",
            label: "Thống kê vé",
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
        id: "airports",
        label: "Sân bay",
        subItems: [
          {
            id: "airport-list",
            label: "Danh sách sân bay",
            subItems: [
              { id: "flightmeals", label: "Suất ăn", icon: <Restaurant /> },
              {
                id: "domestic",
                label: "Chuyến bay nội địa",
                icon: <FlightTakeoff />,
              },
              {
                id: "FlightStatisticsPage",
                label: "Thống kê chuyến bay",
                icon: <BarChart />,
              },
              { id: "bookticket", label: "Đặt vé", icon: <FlightTakeoff /> },
              {
                id: "international",
                label: "Chuyến bay quốc tế",
                icon: <FlightTakeoff />,
              },
              { id: "ChatApp", label: "Trò chuyện", icon: <Forum /> },
              { id: "hero", label: "Trang Hero", icon: <Home /> },
              {
                id: "sampleDatePicker",
                label: "Chọn ngày mẫu",
                icon: <OtherHousesTwoTone />,
              },
              {
                id: "payroll-management",
                label: "Quản lý lương",
                icon: <BusinessCenter />,
              },
              {
                id: "TerminalContainer",
                label: "Quản lý Terminal",
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
        id: "users",
        label: "Người dùng",
        subItems: [
          {
            id: "user-list",
            label: "Quản lý tài khoản",
            subItems: [
              {
                id: "flight-book",
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
