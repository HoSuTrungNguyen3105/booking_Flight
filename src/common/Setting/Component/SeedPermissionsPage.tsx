import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Security } from "@mui/icons-material";
import { useSeedPermissions } from "../../../context/Api/AuthApi";
import { ResponseCode } from "../../../utils/response";
import { useToast } from "../../../context/ToastContext";

// You might need to adjust the base URL based on your environment
// const API_BASE_URL = "http://localhost:3000";

const SeedPermissionsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  //   const [status, setStatus] = useState<{
  //     type: "success" | "error";
  //     message: string;
  //   } | null>(null);

  const { refetchSetSeedPermissions } = useSeedPermissions();

  const handleSeedPermissions = async () => {
    setLoading(true);
    // setStatus(null);
    try {
      const data = await refetchSetSeedPermissions();
      if (data?.resultCode === ResponseCode.SUCCESS) {
        toast(
          data.resultMessage || "Permissions seeded successfully!",
          "success"
        );
      } else {
        toast(data?.resultMessage || "Failed to seed permissions.", "error");
      }
    } catch (error) {
      toast("An error occurred while connecting to the server.", "error");
      console.error("Seeding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "30vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        // p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            // backdropFilter: "blur(20px)",
            // bgcolor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ mb: 3 }}>
              <Security sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="800"
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                System Permissions
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="500"
                sx={{ textTransform: "uppercase", letterSpacing: 1 }}
              >
                Manage Role-Based Access Control (RBAC)
              </Typography>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Initialize the database with default permissions for{" "}
              <Box component="span" fontWeight="bold" color="text.primary">
                ADMIN
              </Box>{" "}
              and{" "}
              <Box component="span" fontWeight="bold" color="text.primary">
                MONITOR
              </Box>{" "}
              roles. This action will update existing roles with the latest
              permission sets.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleSeedPermissions}
              disabled={loading}
              fullWidth
              // sx={{
              //   py: 1.5,
              //   borderRadius: 3,
              //   fontSize: "1rem",
              //   fontWeight: "600",
              //   background: "linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)",
              //   boxShadow: "0 4px 14px rgba(0, 114, 255, 0.3)",
              //   textTransform: "none",
              //   "&:hover": {
              //     boxShadow: "0 6px 20px rgba(0, 114, 255, 0.4)",
              //     transform: "translateY(-1px)",
              //   },
              //   transition: "all 0.3s ease",
              // }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Processing...</span>
                </Box>
              ) : (
                "Seed Permissions"
              )}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SeedPermissionsPage;
