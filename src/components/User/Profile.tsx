// import { Box, Grid as MuiGrid, Typography } from "@mui/material";
// import InputField from "../../common/Input/InputField";
// import { Button } from "../../common/Button/Button";

// const ConnectedFourBoxes = () => {
//   const inspectionData = {
//     TITLE: "25.6.13 오전 1:30 - 데이터, 모델, AI 서비스 범위 점검 정보",
//     status: "미완료",
//     time: "25.6.13 오전 1:30",
//     inspector: "ID_HONG",
//     dataStatus: ["데이터  19/30", "데이터 1/30", "데이터: 0/30"],
//     completeTime: "25.6.13 오전 2:30",
//     text: "데이터 오염 점검의 의미: ... 데이터 오염 점검 오류시 아래와 같은 문제가 발생할 수 있습니다.",
//     content: "데이터 오염 점검의 의미 ....",
//     checkTime: "자동 배정",
//     itemStatusLeft: "모델 20/30, AI 서비스 10/10, 모델 20/30",
//     itemStatusRight: "AI RED 10/15, 총 자동 점검 60/60, 기타 10/15",
//     detail1: ["해당 파일 확인하기", "점검하기", "문제 해결하기"],
//     detail2: [],
//   };

//   return (
//     <MuiGrid container spacing={2} sx={{ mb: 2 }}>
//       {/* Row 1 */}
//       <MuiGrid size={3}>
//         <Typography variant="caption" color="text.secondary">
//           검사 상태
//         </Typography>
//         <Typography variant="body2">{inspectionData.status}</Typography>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               시작 시간
//             </Typography>
//             <Typography variant="body2">{inspectionData.time}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               검토자
//             </Typography>
//             <Typography variant="body2">{inspectionData.inspector}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               점검 제목
//             </Typography>
//             <Typography variant="body2">{inspectionData.TITLE}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       {/* Row 2 */}
//       <MuiGrid size={3}>
//         <Typography variant="caption" color="text.secondary">
//           데이터 상태
//         </Typography>
//         <Typography variant="body2">
//           {inspectionData.dataStatus.join(", ")}
//         </Typography>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               완료 시간
//             </Typography>
//             <Typography variant="body2">
//               {inspectionData.completeTime}
//             </Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               체크 시간
//             </Typography>
//             <Typography variant="body2">{inspectionData.checkTime}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               점검 설명
//             </Typography>
//             <Typography variant="body2">{inspectionData.content}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>
//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           {/* <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           /> */}
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               완료 시간
//             </Typography>
//             <Typography variant="body2">
//               {inspectionData.completeTime}
//             </Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           <Box
//             sx={{
//               height: "auto", // co theo nội dung
//               width: "1px",
//               backgroundColor: "grey.200",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           />
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               체크 시간
//             </Typography>
//             <Typography variant="body2">{inspectionData.checkTime}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={5}>
//         <Box display="flex" width="100%">
//           {/* Border đen bên trái */}
//           <Box
//             sx={{
//               height: "auto", // co theo nội dung
//               width: "1px",
//               backgroundColor: "grey.200",
//               borderRadius: "1px",
//               mr: 2,
//             }}
//           />

//           {/* Nội dung chính */}
//           <Box display="flex" flexDirection="column">
//             {/* Tiêu đề và mô tả */}
//             <Typography
//               variant="caption"
//               color="text.secondary"
//               sx={{ mb: 0.5 }}
//             >
//               점검 설명
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               {inspectionData.content}
//             </Typography>

//             {/* Input + Button layout */}
//             <Box display="flex" justifyContent="space-between" width="100%">
//               {/* Input bên trái */}
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 gap={1}
//                 flex={1}
//                 mr={2}
//               >
//                 <InputField />
//                 <InputField />
//                 <InputField />
//                 <InputField />
//                 <InputField />
//               </Box>

//               {/* Button bên phải, căn dưới */}
//               <Box display="flex" alignItems="flex-end">
//                 <Button label="Button" />
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           {/* <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           /> */}
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               점검 설명
//             </Typography>
//             <Typography variant="body2">{inspectionData.content}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>

