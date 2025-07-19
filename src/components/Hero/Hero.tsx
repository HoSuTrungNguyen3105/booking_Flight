import { useCallback, useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Modal from "../../common/Modal/Modal";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../../common/Dropdown/Changelng";
import addIcon from "./../../svgs/local.png";
import InputField from "../../common/Input/InputField";
import InputTextArea from "../../common/Input/InputTextArea";
import TableInfo from "../../common/Dropdown/TableInfo";
import type { ContentBlock } from "../../common/Dropdown/type";
import { Button } from "../../common/Button/Button";
interface InputField {
  id: number;
  value: string;
}

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [fieldsValue, setFieldsValue] = useState<InputField[]>([
    { id: Date.now(), value: "" },
  ]);
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const handleChange = (id: number, value: string) => {
    setFieldsValue((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  const handleRemove = (id: number) => {
    setFieldsValue((prev) => prev.filter((f) => f.id !== id));
  };
  const response = {
    name: "Nguyễn Văn A",
    age: 25,
    email: "a@gmail.com",
    phone: "0123456789",
  };
  const handleSubmit = () => {
    // const last = fieldsValue[fieldsValue.length - 1];
    // if (!last.value.trim()) return;

    setFieldsValue((prev) => [...prev, { id: Date.now(), value: "" }]);
    // setValue("");
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showInputs, setShowInputs] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Mở hộp thoại chọn file
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setShowInputs(true); // Hiện các InputField
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // const renderFiles = useCallback(() => {
  //   return (
  //     <Box display="flex" width="100%">
  //       <Box
  //         sx={{
  //           width: "2px",
  //           backgroundColor: "rgba(0,0,0,0.3)", // Màu đen nhạt (30% độ mờ)
  //           borderRadius: "2px",
  //           mr: 1,
  //         }}
  //       />
  //     </Box>
  //   );
  // }, [files, showInputs]);
  // const renderButton = useCallback(() => {
  //   return (
  //     <Box flex={1} display="flex" flexDirection="column">
  //       <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
  //         점검 설명
  //       </Typography>
  //       <Box display="flex" justifyContent="space-between" width="100%">
  //         <Box display="flex" flexDirection="column" gap={1} flex={1} mr={2}>
  //           {showInputs && (
  //             <Box mt={2} display="flex" flexDirection="column" gap={1}>
  //               {files.map((item, i) => (
  //                 <InputField key={i} value={item.name} />
  //               ))}
  //             </Box>
  //           )}
  //         </Box>
  //         <Box display="flex" alignItems="flex-end">
  //           <Button onClick={handleAddClick} label="Button" />
  //         </Box>
  //         <input
  //           ref={fileInputRef}
  //           type="file"
  //           multiple
  //           accept=".jpg,.png,.pdf"
  //           style={{ display: "none" }}
  //           onChange={handleFileChange}
  //         />
  //       </Box>
  //     </Box>
  //   );
  // }, [files, showInputs, handleAddClick]);

  const renderFilesAndButton = () => {
    return (
      <Box
        mt={"auto"}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%" // Đảm bảo vùng chiếm toàn bộ chiều cao của Grid
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          점검 설명
        </Typography>
        <Box display="flex" flexDirection="row" width="100%">
          {/* Hiển thị InputField nếu có file */}
          {showInputs && files.length > 0 && (
            <Box display="flex" flexDirection="column" gap={1} flex={1} mr={2}>
              {files.map((item, i) => (
                <InputField key={i} value={item.name} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  const renderButtonAddFile = useCallback(() => {
    return (
      <Box
        mt="auto"
        display="flex"
        minHeight={"50vh"}
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
        alignContent="flex-end"
        paddingRight={2}
        pt={2}
      >
        <Button onClick={handleAddClick} label="Tải tệp" />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.png,.pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    );
  }, [handleAddClick]);

  const mappedContent: ContentBlock[] = [
    {
      content: {
        content1: response.name,
        content2: String(response.age),
        content3: response.email,
        content4: response.phone,
      },
      descContent: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
        content3: "Thông tin liên hệ",
        content4: "Thông tin liên hệ",
      },
      gridSize: 3,

      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
      // highlight: true,
      // hasLine: true,
    },
    {
      content: {
        content1: "Địa chỉ",
      },
      descContent: {
        content1: "Thông tin địa chỉ",
      },
      gridSize: 3,
      contentLabels: ["Địa chỉ", "Thành phố", "Quốc gia"],
    },
    {
      content: {
        content1: renderFilesAndButton(),
      },
      gridSize: 5,
    },
    {
      content: {
        content1: renderButtonAddFile(),
      },
      gridSize: 1,
    },
    // {
    //   content: {
    //     content1: renderButton(),
    //   },
    //   gridSize: 1,
    // },
    // {
    //   content: {
    //     content1: "Sở thích",
    //     content2: "Ngôn ngữ",
    //   },
    //   descContent: {
    //     content1: "Thông tin sở thích và ngôn ngữ",
    //   },
    //   gridSize: 1,
    //   contentLabels: ["Sở thích", "Ngôn ngữ"],
    // },
  ];
  return (
    <>
      <LanguageDropdown />
      {/* <TableCustom /> */}
      {/* <button onClick={() => setOpen(true)}>Mở modal</button> */}
      <Typography onClick={() => setOpen(true)}>{t("content1")}</Typography>
      {/* <TableInfo
        title="Table Information"
        description="Details about the table"
        content={[
          {
            descContent: { content1: "Description 1" },
            content: { content1: "Complete" },
            // getReviewStatusStyle(status) {
            //   // return {
            //   //   color: status === "Complete" ? "green" : "#931024",
            //   //   fontWeight: "bold",
            //   // };
            //   return status === "Complete"
            //     ? { color: "green", fontWeight: "bold" }
            //     : { color: "#931024", fontWeight: "bold" };
            // },
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
            descContent: {
              content1: "Description 4",
              content2: "Description 5",
            },
            content: { content1: "Content 7", content2: "Content 8" },
            contentLabels: ["Label 1", "Label 2"],
          },
          {
            descContent: { content1: "Description 5" },
            content: { content1: "Content 9", content2: "Content 10" },
          },
        ]}
      /> */}
      <TableInfo
        title="Thông tin kiểm tra"
        description="Không có mô tả"
        content={mappedContent}
      />
      <Modal
        open={open}
        handleClose={() => {
          setValue("");
          setOpen(false);
        }}
        handleSubmit={handleSubmit}
        title={<Typography fontWeight="bold">사용자 등록</Typography>}
        submitLabel="등록"
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
