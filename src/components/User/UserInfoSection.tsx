import { Box, FormControl, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { UserData } from "../../utils/type";
import InputTextField from "../../common/Input/InputTextField";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import { useTranslation } from "react-i18next";

interface IUserInfoSectionProps {
  myInfo?: UserData;
  onChange: (field: keyof UserData, value: string) => void;
}

const UserInfoSection = ({ myInfo, onChange }: IUserInfoSectionProps) => {
  const { t } = useTranslation();

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
          {t("myInfo")}
        </Typography>
        <Typography variant="body2" color="grey.500">
          {t("myInfoDesc")}
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
          {/* Email */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("email")}
            </Typography>
            <InputTextField value={myInfo?.email} disabled />
          </FormControl>

          {/* Auth Type */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("authType")}
            </Typography>
            <InputTextField value={myInfo?.authType} disabled />
          </FormControl>

          {/* Role */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("role")}
            </Typography>
            <InputTextField value={myInfo?.role} disabled />
          </FormControl>

          {/* Hire Date */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("hireDate")}
            </Typography>
            <InputTextField
              value={formatDateKR(
                DateFormatEnum.MMMM_D_YYYY_HH_MM_SS,
                myInfo?.hireDate
              )}
              disabled
            />
          </FormControl>

          {/* Rank */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("rank")}
            </Typography>
            <InputTextField value={myInfo?.rank} disabled />
          </FormControl>

          {/* Base Salary */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("baseSalary")}
            </Typography>
            <InputTextField value={String(myInfo?.baseSalary)} disabled />
          </FormControl>

          {/* Name */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("name")}
            </Typography>
            <InputTextField
              value={myInfo?.name}
              onChange={(val) => onChange("name", val)}
            />
          </FormControl>

          {/* Alias */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("userAlias")}
            </Typography>
            <InputTextField
              value={myInfo?.userAlias}
              onChange={(val) => onChange("userAlias", val)}
            />
          </FormControl>

          {/* Phone */}
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("phone")}
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
