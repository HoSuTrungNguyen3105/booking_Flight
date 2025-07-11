// import { useState } from "react";
// import Modal from "../../common/Modal/Modal";
// import "./index.scss";
// import { Box, IconButton, TextField, Typography } from "@mui/material";
// import type { InputFieldProps } from "../../common/Input/type";
// interface InputField {
//   id: number;
//   value: string;
// }
// const Hero = () => {
//   const [open, setOpen] = useState(false);
//   // const handleSubmit = () => {
//   //   // Xử lý logic khi người dùng nhấn nút "Đăng ký"
//   //   console.log("Đăng ký thành công!");
//   //   setOpen(false);
//   // };

//   const [fields, setFields] = useState<InputField[]>([
//     { id: Date.now(), value: "" },
//   ]);

//   const handleAdd = () => {
//     setFields((prev) => [...prev, { id: Date.now(), value: "" }]);
//   };

//   const handleRemove = (id: number) => {
//     setFields((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handleChange = (id: number, value: string) => {
//     setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
//   };

//   const handleSubmit = () => {
//     console.log("Submit: ", fields);
//     onClose();
//     setOpen(false);
//   };

//   return (
//     <div className="hero-section">
//       <div className="hero-container">
//         <h1 className="hero-title">Find your next stay</h1>
//         <p className="hero-subtitle">
//           Search low prices on hotels for your dream vacation...
//           <span onClick={() => setOpen(true)}>Sign Up</span>
//           <Modal
//             open={open}
//             onClose={() => setOpen(false)}
//             onSubmit={handleSubmit}
//             title={
//               <>
//                 <Box
//                   component="img"
//                   src="./public/image.jpg"
//                   sx={{
//                     width: "50%", // sửa lại chính tả từ "5l0%" → "50%"
//                     height: "auto",
//                     borderRadius: "50%", // bo tròn hình ảnh (hình tròn nếu ảnh là hình vuông)
//                     objectFit: "cover", // để ảnh không bị méo khi bo tròn
//                   }}
//                 />
//                 <Typography fontWeight="bold">사용자 등록</Typography>
//               </>
//             }
//             confirmText="등록"
//           >
//             <Typography variant="body2" color="textSecondary" mb={1}>
//               멤버로 등록할 아이디를 입력하세요.
//             </Typography>

//             {/* nội dung thêm */}
//             <TextField fullWidth size="small" placeholder="ID_NEW_MEMBER" />
//           </Modal>
//           <Modal
//             open={open}
//             onClose={onClose}
//             onSubmit={handleSubmit}
//             title={
//               <>
//                 <Box
//                   component="img"
//                   src="./public/image.jpg"
//                   sx={{
//                     width: "50%", // sửa lại chính tả từ "5l0%" → "50%"
//                     height: "auto",
//                     borderRadius: "50%", // bo tròn hình ảnh (hình tròn nếu ảnh là hình vuông)
//                     objectFit: "cover", // để ảnh không bị méo khi bo tròn
//                   }}
//                 />
//                 <Box component="span" fontWeight="bold">
//                   사용자 등록
//                 </Box>
//               </>
//             }
//             confirmText="등록"
//           >
//             {fields.map((field, idx) => (
//               <Box key={field.id} display="flex" alignItems="center" mb={2}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="ID_NEW_MEMBER"
//                   value={field.value}
//                   onChange={(e) => handleChange(field.id, e.target.value)}
//                 />
//                 {idx > 0 && (
//                   <IconButton onClick={() => handleRemove(field.id)}>
//                     <Box
//                       component="img"
//                       src="./public/image.jpg"
//                       sx={{
//                         width: "50%", // sửa lại chính tả từ "5l0%" → "50%"
//                         height: "auto",
//                         borderRadius: "50%", // bo tròn hình ảnh (hình tròn nếu ảnh là hình vuông)
//                         objectFit: "cover", // để ảnh không bị méo khi bo tròn
//                       }}
//                     />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//             <Box mt={1}>
//               <IconButton onClick={handleAdd}>
//                 <Box
//                   component="img"
//                   src="./public/image.jpg"
//                   sx={{
//                     width: "50%", // sửa lại chính tả từ "5l0%" → "50%"
//                     height: "auto",
//                     borderRadius: "50%", // bo tròn hình ảnh (hình tròn nếu ảnh là hình vuông)
//                     objectFit: "cover", // để ảnh không bị méo khi bo tròn
//                   }}
//                 />{" "}
//               </IconButton>
//             </Box>
//           </Modal>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Hero;

