import React, { useEffect, useState } from "react";
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
import { useGetBaggageData } from "../../components/Api/useGetApi";
import type { Baggage } from "../../utils/type";
import theme from "../../scss/theme";

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  checked: boolean;
}

const AdditionalServicesPage: React.FC = () => {
  const { dataBaggage, refetchBaggageData } = useGetBaggageData();
  // const theme = useTheme();
  const [services, setServices] = useState<Baggage[]>([]);

  useEffect(() => {
    if (dataBaggage?.list) {
      setServices(
        dataBaggage.list.map((item) => ({
          ...item,
          checked: false, // thêm mặc định nếu chưa có
        }))
      );
    }
  }, [dataBaggage]);

  const handleServiceChange =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setServices(
        services.map((service) =>
          service.id === id
            ? { ...service, checked: event.target.checked }
            : service
        )
      );
    };

  const calculateTotal = () => {
    //  return services
    // .filter((service) => service.checked)
    // .reduce((total, service) => total + service.price, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSubmit = () => {
    // services.filter((service) => service.checked);
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", p: 1 }}>
      <Typography
        variant="h4"
        sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
      >
        Dịch vụ bổ sung
      </Typography>

      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
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

          <Grid container spacing={2}>
            {services
              //  .filter((s) => s.id.includes("luggage"))
              .map((service) => (
                <Grid size={12} key={service.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // checked={service.checked}
                        onChange={handleServiceChange(service.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={[]}
                    sx={{ width: "100%", ml: 0 }}
                  />
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
                        {service.flight?.flightNo}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      >
                        {service.ticket?.seatNo}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      >
                        {service.ticket?.seatClass}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {service.weight}
                      </Typography>
                    </Box>
                  </Box>
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
