import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { UserRole, type UserData } from "../../utils/type";
import { useGetUserList } from "../../components/Api/useGetApi";

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}
const mockUsers: UserData[] = [
  {
    id: 1,
    email: "nguyen@example.com",
    name: "Nguyễn Văn A",
    userAlias: "nguyenvana",
    firstname: "Nguyễn",
    lastname: "Văn A",
    role: UserRole.ADMIN, // giả sử UserRoleType là union: "ADMIN" | "USER"
    password: "123456",
    createdAt: "2025-08-01T10:00:00Z",
    accountLockYn: "N",
    loginFailCnt: 0,
    mfaEnabledYn: "N",
    mfaSecretKey: "",
    pictureUrl: "https://via.placeholder.com/50",
    rank: "Gold",
    authType: "LOCAL",
    remember: false,
  },
  {
    id: 2,
    email: "yhi@example.com",
    name: "Ý Nhị",
    userAlias: "be_y_nhi",
    firstname: "Ý",
    lastname: "Nhị",
    role: UserRole.ADMIN, // giả sử UserRoleType là union: "ADMIN" | "USER"
    password: "abcdef",
    createdAt: "2025-07-20T08:30:00Z",
    accountLockYn: "Y",
    loginFailCnt: 2,
    mfaEnabledYn: "Y",
    mfaSecretKey: "SECRET123",
    pictureUrl: "https://via.placeholder.com/50",
    rank: "Silver",
    authType: "LOCAL",
    remember: true,
  },
  {
    id: 3,
    email: "tam@example.com",
    name: "Minh Tâm",
    userAlias: "tamminh",
    firstname: "Minh",
    lastname: "Tâm",
    role: UserRole.ADMIN, // giả sử UserRoleType là union: "ADMIN" | "USER"
    password: "tam123",
    createdAt: "2025-08-10T12:15:00Z",
    accountLockYn: "N",
    loginFailCnt: 0,
    mfaEnabledYn: "N",
    mfaSecretKey: "",
    pictureUrl: "https://via.placeholder.com/50",
    rank: "Bronze",
    authType: "OAUTH",
    remember: false,
  },
];
export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    username: "",
    email: "",
    password: "",
  });

  // Khóa / mở khóa tài khoản
  const toggleLock = async (id: number) => {
    await axios.post("/sys/users/setAccountLock", { id });
  };

  // Xóa user
  const deleteUser = async (id: number) => {
    await axios.post("/sys/users/deleteUser", { id });
  };

  return (
    <Card className="p-4 shadow-lg rounded-2xl">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Quản lý người dùng
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          + Tạo User
        </Button>

        {/* Bảng danh sách user */}
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên tài khoản</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.isLocked ? "Đang khóa" : "Hoạt động"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => toggleLock(u.id)}
                    color="warning"
                    variant="outlined"
                    size="small"
                  >
                    {u.isLocked ? "Mở khóa" : "Khóa"}
                  </Button>
                  <Button
                    onClick={() => deleteUser(u.id)}
                    color="error"
                    variant="outlined"
                    size="small"
                    className="ml-2"
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Popup tạo user */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Tạo User mới</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Tên tài khoản"
              fullWidth
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Mật khẩu"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button variant="contained">Tạo</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
