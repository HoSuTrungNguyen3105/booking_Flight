import { useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import SelectWithModal from "../../common/Dropdown/Select";
import Modal from "../../common/Modal/Modal";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../../common/Dropdown/Changelng";

interface InputField {
  id: number;
  value: string;
}

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<InputField[]>([
    { id: Date.now(), value: "" },
  ]);

  const handleChange = (id: number, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const handleRemove = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = () => {
    const last = fields[fields.length - 1];
    if (!last.value.trim()) return;

    setFields((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  // 🔥 Kiểm tra nếu còn ô nào chưa nhập thì không cho submit
  const isSubmitDisabled = fields.some((f) => f.value.trim() === "");
  const { t } = useTranslation();
  return (
    <>
      <LanguageDropdown />
      <button onClick={() => setOpen(true)}>Mở modal</button>
      <Typography onClick={() => setOpen(true)}>{t("content1")}</Typography>
      <SelectWithModal />
      <Modal
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={handleSubmit}
        title={<Typography fontWeight="bold">사용자 등록</Typography>}
        submitLabel="등록"
        disabled={isSubmitDisabled}
        contentArea={
          <Box>
            <Typography variant="body2" mb={1}>
              멤버로 등록할 아이디를 입력하세요.
            </Typography>

            {fields.map((field, idx) => (
              <Box
                key={field.id}
                display="flex"
                alignItems="center"
                mb={1}
                gap={1}
              >
                <Box flex={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="ID_NEW_MEMBER"
                    value={field.value}
                    disabled={idx !== fields.length - 1}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                </Box>

                {fields.length > 1 && (
                  <IconButton onClick={() => handleRemove(field.id)}>
                    <Box
                      component="img"
                      src="./public/image.jpg"
                      sx={{ width: 24, height: 24 }}
                    />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        }
      ></Modal>
    </>
  );
}
