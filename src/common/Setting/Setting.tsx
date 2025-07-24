// import React from "react";
// import {
//   Box,
//   Typography,
//   Divider,
//   Switch,
//   FormControlLabel,
// } from "@mui/material";
// import Android12Switch from "../Switch/Switch";

// const Setting = () => {
//   const [darkMode, setDarkMode] = React.useState(false);
//   const [notifications, setNotifications] = React.useState(true);

//   return (
//     <Box>
//       <Typography variant="h3" gutterBottom>
//         Cài đặt
//       </Typography>
//       <Divider sx={{ my: 3 }} />
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="subtitle1">Giao diện</Typography>
//         {<Android12Switch hasLabel labelOn="Night" labelOff="Day" />}
//       </Box>
//       <Divider sx={{ my: 3 }} />
//       <Box>
//         <Typography variant="subtitle1">Thông báo</Typography>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={notifications}
//               onChange={(e) => setNotifications(e.target.checked)}
//             />
//           }
//           label="Bật thông báo"
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Setting;
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Android12Switch from "../Switch/Switch";
import { PlainSwitch } from "../Switch/PlainSwitch";
import { LanguageDropdown } from "../Dropdown/Changelng";

const Setting = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState("en");
  const [autoDelete, setAutoDelete] = React.useState(false);
  const [bookingCount, setBookingCount] = React.useState(12); // ví dụ giả lập

  const handleCancelAll = () => {
    // xử lý hủy tất cả booking
    setBookingCount(0);
  };

  const handleSyncBooking = () => {
    // xử lý đồng bộ dữ liệu booking
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cài đặt hệ thống
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Giao diện */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Giao diện</Typography>
        <Android12Switch
          hasLabel
          labelOn="Tối"
          labelOff="Sáng"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
        <PlainSwitch />
      </Box>

      {/* Ngôn ngữ */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Ngôn ngữ</Typography>
        <LanguageDropdown />
        {/* <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ mt: 1, width: 200 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="vi">Tiếng Việt</MenuItem>
          <MenuItem value="ja">日本語</MenuItem>
        </Select> */}
      </Box>

      {/* Thông báo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Thông báo</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Bật thông báo"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Booking */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Quản lý đặt vé</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Số lượng booking đã lưu: {bookingCount}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={autoDelete}
              onChange={(e) => setAutoDelete(e.target.checked)}
            />
          }
          label="Tự động xoá booking quá hạn"
        />

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelAll}
            disabled={bookingCount === 0}
          >
            Hủy tất cả booking
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSyncBooking}
          >
            Đồng bộ dữ liệu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Setting;
