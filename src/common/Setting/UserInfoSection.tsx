import { Box, FormControl, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { UserData } from "../../utils/type";
import InputTextField from "../Input/InputTextField";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";

interface IUserInfoSectionProps {
  myInfo?: UserData;
  onChange: (field: keyof UserData, value: string) => void;
}

const UserInfoSection = ({ myInfo, onChange }: IUserInfoSectionProps) => {
  return (
    <Box
      sx={{
        paddingBottom: "8px",
        height: "500px",
        overflow: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "8px 12px",
          borderBottom: 1,
          borderColor: "grey.200",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography component="p" variant="overline">
          내 정보 관리
        </Typography>
        <Typography variant="body2" color="grey.500">
          자신의 입력 정보를 확인하고 권한 관련 등록, 주요 서비스 유형, 로그인
          시간, 생성 시간등을 확인할 수 있습니다.
        </Typography>
      </Box>

      <Box
        sx={{
          margin: 1,
          border: 1,
          borderColor: "grey.200",
          backgroundColor: "white",
          padding: "8px 12px",
        }}
      >
        <Stack spacing={2} sx={{ width: "384px" }}>
          {/* 아이디 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              아이디
            </Typography>
            <InputTextField value={myInfo?.email} disabled />
          </FormControl>

          {/* 인증 방식 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              인증 방식
            </Typography>
            <InputTextField value={myInfo?.authType} disabled />
          </FormControl>

          {/* 권한 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              권한
            </Typography>
            <InputTextField value={myInfo?.role} disabled />
          </FormControl>

          {/* 이름 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              이름
            </Typography>
            <InputTextField
              value={formatDateKR(
                DateFormatEnum.MMMM_D_YYYY_HH_MM_SS,
                myInfo?.hireDate
              )}
              disabled
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              아이디
            </Typography>
            <InputTextField value={myInfo?.rank} disabled />
          </FormControl>

          {/* 이름 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              baseSalary 이름
            </Typography>
            <InputTextField value={String(myInfo?.baseSalary)} disabled />
          </FormControl>

          {/* 이름 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              name 이름
            </Typography>
            <InputTextField
              value={myInfo?.name}
              onChange={(val) => onChange("name", val)}
            />
          </FormControl>

          {/* 닉네임 (선택) */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              userAlias 닉네임 (선택)
            </Typography>
            <InputTextField
              value={myInfo?.userAlias}
              onChange={(val) => onChange("userAlias", val)}
            />
          </FormControl>

          {/* 닉네임 (선택) */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              phone 닉네임 (선택)
            </Typography>
            <InputTextField
              value={myInfo?.phone}
              onChange={(val) => onChange("phone", val)}
            />
          </FormControl>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(UserInfoSection);
