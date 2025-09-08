import { Box, Button, FormControl, Stack, Typography } from "@mui/material";
import { memo, useState } from "react";
import type { UserData } from "../../utils/type";
import InputTextField from "../Input/InputTextField";
import { FileUpload } from "../FileUploader";
import { INPUT_TYPE, type TFileUploader } from "../FileUploader/type";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";

interface IUserInfoSectionProps {
  myInfo?: UserData;
  onChange: (field: keyof UserData, value: string) => void;
  handleUploadFile: (files: TFileUploader[]) => void;
}

const UserInfoSection = ({
  myInfo,
  onChange,
  handleUploadFile,
}: IUserInfoSectionProps) => {
  return (
    <Box sx={{ paddingBottom: "8px" }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "8px 12px",
          border: 1,
          borderColor: "grey.200",
          borderLeft: "none",
          borderRight: "none",
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
              이름
            </Typography>
            <InputTextField value={String(myInfo?.baseSalary)} disabled />
          </FormControl>

          {/* 이름 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              이름
            </Typography>
            <InputTextField
              value={myInfo?.name}
              onChange={(val) => onChange("name", val)}
            />
          </FormControl>

          {/* 닉네임 (선택) */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              닉네임 (선택)
            </Typography>
            <InputTextField
              value={myInfo?.userAlias}
              onChange={(val) => onChange("userAlias", val)}
            />
          </FormControl>

          {/* 이름 */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              이름
            </Typography>
            <InputTextField
              value={myInfo?.passport}
              onChange={(val) => onChange("passport", val)}
            />
          </FormControl>

          {/* 닉네임 (선택) */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              닉네임 (선택)
            </Typography>
            <InputTextField
              value={myInfo?.phone}
              onChange={(val) => onChange("phone", val)}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              이미지 (선택)
            </Typography>
            <FileUpload
              name="productImage"
              onChange={(files) => handleUploadFile(files)}
              accept=".jpg,.png"
              maxFiles={5}
              maxSize="10 MB"
              inputType={INPUT_TYPE.THUMBNAIL}
            />
          </FormControl>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(UserInfoSection);
