export type MenuItem = {
  id: string;
  label: string;
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
        { id: "sampleFileUploader", label: "Sample FileUploader" },
        { id: "sampleFormDemo", label: "Sample button" },
        { id: "sampleTimepicker", label: "Sample timepicker" },
        { id: "sampleButton", label: "Chuyến bay hôm nay" },
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
// {
//   id: "flights",
//   label: "Chuyến bay",
//   subItems: [
//     {
//       id: "flight-management",
//       label: "Quản lý",
//       subItems: [
//         { id: "all-flights", label: "Tất cả chuyến bay" },
//         { id: "schedule", label: "Lịch trình" },
//         { id: "food", label: "Thuc an" }
//       ]
//     }
//   ]
// },
// {
//   id: "tickets",
//   label: "Vé máy bay",
//   subItems: [
//     {
//       id: "ticket-ops",
//       label: "Chức năng",
//       subItems: [
//         { id: "book-ticket", label: "Đặt vé" },
//         { id: "ticket-history", label: "Lịch sử vé" }
//       ]
//     }
//       ]
//     }
//   ],
//   "tab2Items": [
//     {
//       "id": "airports",
//       "label": "Sân bay",
//       "subItems": [
//         {
//           "id": "airport-list",
//           "label": "Danh sách",
//           "subItems": [
//             { "id": "domestic", "label": "Nội địa" },
//             { "id": "international", "label": "Quốc tế" }
//           ]
//         }
//       ]
//     },
//     {
//       "id": "users",
//       "label": "Người dùng",
//       "subItems": [
//         {
//           "id": "user-list",
//           "label": "Tài khoản",
//           "subItems": [
//             { "id": "customers", "label": "Khách hàng" },
//             { "id": "staffs", "label": "Nhân viên" }
//           ]
//         }
//       ]
//     }
//   ]
// }
