import { memo, useCallback, useState } from "react";
import BaseModal from "../../Modal/BaseModal";
import type { GeneratePayroll } from "../PayrollManagement";
import InputTextField from "../../Input/InputTextField";
import { useGeneratePayroll } from "../../../components/Api/usePostApi";
import { Add as AddIcon } from "@mui/icons-material";
import { useGetUserIdAndNameToDropdownGeneratePayroll } from "../../../components/Api/useGetApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfirmDeleteModal = ({
  open,
  onClose,
  onSuccess,
}: IModalGeneratePayrollProps) => {
  const { refetchGeneratePayroll } = useGeneratePayroll();

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={onClose}>
          Save
        </Button>
      </Box>
    );
  }, [onClose]);

  const renderContent = useCallback((data: any) => {
    // if (!payrollData) return null;

    return (
      <>
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin nhân viên
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography>Email: {data.email}</Typography>
                <Typography>Mã NV: {data.employeeNo}</Typography>
                <Typography>Tên: {data.name}</Typography>
                <Typography>Điện thoại: {data.phone || "Chưa có"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography>Chức vụ: {data.role}</Typography>
                <Typography>Cấp bậc: {data.rank}</Typography>
                <Typography>
                  Lương cơ bản: {data.baseSalary.toLocaleString()} đ
                </Typography>
                <Typography>
                  Ngày vào làm:{" "}
                  {new Date(Number(data.hireDate) * 1000).toLocaleDateString()}
                </Typography>
                <Chip
                  label={data.status}
                  color={data.status === "ACTIVE" ? "success" : "error"}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Thống kê */}
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thống kê liên kết
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(data._count).map(([key, value]) => (
                <Grid size={4} key={key}>
                  <Typography>
                    {key}: <strong>{value as number}</strong>
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Payrolls */}
        {data.payrolls?.length > 0 && (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Danh sách Payrolls
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Allowances</TableCell>
                    <TableCell>Generated At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.payrolls.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.allowances.toLocaleString()} đ</TableCell>
                      <TableCell>
                        {new Date(Number(p.generatedAt)).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Attendance */}
        {data.attendance?.length > 0 && (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ul>
                {data.attendance.map((a: any) => (
                  <li key={a.id}>Attendance ID: {a.id}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </>
    );
  }, []);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Generate bảng lương"
      Icon={AddIcon}
      // maxWidth="lg"
      // sx={{ maxHeight: "600px", width: "lg" }}
      slots={{ content: renderContent(2), actions: renderActions() }}
    />
  );
};

export default memo(ConfirmDeleteModal);
