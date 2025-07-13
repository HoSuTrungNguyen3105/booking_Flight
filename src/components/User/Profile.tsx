import { Box, Grid as MuiGrid, Typography } from "@mui/material";
import InputField from "../../common/Input/InputField";
import { Button } from "../../common/Button/Button";

const ConnectedFourBoxes = () => {
  const inspectionData = {
    TITLE: "25.6.13 오전 1:30 - 데이터, 모델, AI 서비스 범위 점검 정보",
    status: "미완료",
    time: "25.6.13 오전 1:30",
    inspector: "ID_HONG",
    dataStatus: ["데이터  19/30", "데이터 1/30", "데이터: 0/30"],
    completeTime: "25.6.13 오전 2:30",
    text: "데이터 오염 점검의 의미: ... 데이터 오염 점검 오류시 아래와 같은 문제가 발생할 수 있습니다.",
    content: "데이터 오염 점검의 의미 ....",
    checkTime: "자동 배정",
    itemStatusLeft: "모델 20/30, AI 서비스 10/10, 모델 20/30",
    itemStatusRight: "AI RED 10/15, 총 자동 점검 60/60, 기타 10/15",
    detail1: ["해당 파일 확인하기", "점검하기", "문제 해결하기"],
    detail2: [],
  };

  return (
    <MuiGrid container spacing={2} sx={{ mb: 2 }}>
      {/* Row 1 */}
      <MuiGrid size={3}>
        <Typography variant="caption" color="text.secondary">
          검사 상태
        </Typography>
        <Typography variant="body2">{inspectionData.status}</Typography>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              시작 시간
            </Typography>
            <Typography variant="body2">{inspectionData.time}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              검토자
            </Typography>
            <Typography variant="body2">{inspectionData.inspector}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              점검 제목
            </Typography>
            <Typography variant="body2">{inspectionData.TITLE}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      {/* Row 2 */}
      <MuiGrid size={3}>
        <Typography variant="caption" color="text.secondary">
          데이터 상태
        </Typography>
        <Typography variant="body2">
          {inspectionData.dataStatus.join(", ")}
        </Typography>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              완료 시간
            </Typography>
            <Typography variant="body2">
              {inspectionData.completeTime}
            </Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              체크 시간
            </Typography>
            <Typography variant="body2">{inspectionData.checkTime}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              점검 설명
            </Typography>
            <Typography variant="body2">{inspectionData.content}</Typography>
          </Box>
        </Box>
      </MuiGrid>
      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          {/* <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          /> */}
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              완료 시간
            </Typography>
            <Typography variant="body2">
              {inspectionData.completeTime}
            </Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          <Box
            sx={{
              height: "auto", // co theo nội dung
              width: "1px",
              backgroundColor: "grey.200",
              mr: 1,
              borderRadius: "1px",
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              체크 시간
            </Typography>
            <Typography variant="body2">{inspectionData.checkTime}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={5}>
        <Box display="flex" width="100%">
          {/* Border đen bên trái */}
          <Box
            sx={{
              height: "auto", // co theo nội dung
              width: "1px",
              backgroundColor: "grey.200",
              borderRadius: "1px",
              mr: 2,
            }}
          />

          {/* Nội dung chính */}
          <Box display="flex" flexDirection="column">
            {/* Tiêu đề và mô tả */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              점검 설명
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {inspectionData.content}
            </Typography>

            {/* Input + Button layout */}
            <Box display="flex" justifyContent="space-between" width="100%">
              {/* Input bên trái */}
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                flex={1}
                mr={2}
              >
                <InputField />
                <InputField />
                <InputField />
                <InputField />
                <InputField />
              </Box>

              {/* Button bên phải, căn dưới */}
              <Box display="flex" alignItems="flex-end">
                <Button label="Button" />
              </Box>
            </Box>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          {/* <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          /> */}
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              점검 설명
            </Typography>
            <Typography variant="body2">{inspectionData.content}</Typography>
          </Box>
        </Box>
      </MuiGrid>

      <MuiGrid size={3}>
        <Box width={"100%"} display="flex" justifyContent="flex-start">
          {/* <Box
            sx={{
              width: "1px",
              height: "auto", // co theo nội dung
              backgroundColor: "black",
              mr: 1,
              borderRadius: "1px",
            }}
          /> */}
          <Box flexDirection={"column"} display={"flex"}>
            <Typography variant="caption" color="text.secondary">
              점검 설명
            </Typography>
            <Typography variant="body2">{inspectionData.content}</Typography>
          </Box>
        </Box>
      </MuiGrid>
    </MuiGrid>
  );
};

export default ConnectedFourBoxes;
