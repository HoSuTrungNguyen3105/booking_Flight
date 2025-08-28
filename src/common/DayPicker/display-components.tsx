import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "../../i18n";
import { CusDateField } from "./date-field";
import SingleDateRangePickerComponent from "./date-range-field";

const SampleDatePicker: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<"en" | "ko">("en");
  const [value, setValue] = useState<string | null>("2023-08-08");

  const changeLanguage = (lng: "en" | "ko") => {
    i18n.changeLanguage(lng);
    moment.locale(lng);
    setLanguage(lng);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-start", mb: 4, gap: 2 }}
      >
        <Button
          data-testid="language-button-en"
          variant="contained"
          onClick={() => changeLanguage("en")}
        >
          English
        </Button>
        <Button
          data-testid="language-button-ko"
          variant="contained"
          onClick={() => changeLanguage("ko")}
        >
          Korean
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Field</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                status: "Focused - Typing",
                field: (
                  <CusDateField
                    value={value}
                    onChange={(newValue) => setValue(newValue as string | null)}
                    status="default"
                    usecase="date"
                  />
                ),
              },
              {
                status: "Filled",
                field: (
                  <CusDateField
                    value="2023.08.08"
                    status="default"
                    usecase="date"
                  />
                ),
              },
              {
                status: "Disable",
                field: (
                  <CusDateField value="2023.08.08" usecase="date" disabled />
                ),
              },
              {
                status: "ReadOnly",
                field: (
                  <CusDateField value="2023.08.08" usecase="date" readOnly />
                ),
              },
              {
                status: "Error",
                field: (
                  <CusDateField
                    value="2023.08.08"
                    status="error"
                    usecase="date"
                  />
                ),
              },
              {
                status: "Warning",
                field: (
                  <CusDateField
                    value="2023.08.08"
                    status="warning"
                    usecase="date"
                  />
                ),
              },
              {
                status: "Confirmed",
                field: (
                  <CusDateField
                    value="2023.08.08"
                    status="confirmed"
                    usecase="date"
                  />
                ),
              },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.field}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Field</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                status: "Focused",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="default"
                    disabledOpenPicker={false}
                  />
                ),
              },
              {
                status: "Focused - Typing",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="default"
                    size="medium"
                    placeHolder="YYYY.MM.DD - YYYY.MM.DD"
                  />
                ),
              },
              {
                status: "Filled",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="default"
                  />
                ),
              },
              {
                status: "Disable",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="default"
                    disabled
                  />
                ),
              },
              {
                status: "ReadOnly",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    readOnly
                  />
                ),
              },
              {
                status: "Error",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="error"
                  />
                ),
              },
              {
                status: "Warning",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="warning"
                  />
                ),
              },
              {
                status: "Confirmed",
                field: (
                  <SingleDateRangePickerComponent
                    language={language}
                    status="confirmed"
                  />
                ),
              },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.field}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SampleDatePicker;
