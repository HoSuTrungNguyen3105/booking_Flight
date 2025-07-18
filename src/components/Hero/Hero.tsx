import { useState } from "react";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import SelectWithModal from "../../common/Dropdown/Select";
import Modal from "../../common/Modal/Modal";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../../common/Dropdown/Changelng";
import addIcon from "./../../svgs/local.png";
import InputField from "../../common/Input/InputField";
import InputTextArea from "../../common/Input/InputTextArea";
import TableCustom from "../../common/Table/Table";
import TableInfo from "../../common/Dropdown/TableInfo";
interface InputField {
  id: number;
  value: string;
}

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [fieldsValue, setFieldsValue] = useState<InputField[]>([
    { id: Date.now(), value: "" },
  ]);
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState();
  const handleChange = (id: number, value: string) => {
    setFieldsValue((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  const handleRemove = (id: number) => {
    setFieldsValue((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = () => {
    // const last = fieldsValue[fieldsValue.length - 1];
    // if (!last.value.trim()) return;

    setFieldsValue((prev) => [...prev, { id: Date.now(), value: "" }]);
    // setValue("");
  };

  // 🔥 Kiểm tra nếu còn ô nào chưa nhập thì không cho submit
  const isSubmitDisabled = fieldsValue.some((f) => f.value.trim() === "");
  const { t } = useTranslation();
  return (
    <>
      <LanguageDropdown />
      {/* <TableCustom /> */}
      {/* <button onClick={() => setOpen(true)}>Mở modal</button> */}
      <Typography onClick={() => setOpen(true)}>{t("content1")}</Typography>
      <TableInfo
        title="Table Information"
        description="Details about the table"
        content={[
          {
            descContent: { content1: "Description 1" },
            content: { content1: "Complete" },
            getReviewStatusStyle(status) {
              return {
                color: status === "Complete" ? "green" : "#931024",
                fontWeight: "bold",
              };
            },
          },
          {
            descContent: { content1: "Description 2" },
            content: { content1: "Content 3", content2: "Content 4" },
          },
          {
            descContent: { content1: "Description 3" },
            content: { content1: "Content 5" },
          },
          {
            descContent: { content1: "Description 4" },
            content: { content1: "Content 7", content2: "Content 8" },
          },
          {
            descContent: { content1: "Description 5" },
            content: { content1: "Content 9", content2: "Content 10" },
          },
        ]}
      />
      <TableInfo
        title="Thông tin kiểm tra"
        description="Không có mô tả"
        content={[]}
        // getReviewStatusStyle={(val) => {
        //   if (val === "REJECTED") return { color: "red", fontWeight: "bold" };
        //   if (val === "PASS") return { color: "green" };
        //   return {};
        // }}
      />

      {/* <SelectWithModal /> */}
      <Modal
        open={open}
        handleClose={() => {
          setValue("");
          setOpen(false);
        }}
        handleSubmit={handleSubmit}
        title={<Typography fontWeight="bold">사용자 등록</Typography>}
        submitLabel="등록"
        // disabled={isSubmitDisabled}
        contentArea={
          <Box>
            <Typography variant="body2" mb={1}>
              멤버로 등록할 아이디를 입력하세요.
            </Typography>

            {fieldsValue.map((field, idx) => (
              <Box
                key={field.id}
                display="flex"
                alignItems="center"
                mb={1}
                gap={1}
              >
                <Box flex={1}>
                  <InputTextArea
                    minRows={1}
                    placeholder="ID_NEW_MEMBER"
                    value={field.value}
                    style={{ minWidth: "30rem" }}
                    // disabled={idx !== value.length}
                    onChange={(val) => handleChange(field.id, val)}
                  />
                </Box>

                {field.value.length > 1 && (
                  <IconButton onClick={() => handleRemove(field.id)}>
                    <Box
                      component="img"
                      src={addIcon}
                      sx={{ width: 24, height: 24 }}
                    />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        }
      />
    </>
  );
}
