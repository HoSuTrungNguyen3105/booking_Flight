import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import "./index.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { DropdownOptions } from "../../common/Dropdown/type";
import InputField from "../../common/Input/InputField";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "../../common/Dropdown/Dropdown";
const Registration = () => {
  const { control } = useForm();
  // const { t } = useTranslation();
  const phoneOptions = [
    { label: "Option normal 1", value: 0, type: "normal" },
    { label: "Option normal 1", value: 0, type: "normal" },
    { label: "Option normal 1", value: 0, type: "normal" },
  ];
  const countryCodeOptions = [
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
  ];
  const areaCodeOptions = [
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
  ];
  const moneyUnit = [
    { label: "원(KRW)", value: "원(KRW)" },
    { label: "달러(USD)", value: "달러(USD)" },
  ];
  const Languages = [
    { label: "언어선택", value: "언어선택" },
    { label: "영어", value: "영어" },
    { label: "한국어", value: "한국어" },
  ];
  const Mails = [
    { label: "gmail.com", value: "gmail.com" },
    { label: "lgensol.com", value: "lgensol.com" },
  ];
  const [input, setInput] = useState("");
  const [link, setLink] = useState("");

  const handleBlur = () => {
    if (input.startsWith("http://") || input.startsWith("https://")) {
      setLink(input);
    } else {
      setLink("");
    }
  };

  const [value, setValue] = useState(0.0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (/^https?:\/\/[^\s]+$/.test(link)) {
      window.open(link, "_blank");
    }
  };

  const handleIncrease = () => {
    setValue((prev) => Number((prev + 0.1).toFixed(1)));
  };

  const handleDecrease = () => {
    setValue((prev) => Number((prev - 0.1).toFixed(1)));
  };

  const [selectPhoneNumber, setSelectPhoneNumber] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);
  const [selectCountryCode, setSelectCountryCode] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);
  const [selectAreaCode, setSelectAreaCode] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);
  const [selectMoneyUnit, setSelectMoneyUnit] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);
  const [selectLanguages, setSelectLanguages] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);
  const [selectMails, setSelectMails] = React.useState<
    DropdownOptions[] | DropdownOptions | null
  >([]);

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>휴대폰</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Dropdown
                  options={phoneOptions}
                  placeholder="선택"
                  label=""
                  sx={{ height: "40px", width: "30%" }}
                  onChange={(event, newValue) => {
                    setSelectPhoneNumber(newValue);
                  }}
                  value={selectPhoneNumber}
                />
                <TextField
                  placeholder="숫자만 입력"
                  sx={{ height: "40px", width: "30%" }}
                />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>일반전화(국가번호 포함시)</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Dropdown
                  options={countryCodeOptions}
                  placeholder=""
                  label=""
                  sx={{ height: "40px", width: "15%" }}
                  onChange={(event, newValue) => {
                    setSelectCountryCode(newValue);
                  }}
                  value={selectCountryCode}
                />
                <Dropdown
                  options={areaCodeOptions}
                  placeholder=""
                  label=""
                  sx={{ height: "40px", width: "15%" }}
                  onChange={(event, newValue) => {
                    setSelectAreaCode(newValue);
                  }}
                  value={selectAreaCode}
                />
                <TextField
                  placeholder="숫자만 입력"
                  sx={{ width: "30%", marginBottom: "auto" }}
                />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>이름 (조회입력)</TableCell>
            <TableCell>
              <TextField
                placeholder="검색어를 입력하세요."
                InputProps={{
                  startAdornment: <SearchIcon color="action" />,
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>주소 (여러줄)</TableCell>
            <TableCell>
              <TextField
                className="disable"
                placeholder="주소입력"
                fullWidth
                disabled
              />
              <TextField
                className="input"
                placeholder="상세주소입력"
                fullWidth
              />
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField placeholder="기본주소" fullWidth />
                <IconButton>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>주소 (한줄)</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField
                  placeholder="주소입력"
                  sx={{ width: "20%" }}
                  disabled
                />
                <TextField placeholder="기본주소" sx={{ width: "40%" }} />
                <TextField placeholder="상세주소입력" sx={{ width: "40%" }} />
                <IconButton>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>이메일</TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  width: "100%",
                }}
              >
                <TextField type="email" placeholder="이메일아이디" />
                @
                <Dropdown
                  options={Mails}
                  placeholder="선택"
                  label=""
                  onChange={(event, newValue) => {
                    setSelectMails(newValue);
                  }}
                  value={selectMails}
                />
                <TextField placeholder="직접입력" />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>주민번호 (뒷자리 암호화)</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField placeholder="앞 6자리" sx={{ width: "20%" }} />
                <p>-</p>
                <TextField
                  type="password"
                  placeholder="뒤 7자리"
                  sx={{ width: "20%" }}
                />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>단위가 있는 수치 - 금액</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField placeholder="숫자만 입력" sx={{ width: "20%" }} />
                <p>원</p>
                <TextField
                  className="word"
                  placeholder="단위가 있는 수치-% "
                  disabled
                />
                <TextField placeholder="숫자만 입력" />
                <p>%</p>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>단위 선택입력 수치</TableCell>
            <TableCell>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField
                  type="number"
                  placeholder="숫자만 입력"
                  sx={{ width: "40%" }}
                />
                <Dropdown
                  options={moneyUnit}
                  placeholder=""
                  label=""
                  sx={{ height: "30%", width: "30%" }}
                  onChange={(event, newValue) => {
                    setSelectMoneyUnit(newValue);
                  }}
                  value={selectMoneyUnit}
                />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>비밀번호</TableCell>
            <TableCell>
              <Controller
                name=""
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="text"
                    isPassword
                    placeholder="비밀번호 입력"
                  />
                )}
              />
              {/* <TextField
                className="text"
                type="password"
                placeholder="비밀번호 입력"
                InputProps={{
                  endAdornment: <VisibilityOffIcon color="action" />,
                }}
              /> */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>수치 (%)</TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  value={value}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: "0.1" }}
                  sx={{ width: 80 }}
                />

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    onClick={handleIncrease}
                    sx={{
                      minWidth: "24px",
                      height: "16px",
                      lineHeight: 1,
                      padding: 0,
                      fontSize: "14px",
                      color: "black",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    +
                  </Button>
                  <Button
                    onClick={handleDecrease}
                    sx={{
                      minWidth: "24px",
                      height: "16px",
                      lineHeight: 1,
                      padding: 0,
                      fontSize: "14px",
                      color: "black",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    −
                  </Button>
                </Box>

                <Tooltip title="정확한 규격대로 입력이 필요할 경우 (예: 0.5, 1.0, 1.5 등의 단위로 입력시)">
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: "gray" }} />
                </Tooltip>

                <Typography fontSize={12} color="gray">
                  정확한 규격대로 입력이 필요할 경우 (예: 0.5, 1.0, 1.5 등의
                  단위로 입력시)
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>첨부파일</TableCell>
            <TableCell>{/* <ThumbnailUploader /> */}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>텍스트링크 </TableCell>
            <TableCell>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Nhập link..."
                value={link}
                onChange={handleChange}
                sx={{
                  width: "100%",
                  input: {
                    color: link ? "#007bff" : "inherit",
                    textDecoration: link ? "underline" : "none",
                    cursor: link ? "pointer" : "text",
                  },
                }}
                onClick={handleClick}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>번역</TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "4px",
                  border: "1px solid black",
                  borderRadius: "4px",
                }}
              >
                <Dropdown
                  options={Languages}
                  placeholder=""
                  label=""
                  sx={{
                    height: "35px",
                    width: "30%",
                    border: "none",
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                    },
                  }}
                  onChange={(event, newValue) => {
                    setSelectLanguages(newValue);
                  }}
                  value={selectLanguages}
                />
                <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                  →
                </Typography>
                <Dropdown
                  options={Languages}
                  placeholder=""
                  label=""
                  sx={{
                    height: "35px",
                    width: "30%",
                    border: "none",
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                    },
                  }}
                  onChange={(event, newValue) => {
                    setSelectPhoneNumber(newValue);
                  }}
                  value={selectPhoneNumber}
                />
                <Button
                  sx={{
                    height: "35px",
                    minWidth: "60px",
                    border: "1px solid black",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    color: "black",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  번역
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default Registration;
