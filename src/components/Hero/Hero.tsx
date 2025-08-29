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
  InputAdornment,
  TextField,
} from "@mui/material";
import Image from "../../svgs/wallpaper.jpg";
import { Speed, Security, SupportAgent } from "@mui/icons-material";
import { GridSearchIcon } from "@mui/x-data-grid";

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
          height: "500px", // Tăng chiều cao
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490730101735-85e8a7056461?q=80&w=2670&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Lớp phủ mờ
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            }}
          >
            Find Your Next Adventure
          </Typography>
          <Typography
            variant="h5"
            sx={{ mt: 2, color: theme.palette.grey[300] }}
          >
            Book flights, discover destinations, and start your journey with
            ease.
          </Typography>

          <Box
            sx={{
              mt: 5,
              width: "100%",
              maxWidth: "800px",
              mx: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              p: 2,
              boxShadow: 3,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search flights, destinations..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" sx={{ borderRadius: "12px" }}>
                      Search
                    </Button>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  bgcolor: "white",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Hero;
