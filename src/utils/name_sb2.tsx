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
  Security,
  AirplanemodeActive,
  Hotel,
  CalendarMonth,
  LockOpen,
} from "@mui/icons-material";
import { FaSeedling } from "react-icons/fa";
import { ROUTE_PATHS } from "../routers/RoutePath";

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
    title: "Quản trị hệ thống",
    items: [
      {
        id: ROUTE_PATHS.ADMIN,
        label: "Tổng quan Admin",
        subItems: [
          {
            id: ROUTE_PATHS.FLIGHTMANAGE,
            label: "Quản lý chuyến bay",
            icon: <BarChart />,
          },
          {
            id: ROUTE_PATHS.TERMINAL_CONTAINER,
            label: "Quản lý Terminal",
            icon: <Apartment />,
          },
          {
            id: ROUTE_PATHS.TERMINAL_GATE_CONTAINER,
            label: "Quản lý Gate",
            icon: <Apartment />,
          },
          {
            id: ROUTE_PATHS.PAYROLL_MANAGEMENT,
            label: "Quản lý bảng lương",
            icon: <BusinessCenter />,
          },
          {
            id: ROUTE_PATHS.PERMISSION,
            label: "Quản lý phân quyền",
            icon: <Security />,
          },
          {
            id: ROUTE_PATHS.NOTIFICATIONS,
            label: "Thông báo",
            icon: <Notifications />,
          },
          {
            id: ROUTE_PATHS.SERVICE,
            label: "Dịch vụ & tiện ích",
            icon: <WifiPasswordRounded />,
          },
          {
            id: ROUTE_PATHS.SETTING,
            label: "Cài đặt hệ thống",
            icon: <OtherHousesTwoTone />,
          },
        ],
      },
    ],
  },
  {
    title: "Quản lý sân bay & chuyến bay",
    items: [
      {
        id: ROUTE_PATHS.DASHBOARD,
        label: "Quản lý sân bay",
        subItems: [
          {
            id: ROUTE_PATHS.AIRPORT_MANAGEMENT,
            label: "Danh sách sân bay",
            icon: <AirplanemodeActive />,
          },
          {
            id: ROUTE_PATHS.DOMESTIC,
            label: "Chuyến bay nội địa",
            icon: <FlightTakeoff />,
          },
          {
            id: ROUTE_PATHS.INTERNATIONAL,
            label: "Chuyến bay quốc tế",
            icon: <FlightTakeoff />,
          },
          {
            id: ROUTE_PATHS.BOOK_TICKET,
            label: "Đặt vé máy bay",
            icon: <FlightTakeoff />,
          },
          {
            id: ROUTE_PATHS.FLIGHT_BATCH_CREATOR,
            label: "Tạo chuyến bay hàng loạt",
            icon: <Apartment />,
          },
        ],
      },
    ],
  },
  {
    title: "Quản lý người dùng & nhân sự",
    items: [
      {
        id: ROUTE_PATHS.SEND_EMAIL_TO_USERS,
        label: "Quản lý người dùng",
        subItems: [
          {
            id: ROUTE_PATHS.SPECIAL,
            label: "Quản lý nhân viên",
            icon: <Groups />,
          },
          {
            id: ROUTE_PATHS.MANAGE_MY_INFO,
            label: "Thông tin cá nhân",
            icon: <AccountCircle />,
          },
          {
            id: ROUTE_PATHS.CALENDER_ATTENDANCE,
            label: "Lịch chấm công",
            icon: <CalendarMonth />,
          },
          {
            id: ROUTE_PATHS.LEAVE_REQUEST_TABLE,
            label: "Yêu cầu nghỉ phép",
            icon: <TimeToLeave />,
          },
          {
            id: ROUTE_PATHS.UNLOCK_REQUEST,
            label: "Yêu cầu mở khóa",
            icon: <LockOpen />,
          },
          {
            id: ROUTE_PATHS.SEND_EMAIL_TO_USERS,
            label: "Gửi email người dùng",
            icon: <Email />,
          },
          {
            id: ROUTE_PATHS.MESSAGE,
            label: "Tin nhắn",
            icon: <Forum />,
          },
        ],
      },
    ],
  },
  {
    title: "Dịch vụ & tiện ích",
    items: [
      {
        id: ROUTE_PATHS.SERVICE,
        label: "Dịch vụ",
        subItems: [
          {
            id: ROUTE_PATHS.FLIGHT_MEALS,
            label: "Quản lý suất ăn",
            icon: <Restaurant />,
          },
          {
            id: ROUTE_PATHS.BULK_MEAL_CREATOR,
            label: "Tạo suất ăn hàng loạt",
            icon: <Restaurant />,
          },
          {
            id: ROUTE_PATHS.CREATE_HOTELS,
            label: "Quản lý khách sạn",
            icon: <Hotel />,
          },
          {
            id: ROUTE_PATHS.AIRCRAFT,
            label: "Quản lý máy bay",
            icon: <FlightTakeoff />,
          },
        ],
      },
    ],
  },
  {
    title: "Công cụ quản trị",
    items: [
      {
        id: ROUTE_PATHS.ADMIN,
        label: "Công cụ hệ thống",
        subItems: [
          {
            id: ROUTE_PATHS.SEED_PERMISSIONS,
            label: "Khởi tạo phân quyền",
            icon: <FaSeedling />,
          },
          {
            id: ROUTE_PATHS.TRANSFER_ADMIN,
            label: "Chuyển quyền Admin",
            icon: <GppBad />,
          },
          {
            id: ROUTE_PATHS.TERMINAL_BATCH_CREATOR,
            label: "Tạo Terminal hàng loạt",
            icon: <Apartment />,
          },
          {
            id: ROUTE_PATHS.MANAGEMENT_ATTENDANCE,
            label: "Quản lý chấm công",
            icon: <CalendarMonth />,
          },
        ],
      },
    ],
  },
];
