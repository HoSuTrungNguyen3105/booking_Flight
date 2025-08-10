import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import type { GridRowDef } from "../../DataGrid";
import type { DataDetail, IDataHistoryProps, ISubfileListProps } from "../type";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "../../../svgs/icon-search.svg";
import FieldRenderer, {
  FieldType,
  type IFormField,
} from "../../CustomRender/FieldRenderer";
import { useUpdateUser } from "./useUpdateUser";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";
import { useCreateUser } from "./useCreateUser";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  //   detailData: ISomeDataDataHistory | null;
  //   selectedRows: IDataHistoryProps | null;
  //   subfileList: ISubfileListProps[];
}

type ISomeDataInSubfilelist = GridRowDef &
  Pick<ISubfileListProps, "type" | "fileName">;

export type ISomeDataDataHistory = Omit<
  DataDetail,
  "description" | "isDeleted" | "metadata"
> & {
  explanation?: string;
};

export const customLabelsInModal: Record<keyof ISomeDataDataHistory, string> = {
  dataName: "데이터 이름",
  managementId: "관리 ID",
  dataType: "데이터 형태",
  dataSource: "데이터 출처",
  collectionMethod: "수집 방법",
  collectionTime: "수집 시간",
  explanation: "설명",
  hash: "HASH",
  evaluationHistoryLink: "평가 이력 링크",
  metadataDescription: "메타데이터 설명",
};
const SERVICE_TYPE_OPTIONS = [
  { label: "admin", value: "admin" },
  { label: "admin", value: "admin" },
  { label: "admin", value: "admin" },
  { label: "admin", value: "admin" },
  { label: "admin", value: "admin" },
];

const AddUserModal = ({
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const {
    formDetailConfig,
    handleChangeFormInput,
    enableUpdateBtn,
    formData,
    error,
    fetchUser,
    loadingUser,
    handleChange,
    handleSubmit,
    refetchUser,
  } = useCreateUser({
    onClose,
    onSuccess,
  });
  // const handleSubmit = () => {}
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleSubmit}>
          확인
        </Button>
      </Box>
    );
  }, [handleSubmit]);
  // console.log("Đang gửi:", JSON.stringify(formData));

  // console.log("Sending payload:", {
  //   name: formData.name,
  //   password: formData.password,
  //   email: formData.email,
  //   role: formData.role,
  // });

  const renderContent = useCallback(() => {
    // hook lấy từ net nhgko thấy mẫu cũ
    const renderRows = () => {
      return (
        // <Stack>
        //   <Typography variant="body1">데이터 목록</Typography>
        //   {formDetailConfig.map((field) => (
        //     <Box key={field.id}>
        //       <Typography variant="body1" sx={{ mb: 1 }}>
        //         {field.label}
        //       </Typography>

        //       <FieldRenderer
        //         type={field.type}
        //         placeholder={field.placeholder}
        //         options={field.options}
        //         // value={formData?.[field.id] ?? ""}
        //         value={formData[field.id as keyof typeof formData] ?? ""}
        //         // value={formData[field.id as keyof typeof formData]}
        //         disabled={false}
        //         onChange={(val) => handleChange(field.id, val)}
        //       />
        //     </Box>
        //   ))}
        // </Stack>
        <Stack>
          <Typography variant="body1">데이터 목록</Typography>

          {formDetailConfig
            .filter((fieldItem) => !fieldItem.disabled) // 🔥 Chỉ render nếu không bị disable
            .map(({ disabled, fields }) => (
              <Box key={fields.id}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fields.label}
                </Typography>

                <FieldRenderer
                  {...fields}
                  value={formData[fields.id as keyof typeof formData] ?? ""}
                  onChange={(val) => handleChange(fields.id, val)}
                />
              </Box>
            ))}
        </Stack>
      );
    };

    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        {renderRows()}
      </Box>
    );
  }, [formDetailConfig, formData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq$ 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AddUserModal);
