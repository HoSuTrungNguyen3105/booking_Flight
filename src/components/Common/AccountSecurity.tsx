import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import {
  useDeleteSessionsFromID,
  useLogoutAllSessions,
  usePassengerSessions,
} from "../../context/Api/usePostApi";
import { useAuth, type AuthType } from "../../context/AuthContext";
import type { UserSession } from "../../utils/type";
import { ResponseCode } from "../../utils/response";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import InputTextField from "../../common/Input/InputTextField";

const AccountSecurity: React.FC = () => {
  const { passenger, user } = useAuth();
  const [displaySessions, setDisplaySessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState<number | null>(null);

  const { refetchPassengerSessions } = usePassengerSessions();

  const { refetchLogoutAllSessions } = useLogoutAllSessions();

  const { refetchDeleteSessions } = useDeleteSessionsFromID();

  const handleRefetchUserSessions = async () => {
    setLoading(true);
    try {
      const response = await refetchPassengerSessions({
        passengerId: passenger?.id || "",
      });
      if (response?.resultCode === ResponseCode.SUCCESS) {
        setDisplaySessions(response.list || []);
      } else {
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefetchUserSessions();
  }, []);

  const handleLogoutSession = async (sesId: number) => {
    if (!sesId) return;

    try {
      setSessionId(sesId);

      const savedState = (localStorage.getItem("stateLogin") as AuthType) || "";

      const payload =
        savedState === "ADMIN"
          ? { userId: user?.id ?? 0, passengerId: null }
          : { userId: null, passengerId: passenger?.id ?? "" };

      const res = await refetchDeleteSessions({
        ...payload,
        sessionId: sesId,
      });

      if (res?.resultCode === ResponseCode.SUCCESS) {
        handleRefetchUserSessions();
        // setDisplaySessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
      }
    } catch (error) {
      console.error("Logout session error:", error);
      // setSnackbar({
      //   open: true,
      //   message: "Không thể đăng xuất thiết bị này.",
      //   severity: "error",
      // });
    } finally {
      // reset sessionId hoặc state khác nếu cần
      setSessionId(0);
    }
  };

  const handleLogoutAllOtherSessions = async () => {
    try {
      const res = await refetchLogoutAllSessions();
      console.log("logoutAllOtherSessions", res);
      setDisplaySessions((prev) => prev.filter((s) => s.isCurrent));
    } catch {}
  };

  const handleCreatePassword = () => {};

  const handleDeleteAccount = () => {};

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", p: 3 }}>
      {/* Email */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600}>
            Email
          </Typography>
          <Divider sx={{ my: 2 }} />
          <InputTextField value={passenger?.email || "Email"} />
        </CardContent>
      </Card>

      {/* Password */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack>
              <Typography variant="h6" fontWeight={600}>
                Password
              </Typography>
              <InputTextField placeholder="••••••••" />
            </Stack>
            <Button
              startIcon={<LockIcon />}
              variant="outlined"
              onClick={handleCreatePassword}
            >
              Tạo mật khẩu
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccount}
          >
            Xóa tài khoản
          </Button>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <DevicesIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Phiên đăng nhập hiện tại
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Kiểm tra các phiên đăng nhập đang hoạt động. Bạn có thể đăng xuất
            khỏi thiết bị khác để đảm bảo an toàn tài khoản.
          </Typography>

          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : displaySessions.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Không tìm thấy phiên đăng nhập nào.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {displaySessions.map((session) => (
                <Card
                  key={session.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: session.isCurrent
                      ? "action.hover"
                      : "background.paper",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 1,
                      px: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {/* Thông tin thiết bị + IP */}
                    <Box>
                      <Typography fontWeight={500} noWrap>
                        {session.device || "Unknown Device"} –{" "}
                        {session.browser || "Browser"} •{" "}
                        {session.ipAddress || "Unknown IP"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.location || "Unknown Location"} ·{" "}
                        {formatDate(
                          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                          session.createdAt
                        )}
                      </Typography>
                      {session.isCurrent && (
                        <Typography
                          variant="caption"
                          color="primary"
                          fontWeight={600}
                        >
                          Phiên hiện tại
                        </Typography>
                      )}
                    </Box>
                    {!session.isCurrent && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={() => handleLogoutSession(session.id)}
                      >
                        Đăng xuất
                      </Button>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}

          {/* Logout all other sessions */}
          {displaySessions.some((s) => !s.isCurrent) && (
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogoutAllOtherSessions}
              >
                Đăng xuất khỏi tất cả thiết bị khác
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountSecurity;
