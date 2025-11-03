// import { Slider } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";
import ButtonCircle from "../../common/CustomRender/ButtonCircle";
import CardGroup from "../../common/CustomRender/CardGroup";
import theme from "../../scss/theme";

const Hero = () => {
  return (
    <Box
      sx={{
        height: "560px",
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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction="row" // nằm ngang
          spacing={3} // khoảng cách giữa các nút
          justifyContent="center" // căn giữa theo chiều ngang
          alignItems="center" // căn giữa theo chiều dọc
          sx={{ flexWrap: "wrap", mt: 2 }}
        >
          <ButtonCircle icon="stadium" text="Concert" url="list" />
          <ButtonCircle icon="child_care" text="Kids" url="list" />
          <ButtonCircle icon="sports_football" text="Sports" url="list" />
        </Stack>
      </Box>
      {/* <TicketPage /> */}
      <CardGroup
        url="/products"
        title="Featured Products"
        color="primary"
        background="#f5f5f5"
      >
        {[...Array(16)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 250,
              height: 180,
              bgcolor: theme.palette.primary.light,
              borderRadius: 3,
              boxShadow: 3,
              p: 2,
              flexShrink: 0,
            }}
          >
            <Typography variant="subtitle1">Card {i + 1}</Typography>
          </Box>
        ))}
      </CardGroup>
    </Box>
  );
};

export default Hero;
