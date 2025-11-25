import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../../common/Input/InputTextField";
import TableSection from "../../../../common/AdditionalCustomFC/TableSection";
import type { GridColDef } from "@mui/x-data-grid";
import {
  useFindAllPassenger,
  useGetUserList,
} from "../../../../context/Api/UserApi";

type Permission = string;

interface PermissionsResponse {
  resultCode: string;
  resultMessage: string;
  data: Record<Permission, boolean>;
}

const AdminPermissionsPage: React.FC = () => {
  const [role, setRole] = useState<"ADMIN" | "MONITOR">("ADMIN");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | string>(""); // User or Passenger ID
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { fetchUserList, refetchUser } = useGetUserList();
  const { dataAllPassenger, refetchAllPassenger } = useFindAllPassenger();

    const rowDataPassenger = useMemo(
      () =>
        data?.bookings[0]?.mealOrders?.map((item) => ({
          ...item,
          id: item.id,
        })) || [],
      [data]
    );
  
    const detailData:  GridColDef[] = useMemo([
      {
        title: "Họ và tên",
        description: data?.fullName,
      },
      {
        title: "Email",
        description: data?.email,
      },
      {
        title: "Số điện thoại",
        description: data?.phone,
      },
      {
        title: "Passport",
        description: data?.passport,
      },
      {
        title: "Lần đăng nhập cuối",
        description: formatDate(
          DateFormatEnum.MM_DD_YYYY,
          Number(data?.lastLoginDate)
        ),
      },
      {
        title: "Tài khoản khóa",
        description: data?.accountLockYn === "Y" ? "Đã khóa" : "Hoạt động",
      },
      {
        title: "Flight Booking",
        description: data?.bookings?.[0]?.flight?.flightNo,
      },
      {
        title: "Seat No",
        description:
          data?.bookings?.[0]?.seat?.seatNumber &&
          data?.bookings?.[0]?.seat?.seatRow
            ? `${data.bookings[0].seat.seatNumber} - ${data.bookings[0].seat.seatRow}`
            : "-",
      },
      {
        title: "Email xác thực",
        description:
          data?.isEmailVerified === "Y" ? "Đã xác thực" : "Chưa xác thực",
      },
    ];

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "email",
        flex: 1,
        headerName: "email",
      },
      {
        field: "role",
        flex: 1,
        headerName: "role",
        renderCell: (params: GridRenderCellParams) => {
          let bgColor = "";
          let textColor = "#000";

          switch (params.value) {
            case UserRole.ADMIN:
              bgColor = "#FFF36C"; // Yellow
              break;
            case UserRole.MONITOR:
              bgColor = "#E1BEE7"; // Light purple/pink
              break;
            case UserRole.USER:
              bgColor = "#D6ECE7"; // Light blue
              break;
            default:
              bgColor = "#E0E0E0"; // Grey
          }

          return (
            <Box display="flex" padding={1}>
              <Typography
                sx={{
                  display: "flex",
                  backgroundColor: bgColor,
                  padding: "4px 8px",
                  borderRadius: "3px",
                  color: textColor,
                  width: "90px",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                {params.value}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "accountLockYn",
        headerName: "accountLockYn",
        flex: 1,
        renderCell: ({ row }) => (
          <span>{row.accountLockYn === "Y" ? "Locked" : "Unlocked"}</span>
        ),
      },
      {
        field: "employeeNo",
        headerName: "employeeNo",
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "createdAt",
        flex: 1,
        renderCell: ({ row }) =>
          formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, row.createdAt),
      },
      {
        field: "name",
        headerName: "name",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "actions",
        flex: 1,
        renderCell: ({ row }) => (
          <DropdownCell
            row={row}
            currentUserId={user?.id}
            isAuthenticated={isAuthenticated}
          />
        ),
      },
    ],
    [handleSelectAction, user]
  );

  // Fetch permissions when role or user changes
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<PermissionsResponse>(
          `/auth/permissions/role/${role}`
        );
        if (response.data.resultCode === "00") {
          setPermissions(response.data.data);
        } else {
          setError("Failed to fetch permissions.");
        }
      } catch (err) {
        setError("Error fetching permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [role]);

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  const handleRoleChange = (value: string) => {
    setRole(value as "ADMIN" | "MONITOR");
  };

  const handleUserIdChange = (value: string) => {
    setUserId(value);
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    const updatePermissions = {
      permissions,
    };

    try {
      await axios.post(`/auth/permissions/user`, {
        userId,
        permissions,
      });
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating permissions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Permission Management
      </Typography>

      {/* Role Selection */}
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Role</InputLabel>
        <SelectDropdown
          options={[
            { value: "ADMIN", label: "Admin" },
            { value: "MONITOR", label: "Monitor" },
          ]}
          value={role}
          onChange={(value) => handleRoleChange(value as "ADMIN" | "MONITOR")}
        />
        {/* <Select value={role} onChange={handleRoleChange} label="Role">
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="MONITOR">Monitor</MenuItem>
        </Select> */}
      </FormControl>

      <TableSection
        setRows={setSelectedRowChange}
        isLoading={loading}
        nextRowClick
        largeThan
        onSelectedRowIdsChange={handleMealRowSelection}
        rows={rows}
        columns={columns}
      />
      <TableSection
        setRows={setSelectedRowChange}
        isLoading={loading}
        nextRowClick
        largeThan
        onSelectedRowIdsChange={handleMealRowSelection}
        rows={rows}
        columns={columns}
      />

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Permissions for {role}
          </Typography>

          {/* Render Permissions */}
          <Grid container spacing={2}>
            {Object.keys(permissions).map((permission) => (
              <Grid item xs={12} sm={6} key={permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[permission]}
                      onChange={() => handlePermissionChange(permission)}
                      color="primary"
                    />
                  }
                  label={permission}
                />
              </Grid>
            ))}
          </Grid>

          {/* Save Permissions Button */}
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSavePermissions}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AdminPermissionsPage;
