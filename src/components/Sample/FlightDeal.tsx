import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlightDealsCard from "./FlightDealsCard";
import right from "../../svgs/system-users-symbolic.svg";
import shangai from "../../svgs/system-users-symbolic.svg";
import temple from "../../svgs/system-users-symbolic.svg";
import sydney from "../../svgs/system-users-symbolic.svg";
import sunrise from "../../svgs/system-users-symbolic.svg";
import msunrise from "../../svgs/system-users-symbolic.svg";
import { memo } from "react";

const FlightDealsAccept = () => {
  const navigate = useNavigate();

  const handleSeeAllClick = () => {
    // e.preventDefault();
    // window.scrollTo(0, 0);
    // navigate("/packages");
  };

  return (
    <Box sx={{ px: 8, display: "flex", flexDirection: "column", gap: 7 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: "#6E7491",
            fontWeight: { xs: 500, md: 700 },
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "22px", md: "32px" },
          }}
        >
          Find your next adventure <br className="block sm:hidden" />
          with these{" "}
          <Typography component="span" sx={{ color: "#605DEC" }}>
            flight deals
          </Typography>
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          onClick={handleSeeAllClick}
          sx={{ cursor: "pointer", gap: 1 }}
        >
          <Typography
            sx={{ color: "#A1B0CC", fontSize: { xs: "14px", md: "18px" } }}
          >
            All
          </Typography>
          <Box
            component="img"
            src={right}
            sx={{ width: { xs: 20, md: 24 }, height: { xs: 20, md: 24 } }}
          />
        </Stack>
      </Stack>

      {/* 3 CARDS */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <FlightDealsCard
          image={shangai}
          title="The Bund, "
          name="Shanghai"
          price="$598"
          des=" China’s most international city"
        />
        <FlightDealsCard
          image={sydney}
          title="Sydney Opera House, "
          name="Sydney"
          price="$981"
          des=" Take a stroll along the famous harbor"
        />
        <FlightDealsCard
          image={temple}
          title="Kōdaiji Temple,"
          name="Kyoto"
          price="$633"
          des=" Step back in time in the Gion district"
        />
      </Box>

      {/* BIG DEAL CARD */}
      <Box
        sx={{
          width: "100%",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* IMAGE */}
        <Box sx={{ width: "100%" }}>
          <Box
            component="img"
            src={sunrise}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
              display: { xs: "none", md: "block" },
            }}
          />
          <Box
            component="img"
            src={msunrise}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
              display: { xs: "block", md: "none" },
            }}
          />
        </Box>

        {/* TEXT */}
        {/* <Box
          sx={{
            px: 4,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ fontSize: "16px", color: "#6E7491", fontWeight: 500 }}
            >
              Tsavo East National Park,{" "}
              <Typography component="span" sx={{ color: "#605DEC" }}>
                Kenya
              </Typography>
            </Typography>

            <Typography
              sx={{ fontSize: "16px", color: "#6E7491", fontWeight: 500 }}
            >
              $1,248
            </Typography>
          </Stack>

          <Typography sx={{ color: "#7C8DB0", fontSize: "14px" }}>
            Named after the Tsavo River, and opened in April 1984, Tsavo East
            National Park is one of the oldest parks in Kenya. It is located in
            the semi-arid Taru Desert.
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default memo(FlightDealsAccept);
