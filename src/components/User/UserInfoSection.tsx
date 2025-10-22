import { Box, FormControl, Stack, Typography } from "@mui/material";
import { memo } from "react";
import InputTextField from "../../common/Input/InputTextField";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import { useTranslation } from "react-i18next";
import type { UserDataToUpdate } from "../../common/Setting/ManageMyInformation";

interface IUserInfoSectionProps {
  myInfo?: UserDataToUpdate;
  onChange: (field: keyof UserDataToUpdate, value: string) => void;
}

const UserInfoSection = ({ myInfo, onChange }: IUserInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        paddingBottom: "2px",
        height: "470px",
        border: "1px solid #e0e0e0",
        borderRadius: 0.5,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "8px",
          borderBottom: 1,
          borderColor: "grey.200",
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
          height: "350px",
          overflow: "auto",
          borderColor: "grey.200",
          backgroundColor: "white",
          padding: "8px 12px",
        }}
      >
        <Stack spacing={2} sx={{ width: "384px" }}>
          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("email")}
            </Typography>
            <InputTextField value={myInfo?.email} disabled />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("authType")}
            </Typography>
            <InputTextField value={myInfo?.authType} disabled />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("role")}
            </Typography>
            <InputTextField value={myInfo?.role} disabled />
          </FormControl>

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

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("rank")}
            </Typography>
            <InputTextField value={myInfo?.rank} disabled />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("baseSalary")}
            </Typography>
            <InputTextField value={String(myInfo?.baseSalary)} disabled />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("name")}
            </Typography>
            <InputTextField
              value={myInfo?.name}
              onChange={(val) => onChange("name", val)}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={0.5}>
              {t("userAlias")}
            </Typography>
            <InputTextField
              value={myInfo?.userAlias}
              onChange={(val) => onChange("userAlias", val)}
            />
          </FormControl>

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