// import { useState } from "react";
// import { Box, IconButton, TextField, Typography } from "@mui/material";
// import Modal from "../../common/Modal/Modal"; // dialog tùy chỉnh

// interface InputField {
//   id: number;
//   value: string;
// }

// export default function Hero() {
//   const [open, setOpen] = useState(false);
//   const [fields, setFields] = useState<InputField[]>([
//     { id: Date.now(), value: "" },
//   ]);
//   const [showRemove, setShowRemove] = useState(false); // ✅ dùng để kiểm soát nút xoá

//   const handleChange = (id: number, value: string) => {
//     setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
//   };

//   const handleRemove = (id: number) => {
//     setFields((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handleSubmit = () => {
//     const last = fields[fields.length - 1];
//     if (!last.value.trim()) return; // chặn nếu chưa nhập gì

//     setFields((prev) => [...prev, { id: Date.now(), value: "" }]);
//     setShowRemove(true); // ✅ sau khi thêm thì hiện nút xoá
//   };

//   return (
//     <>
//       <button onClick={() => setOpen(true)}>Mở modal</button>

//       <Modal
//         open={open}
//         onClose={() => setOpen(false)}
//         onSubmit={handleSubmit}
//         title={<Typography fontWeight="bold">사용자 등록</Typography>}
//         confirmText="등록"
//       >
//         <Typography variant="body2" mb={1}>
//           멤버로 등록할 아이디를 입력하세요.
//         </Typography>

//         {/* {fields.map((field) => (
//           <Box key={field.id} display="flex" alignItems="center" mb={1}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="ID_NEW_MEMBER"
//               value={field.value}
//               onChange={(e) => handleChange(field.id, e.target.value)}
//             />
//             {showRemove && (
//               <IconButton onClick={() => handleRemove(field.id)}>
//                 <Box
//                   component="img"
//                   src="/public/icon-minus.svg"
//                   sx={{ width: 24, height: 24 }}
//                 />
//               </IconButton>
//             )}
//           </Box>
//         ))} */}
//         {fields.map((field) => (
//           <Box key={field.id} display="flex" alignItems="center" mb={1}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="ID_NEW_MEMBER"
//               disabled={field.value.trim() !== ""} // 🔥 Disable nếu da submit
//               value={field.value}
//               onChange={(e) => handleChange(field.id, e.target.value)}
//             />
//             {fields.length > 1 && ( // 🔥 Chỉ hiện nút xóa nếu có hơn 1 field
//               <IconButton onClick={() => handleRemove(field.id)}>
//                 <Box
//                   component="img"
//                   src="/public/icon-minus.svg"
//                   sx={{ width: 24, height: 24 }}
//                 />
//               </IconButton>
//             )}
//           </Box>
//         ))}
//       </Modal>
//     </>
//   );
// }
import { useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import SelectWithModal from "../../common/Dropdown/Select";
import Modal from "../../common/Modal/Modal";
import { useTranslation } from "react-i18next";
import {
  handleLanguageChange,
  optionLanguage,
} from "../../context/use[custom]/useChangeLng";
import { Dropdown } from "../../common/Dropdown/Dropdown";

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
      <Dropdown
        size="medium"
        value={optionLanguage}
        options={optionLanguage}
        onChange={handleLanguageChange}
      />

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
