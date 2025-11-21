import { Box, Stack } from "@mui/material";
import ButtonCircle from "../../common/Button/ButtonCircle";
import CardGroup from "../../common/AdditionalCustomFC/CardGroup";
import { ControlCameraTwoTone, RoomService, Sports } from "@mui/icons-material";
import EventCard from "../../common/AdditionalCustomFC/EventCard";
// import { useGetAllHotels, useGetFlightData } from "../../context/Api/useGetApi";
import { useNavigate } from "react-router-dom";
import FlightDeals from "../Admin/component/Flight/components/FlightDeals";
// import HeroV2 from "./HeroV2";
// import HeroV3 from "./HeroV3";
import FlightSearchForm from "./FlightSearchForm";
import { useGetFlightData } from "../../context/Api/FlightApi";
import { useGetAllHotels } from "../../context/Api/HotelApi";

const Hero = () => {
  const { dataGetAllHotels } = useGetAllHotels();
  const { getFlightData } = useGetFlightData();
  const navigate = useNavigate();

  const handleNavigate = (code: string) => {
    navigate("/detail", {
      state: {
        code,
      },
    });
  };

  return (
    <Box
      component="main"
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5" }}
    >
      {/* Hero Banner Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: "auto",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay
            zIndex: 1,
          },
          pt: 10,
          pb: 10,
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1200px",
            px: 2,
          }}
        >
          <Box
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 4,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Explore the World with Us
          </Box>

          <Box padding={1} textAlign={"center"} sx={{ mb: 4 }}>
            <FlightSearchForm type="flight" />
          </Box>

          <Stack
            component="nav"
            direction="row"
            spacing={5}
            justifyContent="center"
            alignItems="center"
            sx={{ flexWrap: "wrap", mt: 2 }}
          >
            <ButtonCircle
              icon={<ControlCameraTwoTone />}
              text="Concert"
              url="list"
            />
            <ButtonCircle icon={<RoomService />} text="Hotels" url="list" />
            <ButtonCircle icon={<Sports />} text="Flights" url="list" />
          </Stack>
        </Box>
      </Box>

      {/* Content Sections */}
      <Box
        component="section"
        sx={{ py: 6, px: 2, maxWidth: "1200px", mx: "auto" }}
      >
        <FlightDeals />
      </Box>

      <Box
        component="section"
        sx={{ py: 4, px: 2, maxWidth: "1200px", mx: "auto" }}
      >
        <CardGroup url="/products" title="Featured Hotels" color="primary">
          {dataGetAllHotels?.list?.map((e, i) => (
            <EventCard
              key={i + 21}
              link={() => handleNavigate(e?.hotelCode || "")}
              location={e.address}
              tagLabel={e.hotelCode || ""}
              price={e.price}
              rating={e.rating}
              name={e.name}
              image={e.imageUrl}
            />
          ))}
        </CardGroup>
      </Box>

      <Box
        component="section"
        sx={{ py: 4, px: 2, maxWidth: "1200px", mx: "auto", mb: 8 }}
      >
        <CardGroup url="/products" title="Popular Flights" color="primary">
          {getFlightData?.list?.map((e, i) => (
            <EventCard
              key={i + 5}
              link={() => handleNavigate(e?.flightNo || "")}
              location={e.departureAirport}
              tagLabel={e.flightNo || ""}
              price={e.priceBusiness || 0}
              availableSpots={
                e.seats?.filter((seat) => seat.isAvailable).length ?? 0
              }
              rating={0}
              name={e.flightNo || ""}
            />
          ))}
        </CardGroup>
      </Box>
    </Box>
  );
};

export default Hero;
