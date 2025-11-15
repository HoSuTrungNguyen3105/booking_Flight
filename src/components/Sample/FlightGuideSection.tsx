import React from "react";
import { Box, Grid, Typography, Card, CardActionArea } from "@mui/material";
import { menuData } from "../../utils/name_sb1";

interface FlightGuideCardProps {
  image: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const FlightGuideCard: React.FC<FlightGuideCardProps> = ({
  image,
  title,
  subtitle,
  onClick,
}) => {
  return (
    <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
      <CardActionArea onClick={onClick}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: { xs: 180, sm: 220, md: 250 },
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            bgcolor: "#f9f6f2",
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "background-color 0.3s",
            "&:hover": { bgcolor: "#f1ece4" },
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#00587A", fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#00587A" }}>
            &gt;
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const FlightGuideSection: React.FC<{ title: string }> = ({ title }) => {
  const section = menuData[title];

  // nếu không tồn tại thì trả về UI rỗng
  if (!section) return null;

  const cards = section.items.map((item) => ({
    title: item.label,
    image: item.image || "",
  }));

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 8 }, py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "#00587A",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {section.name}
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, idx) => (
          <Grid size={3} key={idx}>
            <FlightGuideCard
              image={card.image}
              title={card.title}
              subtitle=""
              onClick={() => console.log("Clicked:", card.title)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlightGuideSection;
