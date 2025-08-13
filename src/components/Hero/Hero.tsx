// import { useCallback, useMemo, useRef, useState } from "react";
// import { Box, IconButton, Typography } from "@mui/material";
// import Modal from "../../common/Modal/Modal";
// import { useTranslation } from "react-i18next";
// import { LanguageDropdown } from "../../common/Dropdown/Changelng";
// import addIcon from "./../../svgs/local.png";
// import InputField from "../../common/Input/InputField";
// import InputTextArea from "../../common/Input/InputTextArea";
// import TableInfo from "../../common/Dropdown/TableInfo";
// import type { ContentBlock } from "../../common/Dropdown/type";
// import { Button } from "../../common/Button/Button";
// import FieldRenderer, {
//   FieldType,
// } from "../../common/CustomRender/FieldRenderer";
// import { useAuth } from "../../context/AuthContext";
// interface InputField {
//   id: number;
//   value: string;
// }

// export default function Hero() {
//   const [open, setOpen] = useState(false);
//   const [fieldsValue, setFieldsValue] = useState<InputField[]>([
//     { id: Date.now(), value: "" },
//   ]);
//   const { t } = useTranslation();
//   const [value, setValue] = useState("");
//   const handleChange = (id: number, value: string) => {
//     setFieldsValue((prev) =>
//       prev.map((f) => (f.id === id ? { ...f, value } : f))
//     );
//   };

//   const handleRemove = (id: number) => {
//     setFieldsValue((prev) => prev.filter((f) => f.id !== id));
//   };
//   const response = {
//     name: "Nguyễn Văn A",
//     age: 25,
//     email: "a@gmail.com",
//     phone: "0123456789",
//   };
//   const handleSubmit = () => {
//     setFieldsValue((prev) => [...prev, { id: Date.now(), value: "" }]);
//   };
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [showInputs, setShowInputs] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);

//   const handleAddClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click(); // Mở hộp thoại chọn file
//     }
//   };
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newFiles = Array.from(e.target.files || []);
//     setShowInputs(true); // Hiện các InputField
//     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   };
//   const renderFilesAndButton = () => {
//     return (
//       <Box display="flex" flexDirection="column" minHeight="15vh">
//         <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
//           점검 설명
//         </Typography>
//         <Box display="flex" flexDirection="row" width="100%">
//           {showInputs && files.length > 0 && (
//             <Box display="flex" flexDirection="column" gap={1} flex={1} mr={2}>
//               {files.map((item, i) => (
//                 <InputField key={i} value={item.name} />
//               ))}
//             </Box>
//           )}
//         </Box>
//       </Box>
//     );
//   };
//   const renderButtonAddFile = useCallback(() => {
//     return (
//       <Box
//         display="flex"
//         minHeight={"50vh"}
//         flexDirection="row"
//         justifyContent="flex-end"
//         alignItems="center"
//         alignContent="flex-end"
//         paddingRight={2}
//       >
//         <Button onClick={handleAddClick} label="Tải tệp" />
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".jpg,.png,.pdf"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//       </Box>
//     );
//   }, [handleAddClick]);

//   const mappedContent: ContentBlock[] = [
//     {
//       descContent: {
//         content1: "Thông tin cá nhân",
//         content2: "Thông tin liên hệ",
//       },
//       content: {
//         content1: "Thông tin cá nhân",
//       },
//       // highlight: true,
//     },
//     {
//       content: {
//         content1: "Thông tin cá nhân",
//         content2: "Thông tin liên hệ",
//       },
//       contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
//       hasLine: true,
//     },
//     {
//       content: {
//         content1: response.name,
//         content2: String(response.age),
//         content3: response.email,
//         content4: response.phone,
//       },
//       descContent: {
//         content1: "Thông tin cá nhân",
//         content2: "Thông tin liên hệ",
//         content3: "Thông tin liên hệ",
//         content4: "Thông tin liên hệ",
//       },
//       contentLabels: ["Họ tên", "Tuổi", "Email", "Số điện thoại"],
//       hasLine: true,
//     },
//   ];
//   const [formData, setFormData] = useState({
//     active: true,
//     gender: "",
//     bio: "",
//     notes: "",
//   });

//   const genderOptions = [
//     { label: "Nam", value: "male" },
//     { label: "Nữ", value: "female" },
//     { label: "Khác", value: "other" },
//   ];
//   const { user } = useAuth();

//   const handleFiledChange = (key: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };
//   console.log("user", user);

