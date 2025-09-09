import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import FlightTheme from "../../../svgs/wallpaper.jpg";
import theme from "../../../scss/theme";
import { Security, Speed, SupportAgent } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Special = () => {
  const { t } = useTranslation();
  const destinations = [
    {
      title: "Forest Wild Life",
      image: "https://source.unsplash.com/400x300/?forest",
      reviews: "4.8 ★",
    },
    {
      title: "Beach Paradise",
      image: "https://source.unsplash.com/400x300/?beach",
      reviews: "4.7 ★",
    },
    {
      title: "Mountain Escape",
      image: "https://source.unsplash.com/400x300/?mountain",
      reviews: "4.9 ★",
    },
  ];

  const cabinOptions = [
    { value: "economy", label: "Phổ thông" },
    { value: "business", label: "Thương gia" },
    { value: "first", label: "Hạng nhất" },
  ];
  const items = [
    { id: 1, title: "Paris", img: "/images/paris.jpg" },
    { id: 2, title: "Tokyo", img: "/images/tokyo.jpg" },
    { id: 3, title: "New York", img: "/images/newyork.jpg" },
    { id: 4, title: "London", img: "/images/london.jpg" },
    { id: 5, title: "Rome", img: "/images/rome.jpg" },
  ];

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: "Đặt vé nhanh chóng",
      description: "Chỉ với vài bước đơn giản để có vé máy bay",
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Bảo mật tuyệt đối",
      description: "Thông tin cá nhân được bảo vệ hoàn toàn",
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn sẵn sàng hỗ trợ mọi lúc",
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          px: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              flex: "0 0 auto",
              width: { xs: "70%", sm: "40%", md: "30%" }, // hiển thị 3–5 panel tùy màn hình
              scrollSnapAlign: "start",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              image={item.img}
              alt={item.title}
              sx={{
                height: 200,
                objectFit: "cover",
                borderRadius: 3,
              }}
            />
            <Typography variant="h6" align="center" sx={{ p: 1 }}>
              {item.title}
            </Typography>
          </Card>
        ))}
      </Box>
      {/* Popular Destinations Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          {t("title")}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t("title1")}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {destinations.map((dest, index) => (
            <Grid key={index} size={12}>
              <Card
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: 6,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-10px)", boxShadow: 10 },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={dest.image}
                  alt={dest.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {dest.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {dest.reviews}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Special;
