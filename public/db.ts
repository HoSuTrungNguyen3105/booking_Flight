export type SideBarValueTypes =
  | "security"
  | "setting"
  | "dashboard"
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
  | "airplaneUser";
export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  displayYn?: SideBarValueTypes;
  adminOnly?: boolean;
  visible?: boolean;
  path?: string;
  subItems?: MenuItem[];
};

export type MenuData = {
  tab1Items: MenuItem[];
  tab2Items: MenuItem[];
};

export const menuData: MenuData = {
  tab1Items: [
    {
      id: "overview",
      label: "Tổng quan",
      subItems: [
        { id: "sampleFileUploader", label: "FileUploader" },
        { id: "food", label: "Button" },
        { id: "sampleTimepicker", label: "Timepicker" },
        { id: "sampleButton", label: "Chuyến bay hôm nay" },
        { id: "hero", label: "Bảng mẫu" },
      ],
    },
  ],
  tab2Items: [
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
};