//       <MuiGrid size={3}>
//         <Box width={"100%"} display="flex" justifyContent="flex-start">
//           {/* <Box
//             sx={{
//               width: "1px",
//               height: "auto", // co theo nội dung
//               backgroundColor: "black",
//               mr: 1,
//               borderRadius: "1px",
//             }}
//           /> */}
//           <Box flexDirection={"column"} display={"flex"}>
//             <Typography variant="caption" color="text.secondary">
//               점검 설명
//             </Typography>
//             <Typography variant="body2">{inspectionData.content}</Typography>
//           </Box>
//         </Box>
//       </MuiGrid>
//     </MuiGrid>
//   );
// };

// export default ConnectedFourBoxes;

import { Box, Grid, Typography, useTheme } from "@mui/material";
import InputField from "../../common/Input/InputField";
import { Button } from "../../common/Button/Button";
import { useRef, useState } from "react";
interface InspectionData {
  TITLE: string;
  status: string;
  time: string;
  inspector: string;
  // dataStatus: string[];
  completeTime: string;
  text: string;
  content: string;
  checkTime: string;
  itemStatusLeft: string;
  itemStatusRight: string;
  detail1?: string[];
  detail2?: string[];
  checkStatus: {
    total: string;
    auto: string;
    manual: string;
  };
  categoryStatus: {
    data: string;
    model: string;
    ai: string;
  };
}
const ConnectedFourBoxes = () => {
  const [inspectionData, setInspectionData] = useState<InspectionData>({
    TITLE: "25.6.13 오전 1:30 - 데이터, 모델, AI 서비스 범위 점검 정보",
    status: "미완료",
    time: "25.6.13 오전 1:30",
    inspector: "ID_HONG",
    completeTime: "25.6.13 오전 2:30",
    text: "데이터 오염 점검의 의미: ...",
    content: "데이터 오염 점검의 의미 ....",
    checkStatus: {
      total: "총 점검 항목 : 100",
      auto: "총 자동 점검 : 60/60",
      manual: "총 수동 점검 : 0/40",
    },
    categoryStatus: {
      data: "데이터 : 10/30",
      model: "모델 : 20/30",
      ai: "AI 서비스 : 10/10",
    },
    checkTime:
      "자동 배정 모델 20/30, AI 서비스 10/10, 모델 20/30 모델 20/30, AI 서비스 10/10, 모델 20/30 모델 20/30, AI 서비스 10/10, 모델 20/30",
    itemStatusLeft: "모델 20/30, AI 서비스 10/10, 모델 20/30",
    itemStatusRight: "AI RED 10/15, 총 자동 점검 60/60, 기타 10/15",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showInputs, setShowInputs] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
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
  const renderBox = (label: string, value: React.ReactNode, hasLine = true) => (
    <Box display="flex" width="100%">
      {hasLine && (
        <Box
          sx={{
            width: "2px",
            backgroundColor: "rgba(0,0,0,0.3)", // Màu đen nhạt (30% độ mờ)
            borderRadius: "2px",
            mr: 1,
          }}
        />
      )}
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box gap={"8px"}>
      <Box sx={{ p: 3 }}>
        <Box
          p={2}
          sx={{
            margin: "9px",
            border: "1px solid grey",
            backgroundColor: "white",
            marginRight: "auto",
            borderRadius: "2px",
            padding: "8px 6px 8px 6px",
            mb: 2,
            p: 2,
          }}
        >
          <Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={12}>
                <Box
                  sx={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      px: 2,
                      py: 1, // fontWeight: 500,
                    }}
                  >
                    Details
                  </Typography>
                </Box>
              </Grid>
              <Grid
                container
                sx={{ mb: 2, p: "6px 10px" }} // padding top-bottom: 6px, left-right: 10px
              >
                {/* Row 1 */}
                <Grid size={3}>
                  {renderBox("검사 상태", inspectionData.status, false)}
                </Grid>
                <Grid size={3}>
                  {renderBox("시작 시간", inspectionData.time)}
                </Grid>
                <Grid size={3}>
                  {renderBox("검토자", inspectionData.inspector)}
                </Grid>
                <Grid size={3}>
                  {renderBox("점검 제목", inspectionData.TITLE)}
                </Grid>
                <Grid size={3}>
                  {renderBox(
                    "데이터 상태",
                    inspectionData.checkStatus.total,
                    false
                  )}
                  {renderBox("", inspectionData.checkStatus.auto, false)}
                  {renderBox("", inspectionData.checkStatus.manual, false)}
                </Grid>
                <Grid size={3}>
                  {renderBox("완료 시간", inspectionData.completeTime)}
                </Grid>
                <Grid size={3}>
                  {renderBox("체크 시간", inspectionData.checkTime)}
                </Grid>
                <Grid size={3}>
                  {renderBox("점검 설명", inspectionData.content)}
                </Grid>
                <Grid size={3}>
                  {renderBox("완료 시간", inspectionData.completeTime, false)}
                </Grid>
                <Grid size={3}>
                  {renderBox("체크 시간", inspectionData.checkTime)}
                </Grid>
                <Grid size={6}>
                  <Box display="flex" width="100%">
                    <Box
                      sx={{
                        width: "2px",
                        backgroundColor: "rgba(0,0,0,0.3)", // Màu đen nhạt (30% độ mờ)
                        borderRadius: "2px",
                        mr: 1,
                      }}
                    />
                    <Box flex={1} display="flex" flexDirection="column">
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        점검 설명
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {inspectionData.content}
                      </Typography>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          flex={1}
                          mr={2}
                        >
                          {showInputs && (
                            <Box
                              mt={2}
                              display="flex"
                              flexDirection="column"
                              gap={1}
                            >
                              {files.map((item, i) => (
                                <InputField key={i} value={item.name} />
                              ))}
                            </Box>
                          )}
                        </Box>
                        <Box display="flex" alignItems="flex-end">
                          <Button onClick={handleAddClick} label="Button" />
                        </Box>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".jpg,.png,.pdf"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={3}>
                  {renderBox("완료 시간", inspectionData.completeTime, false)}
                </Grid>
                <Grid size={3}>
                  {renderBox("체크 시간", inspectionData.checkTime)}
                </Grid>
                <Grid size={3}>
                  {renderBox("점검 설명", inspectionData.content)}
                </Grid>
                <Grid size={3}>
                  {renderBox("점검 설명", inspectionData.content)}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={3}>
                <Box>
                  {renderBox("완료 시간", inspectionData.completeTime, false)}
                </Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("완료 시간", inspectionData.completeTime)}</Box>
              </Grid>
              <Grid size={4}>
                <Box display="flex" width="100%">
                  <Box
                    sx={{
                      width: "2px",
                      backgroundColor: "rgba(0,0,0,0.3)", // Màu đen nhạt (30% độ mờ)
                      borderRadius: "2px",
                      mr: 1,
                      minHeight: "35%",
                    }}
                  />
                  <Box flex={1} display="flex" flexDirection="column">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      점검 설명
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {inspectionData.content}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        flex={1}
                        mr={2}
                      >
                        {showInputs && (
                          <Box
                            mt={2}
                            display="flex"
                            flexDirection="column"
                            gap={1}
                          >
                            {files.map((item, i) => (
                              <InputField key={i} value={item.name} />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Cột bên phải chứa button nằm ở đáy */}
              {/* <Grid size={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    // minHeight: "220px",
                    height: "100%",
                    // pl: 6, // padding-left
                  }}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid> */}
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  minHeight={"280px"}
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid size={2}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                  gap={1}
                >
                  <Button onClick={handleAddClick} label="파일 첨부" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.png,.pdf"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>

              {/* <Typography variant="caption" align="center">
                    {files.length} 개의 파일이 선택 되었습니다.
                  </Typography> */}

              {/* <Button onClick={handleAddClick} label="파일 첨부" /> */}
              {/* <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.content)}</Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.content)}</Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.content)}</Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.content)}</Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.completeTime)}</Box>
              </Grid>
              <Grid size={3}>
                <Box>{renderBox("점검 설명", inspectionData.content)}</Box>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectedFourBoxes;
