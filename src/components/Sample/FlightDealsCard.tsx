import { Box, Typography, Stack } from "@mui/material";

interface FlightDealsCardProps {
  image: string;
  title: string;
  name: string;
  price: string;
  des: string;
}

const FlightDealsCard: React.FC<FlightDealsCardProps> = ({
  image,
  title,
  name,
  price,
  des,
}) => {
  return (
    <Box
      sx={{
        width: "410.67px",
        height: "480px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "0 0 8px 8px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* IMAGE */}
      <Box sx={{ width: "100%", height: "397px" }}>
        <Box
          component="img"
          src={image}
          alt="deal"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
          }}
        />
      </Box>

      {/* CONTENT */}
      <Box sx={{ px: 4, display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{
              color: "#6E7491",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {title}
            <Typography component="span" sx={{ color: "#605DEC" }}>
              {name}
            </Typography>
          </Typography>

          <Typography
            sx={{ color: "#6E7491", fontSize: "16px", fontWeight: 500 }}
          >
            {price}
          </Typography>
        </Stack>

        <Typography sx={{ color: "#7C8DB0", fontSize: "14px" }}>
          {des}
        </Typography>
      </Box>
    </Box>
  );
};

export default FlightDealsCard;