//   return (
//     <>
//       <LanguageDropdown />
//       <Typography onClick={() => setOpen(true)}>{t("content1")}</Typography>
//       <TableInfo
//         title="Thông tin kiểm tra"
//         description="Không có mô tả"
//         content={mappedContent}
//       />
//       <FieldRenderer
//         options={genderOptions}
//         type={FieldType.SWITCH}
//         value={formData.active}
//         onChange={(value) => handleFiledChange("active", value)}
//       />

//       <FieldRenderer
//         type={FieldType.DROPDOWN}
//         placeholder="Chọn giới tính"
//         options={genderOptions}
//         value={formData.gender}
//         onChange={(value) => handleFiledChange("gender", value)}
//       />

//       <FieldRenderer
//         options={genderOptions}
//         type={FieldType.DROPDOWN}
//         placeholder="Mô tả ngắn"
//         value={formData.bio}
//         onChange={(value) => handleFiledChange("bio", value)}
//       />
//       <Modal
//         open={open}
//         handleClose={() => {
//           setValue("");
//           setOpen(false);
//         }}
//         handleSubmit={handleSubmit}
//         title={<Typography fontWeight="bold">사용자 등록</Typography>}
//         submitLabel="등록"
//         contentArea={
//           <Box>
//             <Typography variant="body2" mb={1}>
//               멤버로 등록할 아이디를 입력하세요.
//             </Typography>

//             {fieldsValue.map((field, idx) => (
//               <Box
//                 key={field.id}
//                 display="flex"
//                 alignItems="center"
//                 mb={1}
//                 gap={1}
//               >
//                 <Box flex={1}>
//                   <InputTextArea
//                     minRows={1}
//                     placeholder="ID_NEW_MEMBER"
//                     value={field.value}
//                     style={{ minWidth: "30rem" }}
//                     // disabled={idx !== value.length}
//                     onChange={(val) => handleChange(field.id, val)}
//                   />
//                 </Box>

//                 {field.value.length > 1 && (
//                   <IconButton onClick={() => handleRemove(field.id)}>
//                     <Box
//                       component="img"
//                       src={addIcon}
//                       sx={{ width: 24, height: 24 }}
//                     />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//           </Box>
//         }
//       />
//     </>
//   );
// }

// // import { Box, Typography } from "@mui/material";
// // import plane from "../../svgs/departures.svg";
// // import styles from "./index.module.scss"; // Nếu dùng CSS module
// // import { Button } from "../../common/Button/Button";
// // import FlightIcon from "../../common/DataGrid/FlightIcon";

// // const Hero = () => {
// //   return (
// //     <Box className={styles.hero}>
// //       <Box className={styles.container}>
// //         <Box className={`${styles.left} left-animation`}>
// //           <Typography className={styles.welcome}>
// //             Welcome To Our Website!
// //             <FlightIcon
// //               size={40} // kích thước (bắt buộc)
// //               color="#4664db" // màu (tuỳ chọn)
// //               direction={90} // xoay icon 90 độ (tuỳ chọn)
// //               className="my-custom-class" // class css (tuỳ chọn)
// //             />
// //           </Typography>
// //           <Typography className={styles.title}>
// //             Luxury Experience <br /> With Our Services.
// //           </Typography>
// //           <Typography className={styles.title}></Typography>
// //           <Typography className={styles.description}>
// //             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
// //             nulla ipsa unde inventore minus commodi saepe? Eos cumque aliquam
// //             consequatur id optio dolorum modi quod?
// //           </Typography>
// //           <Box className={styles.buttons}>
// //             <Button label="Book Flight" className={styles.book}></Button>
// //             <Button label="Contact Us" className={styles.contact}></Button>
// //           </Box>
// //         </Box>
// //         <img src={plane} className={`${styles.right} right-animation`} alt="" />
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Hero;
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from "@mui/material";
import {
  Search,
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  People,
  Speed,
  Security,
  SupportAgent,
} from "@mui/icons-material";

