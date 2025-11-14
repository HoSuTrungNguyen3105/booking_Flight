import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Pagination,
  Stack,
  Divider,
} from "@mui/material";
import {
  ArrowRightAlt,
  CalendarToday,
  ExpandMore,
  Add,
} from "@mui/icons-material";

// Types
interface FlightDeal {
  id: number;
  from: string;
  to: string;
  date: string;
  price: number;
  isPopular?: boolean;
}

interface FlightDealsProps {
  deals?: FlightDeal[];
}

// Default data
const defaultDeals: FlightDeal[] = [
  {
    id: 1,
    from: "Hồ Chí Minh",
    to: "Đà Nẵng",
    date: "2026-02-10",
    price: 666000,
    isPopular: true,
  },
  {
    id: 2,
    from: "Đà Nẵng",
    to: "Hà Nội",
    date: "2025-11-28",
    price: 849000,
  },
  {
    id: 3,
    from: "Đà Nẵng",
    to: "Đà Lạt",
    date: "2025-12-11",
    price: 1256000,
  },
  {
    id: 4,
    from: "Đà Nẵng",
    to: "Nha Trang",
    date: "2025-12-16",
    price: 936000,
  },
];

// Component
const FlightDeals: React.FC<FlightDealsProps> = ({ deals = defaultDeals }) => {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
        }}
      >
        Khám Phá Các Chuyến Bay Phổ Biến Nhất Của Chúng Tôi
      </Typography>

      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          IconComponent={ExpandMore}
          sx={{
            minWidth: 300,
            backgroundColor: "white",
            "& .MuiSelect-select": {
              py: 1.5,
            },
          }}
        >
          <MenuItem value="all">Đà Nẵng (DAD), Việt Nam - Tất cả</MenuItem>
          <MenuItem value="hanoi">Hà Nội (HAN)</MenuItem>
          <MenuItem value="hcm">Hồ Chí Minh (SGN)</MenuItem>
          <MenuItem value="dalat">Đà Lạt (DLI)</MenuItem>
          <MenuItem value="nhatrang">Nha Trang (CXR)</MenuItem>
        </Select>

        <Chip
          label="Ngân sách"
          variant="outlined"
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Flight Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {deals.map((deal) => (
          <Grid size={6} key={deal.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                border: deal.isPopular ? "2px solid" : "1px solid",
                borderColor: deal.isPopular ? "primary.main" : "grey.200",
                position: "relative",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              {deal.isPopular && (
                <Chip
                  label="PHỔ BIẾN"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: 16,
                    fontWeight: "bold",
                  }}
                />
              )}

              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="h3" fontWeight="bold">
                      {deal.from} <ArrowRightAlt sx={{ fontSize: 20, mx: 1 }} />{" "}
                      {deal.to}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        color: "text.secondary",
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="body2">
                        {formatDate(deal.date)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                  >
                    {formatPrice(deal.price)}
                  </Typography>
                </Box>

                <Button
                  variant={deal.isPopular ? "contained" : "outlined"}
                  fullWidth
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    fontWeight: "bold",
                  }}
                >
                  ĐẶT VÉ NGAY
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Other Services */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Dịch vụ khác
        </Typography>
      </Box>

      {/* Pagination and Load More */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          (1/4)
        </Typography>

        <Button
          variant="outlined"
          endIcon={<ExpandMore />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: "bold",
          }}
        >
          Xem thêm
        </Button>
      </Box>

      {/* MUI Pagination (alternative) */}
      <Stack spacing={2} sx={{ alignItems: "center", mt: 2 }}>
        <Pagination
          count={4}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default FlightDeals;
