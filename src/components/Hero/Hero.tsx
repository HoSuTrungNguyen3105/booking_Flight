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
import FieldRenderer, {
  FieldType,
} from "../../common/CustomRender/FieldRenderer";
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
    setFieldsValue((prev) => [...prev, { id: Date.now(), value: "" }]);
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
  const renderFilesAndButton = () => {
    return (
      <Box display="flex" flexDirection="column" minHeight="15vh">
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          점검 설명
        </Typography>
        <Box display="flex" flexDirection="row" width="100%">
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
        display="flex"
        minHeight={"50vh"}
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
        alignContent="flex-end"
        paddingRight={2}
      >
        <Button onClick={handleAddClick} label="Tải tệp" />
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.png,.pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    );
  }, [handleAddClick]);

  const mappedContent: ContentBlock[] = [
    {
      descContent: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      content: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
      // highlight: true,
    },
    {
      content: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
      hasLine: true,
    },
    {
      content: {
        content1: "Địa chỉ",
        content2: "Thành phố",
        content3: "Quốc gia",
      },
      descContent: {
        content1: "Thông tin địa chỉ",
      },
      hasLine: true,
      contentLabels: ["Địa chỉ", "Thành phố", "Quốc gia"],
    },
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
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
      hasLine: true,
    },
    {
      content: {
        content1: "Địa chỉ",
        content2: "Thành phố",
        content3: "Quốc gia",
      },
      descContent: {
        content1: "Thông tin địa chỉ",
      },
      contentLabels: ["Địa chỉ", "Thành phố", "Quốc gia"],
    },
    {
      content: {
        content1: "Địa chỉ",
        content2: "Thành phố",
        content3: "Quốc gia",
      },
      descContent: {
        content1: "Thông tin địa chỉ",
      },
      hasLine: true,
      contentLabels: ["Địa chỉ", "Thành phố", "Quốc gia"],
    },
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
      hasLine: true,
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
    },
    {
      content: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      descContent: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      hasLine: true,
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
    },
    {
      content: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      descContent: {
        content1: "Thông tin cá nhân",
        content2: "Thông tin liên hệ",
      },
      contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
    },
    {
      content: {
        content1: "Địa chỉ",
      },
      descContent: {
        content1: "Thông tin địa chỉ",
      },
      hasLine: true,
      gridSize: 3,
      contentLabels: ["Địa chỉ", "Thành phố", "Quốc gia"],
    },
    {
      content: {
        content1: renderFilesAndButton(),
      },
      hasLine: true,
      gridSize: 5,
    },
    {
      content: {
        content1: renderButtonAddFile(),
      },
      gridSize: 1,
    },
  ];
  const [formData, setFormData] = useState({
    active: true,
    gender: "",
    bio: "",
    notes: "",
  });

  const genderOptions = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" },
  ];

  const handleFiledChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <>
      <LanguageDropdown />
      <Typography onClick={() => setOpen(true)}>{t("content1")}</Typography>
      <TableInfo
        title="Thông tin kiểm tra"
        description="Không có mô tả"
        content={mappedContent}
      />
      <FieldRenderer
        options={genderOptions}
        type={FieldType.SWITCH}
        value={formData.active}
        onChange={(value) => handleFiledChange("active", value)}
      />

      <FieldRenderer
        type={FieldType.DROPDOWN}
        placeholder="Chọn giới tính"
        options={genderOptions}
        value={formData.gender}
        onChange={(value) => handleFiledChange("gender", value)}
      />

      <FieldRenderer
        options={genderOptions}
        type={FieldType.INPUT}
        placeholder="Mô tả ngắn"
        value={formData.bio}
        onChange={(value) => handleFiledChange("bio", value)}
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

// import { Box, Typography } from "@mui/material";
// import plane from "../../svgs/departures.svg";
// import styles from "./index.module.scss"; // Nếu dùng CSS module
// import { Button } from "../../common/Button/Button";
// import FlightIcon from "../../common/DataGrid/FlightIcon";

// const Hero = () => {
//   return (
//     <Box className={styles.hero}>
//       <Box className={styles.container}>
//         <Box className={`${styles.left} left-animation`}>
//           <Typography className={styles.welcome}>
//             Welcome To Our Website!
//             <FlightIcon
//               size={40} // kích thước (bắt buộc)
//               color="#4664db" // màu (tuỳ chọn)
//               direction={90} // xoay icon 90 độ (tuỳ chọn)
//               className="my-custom-class" // class css (tuỳ chọn)
//             />
//           </Typography>
//           <Typography className={styles.title}>
//             Luxury Experience <br /> With Our Services.
//           </Typography>
//           <Typography className={styles.title}></Typography>
//           <Typography className={styles.description}>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//             nulla ipsa unde inventore minus commodi saepe? Eos cumque aliquam
//             consequatur id optio dolorum modi quod?
//           </Typography>
//           <Box className={styles.buttons}>
//             <Button label="Book Flight" className={styles.book}></Button>
//             <Button label="Contact Us" className={styles.contact}></Button>
//           </Box>
//         </Box>
//         <img src={plane} className={`${styles.right} right-animation`} alt="" />
//       </Box>
//     </Box>
//   );
// };

// export default Hero;
