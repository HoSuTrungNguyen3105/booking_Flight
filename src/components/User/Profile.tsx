import { Box, Typography } from "@mui/material";

const ConnectedFourBoxes = () => {
  // Dữ liệu cho 2 nhóm (2 cặp Box)
  const groups = [
    {
      left: [
        { label: "점검 상태", value: "미완료", color: "error" },
        { label: "점검 시간", value: "25.6.13 오전 1:30" },
      ],
      right: [
        { label: "점검자", value: "ID_HONG" },
        { label: "자동 점검", value: "60 / 60" },
      ],
    },
    {
      left: [
        { label: "AI 서비스", value: "완료" },
        { label: "기타", value: "-" },
      ],
      right: [
        { label: "모델 검사", value: "진행중" },
        { label: "검사 레벨", value: "중" },
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        backgroundColor: "white",
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {groups.map((group, groupIndex) => (
        <Box
          key={groupIndex}
          sx={{
            flex: 1,
            px: 2,
            borderRight:
              groupIndex < groups.length - 1 ? "1px solid #E0E0E0" : "none",
            boxSizing: "border-box",
          }}
        >
          {/* Hàng 1 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #E0E0E0",
              pb: 2,
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {group.left[0].label}
              </Typography>
              <Typography
                variant="body1"
                color={group.left[0].color || "textPrimary"}
              >
                {group.left[0].value}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, pl: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {group.right[0].label}
              </Typography>
              <Typography
                variant="body1"
                color={group.right[0].color || "textPrimary"}
              >
                {group.right[0].value}
              </Typography>
            </Box>
          </Box>

          {/* Hàng 2 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {group.left[1].label}
              </Typography>
              <Typography
                variant="body1"
                color={group.left[1].color || "textPrimary"}
              >
                {group.left[1].value}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, pl: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {group.right[1].label}
              </Typography>
              <Typography
                variant="body1"
                color={group.right[1].color || "textPrimary"}
              >
                {group.right[1].value}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ConnectedFourBoxes;
