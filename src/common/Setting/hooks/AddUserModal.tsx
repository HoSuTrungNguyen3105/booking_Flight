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
import { Checkbox } from "../../Checkbox/Checkbox";
import InputTextField from "../../Input/InputTextField";
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
  { label: "admin", value: "admin" },
];

const AddUserModal = ({
  open,
  onClose,
}: //   selectedRows,
//   detailData,
//   subfileList,
IModalStatisticalDataLearningProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={() => {}}>
          확인
        </Button>
      </Box>
    );
  }, []);

  const renderContent = useCallback(() => {
    const columnsSubfileList = useMemo(
      () => [
        { field: "fileName", headerName: "파일 이름", flex: 1 },
        { field: "type", headerName: "유형", flex: 1 },
      ],
      []
    );

    // hook lấy từ net nhgko thấy mẫu cũ
    const renderRows = () => {
      // Danh sách các field muốn render
      const [formData, setFormData] = useState({
        userName: "",
        passWord: "co3t93WnBGD69sKyBux",
        role: "member",
        addDress: "",
        permissionRole: [],
      });

      const fields: IFormField[] = [
        {
          id: "userName",
          label: "Tên đăng nhập",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập tên đăng nhập...",
          options: [],
          value: formData.userName,
          onChange: (val) =>
            setFormData((prev) => ({ ...prev, userName: val })),
        },
        {
          id: "passWord",
          label: "Mật khẩu",
          type: FieldType.INPUT_WITH_TYPE_PASSWORD,
          placeholder: "Nhập mật khẩu...",
          options: [],
          value: formData.passWord,
          // onChange: () => {},
        },
        {
          id: "role",
          label: "Chọn vai trò",
          type: FieldType.DROPDOWN,
          placeholder: "Chọn vai trò...",
          options: [
            { label: "Thành viên", value: "member" },
            { label: "Quản trị", value: "admin" },
          ],
          value: formData.role,
          onChange: (val) => setFormData((prev) => ({ ...prev, role: val })),
        },
        {
          id: "addDress",
          label: "Địa chỉ",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập địa chỉ...",
          options: [],
          value: formData.addDress,
          onChange: (val) =>
            setFormData((prev) => ({ ...prev, addDress: val })),
        },
        {
          id: "permissionRole",
          label: "Chọn quyền",
          type: FieldType.DROPDOWN,
          placeholder: "Chọn quyền...",
          options: [
            { label: "Lựa chọn 1", value: "option1" },
            { label: "Lựa chọn 2", value: "option2" },
          ],
          value: formData.permissionRole,
          onChange: (val) =>
            setFormData((prev) => ({ ...prev, permissionRole: val })),
        },
      ];

      // Hàm cập nhật value
      const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
      };

      return (
        <Stack>
          <Typography variant="body1">데이터 목록</Typography>
          {fields.map((field) => (
            <Box key={field.id}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {field.label}
              </Typography>

              <FieldRenderer
                type={field.type}
                placeholder={field.placeholder}
                options={field.options}
                value={formData[field.id as keyof typeof formData]}
                disabled={false}
                onChange={(val) => handleChange(field.id, val)}
              />
            </Box>
          ))}
          {/* CheckBox Dropdown */}
          <Box
            padding="8px"
            border={1}
            bgcolor="grey.100"
            borderColor="grey.200"
          >
            <Box bgcolor="white">
              <InputTextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
                placeholder="검색 단어를 입력해주세요."
                endIcon={
                  <Box
                    component="img"
                    sx={{ width: "20px" }}
                    src={SearchIcon}
                  />
                }
              />
              <Box
                display="flex"
                flexDirection="column"
                overflow="auto"
                maxHeight="100px"
                border="0.5px solid #ccc"
                padding={1}
              >
                {SERVICE_TYPE_OPTIONS.map((item, index) => (
                  <Box key={index}>
                    <Box
                      display="flex"
                      alignItems="center"
                      borderBottom="1px solid #ddd"
                    >
                      <Checkbox />
                      <Typography variant="body1">{item.label}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Stack>
      );
    };

    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        {renderRows()}
        {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TableSection
            columns={columnsSubfileList}
            rows={subfileList}
            setRows={() => {}}
            isLoading={false}
            nextRowClick={false}
            handleRowClick={() => {}}
            largeThan={true}
          />
          {/* {filteredDetailData.map((detail) => (
        <DetailItem key={detail.id} detail={detail} />
      ))} 
        </Box> */}
      </Box>
    );
  }, []);

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
