import { Box, Typography } from "@mui/material";
import { memo } from "react";

const DataAccessPermissionSection = () => {
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "10px 16px",
          border: 1,
          borderColor: "grey.200",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <Typography component="p" variant="subtitle1">
          데이터 조회 권한
        </Typography>
        <Typography variant="body2" color="grey.500">
          현재 확인할 수 있는 코드 내역입니다.
        </Typography>
      </Box>

      <Box
        sx={{
          margin: 1,
          border: 1,
          borderColor: "grey.200",
          backgroundColor: "white",
        }}
      >
        <Typography component="p" p={1} variant="body2">
          서비스 유형
        </Typography>
        {["TODO: Add service types here"].map((serviceType, index) => (
          <Typography
            key={index}
            component="p"
            variant="body2"
            p={1}
            borderTop={1}
          >
            {serviceType}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default memo(DataAccessPermissionSection);
