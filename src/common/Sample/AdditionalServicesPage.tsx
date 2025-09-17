import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Divider,
  useTheme,
} from "@mui/material";

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  checked: boolean;
}

const AdditionalServicesPage: React.FC = () => {
  const theme = useTheme();
  const [services, setServices] = useState<AdditionalService[]>([
    {
      id: "luggage-1",
      name: "Hành lý ký gửi thêm",
      description: "Thêm 10kg hành lý ký gửi",
      price: 250000,
      checked: false,
    },
    {
      id: "luggage-2",
      name: "Hành lý ký gửi cao cấp",
      description: "Thêm 20kg hành lý ký gửi",
      price: 450000,
      checked: false,
    },
    {
      id: "meal-1",
      name: "Suất ăn đặc biệt",
      description: "Suất ăn theo chế độ đặc biệt",
      price: 150000,
      checked: false,
    },
    {
      id: "meal-2",
      name: "Suất ăn trẻ em",
      description: "Suất ăn dành riêng cho trẻ em",
      price: 120000,
      checked: false,
    },
    {
      id: "meal-3",
      name: "Suất ăn chay",
      description: "Suất ăn chay đảm bảo dinh dưỡng",
      price: 100000,
      checked: false,
    },
  ]);

  const handleServiceChange =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setServices(
        services.map((service) =>
          service.id === id
            ? { ...service, checked: event.target.checked }
            : service
        )
      );
    };

  const calculateTotal = (): number => {
    return services
      .filter((service) => service.checked)
      .reduce((total, service) => total + service.price, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSubmit = () => {
    const selectedServices = services.filter((service) => service.checked);
    console.log("Dịch vụ đã chọn:", selectedServices);
    console.log("Tổng tiền:", formatCurrency(calculateTotal()));
    // Gửi dữ liệu đến API hoặc xử lý tiếp
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
      >
        Dịch vụ bổ sung
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.primary }}
      >
        Nâng cao trải nghiệm chuyến bay của bạn với các dịch vụ bổ sung dưới
        đây.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ color: theme.palette.primary.main }}
          >
            Hành lý ký gửi
          </Typography>

          {/* <Grid container spacing={2}>
            {services
              .filter((s) => s.id.includes("luggage"))
              .map((service) => (
                <Grid size={12} key={service.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={service.checked}
                        onChange={handleServiceChange(service.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          >
                            {service.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {service.description}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        >
                          {formatCurrency(service.price)}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%", ml: 0 }}
                  />
                </Grid>
              ))}
          </Grid> */}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ color: theme.palette.primary.main }}
          >
            Suất ăn đặc biệt
          </Typography>

          <Grid container spacing={2}>
            {services
              .filter((s) => s.id.includes("meal"))
              .map((service) => (
                <Grid size={12} key={service.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={service.checked}
                        onChange={handleServiceChange(service.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          >
                            {service.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {service.description}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        >
                          {formatCurrency(service.price)}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%", ml: 0 }}
                  />
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.primary.main }}
          >
            Tổng cộng
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Tổng tiền dịch vụ:</Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              {formatCurrency(calculateTotal())}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Xác nhận dịch vụ bổ sung
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdditionalServicesPage;
