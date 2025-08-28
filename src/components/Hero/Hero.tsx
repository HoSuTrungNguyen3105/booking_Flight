import React, { useState } from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Fade,
//   Slide,
// } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "../../svgs/wallpaper.jpg";
import { Speed, Security, SupportAgent } from "@mui/icons-material";

interface FlightSearchForm {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  flightType: "oneway" | "roundtrip";
  cabinClass: "economy" | "business" | "first";
}

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    flightType: "roundtrip",
    cabinClass: "economy",
  });

  const handleInputChange = (
    field: keyof FlightSearchForm,
    value: string | number
  ) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFlightTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFlightType: "oneway" | "roundtrip"
  ) => {
    if (newFlightType !== null) {
      handleInputChange("flightType", newFlightType);
    }
  };

  const handleSearch = () => {
    console.log("Searching flights with:", searchForm);
    // Handle search logic here
  };

  const cabinOptions = [
    { value: "economy", label: "Phổ thông" },
    { value: "business", label: "Thương gia" },
    { value: "first", label: "Hạng nhất" },
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

  //return (
  // <Box
  //   sx={{
  //     minHeight: "100vh",
  //     bgcolor: "#f9f9f9",
  //     display: "flex",
  //     alignItems: "center",
  //   }}
  // >
  //   <Container maxWidth="lg" sx={{ mt: 8 }}>
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "space-between",
  //         flexWrap: "wrap",
  //       }}
  //     >
  //       {/* Left text */}
  //       <Box sx={{ maxWidth: "300px" }}>
  //         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
  //           ELEVATE YOUR TRAVEL JOURNEY
  //         </Typography>

  //         <Typography
  //           variant="h3"
  //           fontWeight="bold"
  //           sx={{ mb: 3, lineHeight: 1.2 }}
  //         >
  //           Experience <br /> The Magic Of Flight!
  //         </Typography>

  //         <Button
  //           variant="contained"
  //           sx={{
  //             bgcolor: "#1976d2",
  //             borderRadius: "25px",
  //             px: 4,
  //             py: 1.5,
  //             textTransform: "none",
  //             fontSize: "16px",
  //           }}
  //         >
  //           Book A Trip Now
  //         </Button>
  //       </Box>

  //       {/* Right image */}
  //       <Box
  //         component="img"
  //         src={Image}
  //         alt="Airplane"
  //         sx={{
  //           width: { xs: "100%", md: "50%" },
  //           borderRadius: "20px",
  //           mt: { xs: 4, md: 0 },
  //         }}
  //       />
  //     </Box>
  //   </Container>
  // </Box>
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 6,
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          color={theme.palette.grey[500]}
          fontWeight="bold"
        >
          Experience The Magic Of Flight!
        </Typography>
        <Typography color={theme.palette.grey[500]} variant="h6" sx={{ mt: 2 }}>
          Elevate your travel journey
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 4, borderRadius: "25px", px: 4, py: 1.5 }}
        >
          Book A Trip Now
        </Button>
      </Box>

      {/* Popular Destination */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Popular Destination
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Unleash Your Wanderlust With Skywings
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {destinations.map((dest, index) => (
            <Grid key={index} size={12}>
              <Card
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={dest.image}
                  alt={dest.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {dest.title}
                  </Typography>
                  <Typography color="text.secondary">{dest.reviews}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Hero;