interface FlightSearchForm {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  flightType: "oneway" | "roundtrip";
  cabinClass: "economy" | "business" | "first";
}

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    flightType: "roundtrip",
    cabinClass: "economy",
  });

  const handleInputChange = (
    field: keyof FlightSearchForm,
    value: string | number
  ) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFlightTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFlightType: "oneway" | "roundtrip"
  ) => {
    if (newFlightType !== null) {
      handleInputChange("flightType", newFlightType);
    }
  };

  const handleSearch = () => {
    console.log("Searching flights with:", searchForm);
    // Handle search logic here
  };

  const cabinOptions = [
    { value: "economy", label: "Phổ thông" },
    { value: "business", label: "Thương gia" },
    { value: "first", label: "Hạng nhất" },
  ];

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: "Đặt vé nhanh chóng",
      description: "Chỉ với vài bước đơn giản để có vé máy bay",
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Bảo mật tuyệt đối",
      description: "Thông tin cá nhân được bảo vệ hoàn toàn",
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn sẵn sàng hỗ trợ mọi lúc",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            animation: "float 6s ease-in-out infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "60%",
            right: "15%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            animation: "float 8s ease-in-out infinite reverse",
          },
          "@keyframes float": {
            "0%, 100%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-20px)",
            },
          },
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          {/* Hero Text */}
          <Grid size={12}>
            <Fade in timeout={1000}>
              <Box textAlign="center" mb={6}>
                <Typography
                  variant={isMobile ? "h2" : "h1"}
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    mb: 3,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    background: "linear-gradient(45deg, #fff 30%, #f0f8ff 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Khám Phá Thế Giới
                  <br />
                  <Typography
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "inherit",
                      fontWeight: "inherit",
                    }}
                  >
                    Cùng SkyTravel
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    maxWidth: 800,
                    mx: "auto",
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Đặt vé máy bay dễ dàng với giá tốt nhất. Hành trình của bạn
                  bắt đầu từ đây.
                </Typography>
              </Box>
            </Fade>
          </Grid>

          {/* Search Form */}
          <Grid size={12}>
            <Slide direction="up" in timeout={1200}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  maxWidth: 1200,
                  mx: "auto",
                }}
              >
                {/* Flight Type Toggle */}
                <Box display="flex" justifyContent="center" mb={4}>
                  <ToggleButtonGroup
                    value={searchForm.flightType}
                    exclusive
                    onChange={handleFlightTypeChange}
                    sx={{
                      "& .MuiToggleButton-root": {
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <ToggleButton value="roundtrip">Khứ hồi</ToggleButton>
                    <ToggleButton value="oneway">Một chiều</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Search Inputs */}
                <Grid container spacing={3} mb={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Từ"
                      placeholder="Thành phố khởi hành"
                      value={searchForm.from}
                      onChange={(e) =>
                        handleInputChange("from", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <FlightTakeoff
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Đến"
                      placeholder="Thành phố đến"
                      value={searchForm.to}
                      onChange={(e) => handleInputChange("to", e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <FlightLand sx={{ mr: 1, color: "primary.main" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày đi"
                      value={searchForm.departDate}
                      onChange={(e) =>
                        handleInputChange("departDate", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <CalendarToday
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  {searchForm.flightType === "roundtrip" && (
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Ngày về"
                        value={searchForm.returnDate}
                        onChange={(e) =>
                          handleInputChange("returnDate", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <CalendarToday
                              sx={{ mr: 1, color: "primary.main" }}
                            />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  )}

                  <Grid
                    size={12}
                    left={searchForm.flightType === "roundtrip" ? 2.4 : 4.8}
                  >
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          select
                          label="Hành khách"
                          value={searchForm.passengers}
                          onChange={(e) =>
                            handleInputChange(
                              "passengers",
                              parseInt(e.target.value)
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <People sx={{ mr: 1, color: "primary.main" }} />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <MenuItem key={num} value={num}>
                              {num} người
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          select
                          label="Hạng ghế"
                          value={searchForm.cabinClass}
                          onChange={(e) =>
                            handleInputChange(
                              "cabinClass",
                              e.target.value as any
                            )
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {cabinOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Search Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Tìm chuyến bay tốt nhất
                </Button>
              </Paper>
            </Slide>
          </Grid>

          {/* Features */}
          <Grid size={12}>
            <Fade in timeout={1500}>
              <Box mt={8}>
                <Grid container spacing={4} justifyContent="center">
                  {features.map((feature, index) => (
                    <Grid size={12} key={index}>
                      <Card
                        elevation={8}
                        sx={{
                          textAlign: "center",
                          p: 3,
                          borderRadius: 3,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardContent>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              mx: "auto",
                              mb: 2,
                              background: "rgba(255, 255, 255, 0.2)",
                              color: "white",
                            }}
                          >
                            {feature.icon}
                          </Avatar>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "rgba(255, 255, 255, 0.8)",
                              lineHeight: 1.6,
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
