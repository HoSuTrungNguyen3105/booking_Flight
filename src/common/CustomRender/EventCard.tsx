import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";
import { Link } from "react-router-dom";
import theme from "../../scss/theme";

interface EventCardProps {
  link: () => void;
  name: string;
  image?: string;
  location: string;
  price: number;
  rating?: number;
  tagColor?: string;
  tagLabel?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  link,
  name,
  image,
  location,
  price,
  rating = 0,
  tagColor = theme.palette.primary.main,
  tagLabel = "Featured",
}) => {
  return (
    <Box sx={{ my: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: tagColor }}>
          {name}
        </Typography>
        <Button
          variant="contained"
          sx={{ textTransform: "none", backgroundColor: tagColor }}
        >
          See all →
        </Button>
      </Box>

      <Box
        display="flex"
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          gap: 2,
        }}
      >
        <Card
          sx={{
            width: 330,
            minWidth: 330,
            borderRadius: 2,
            overflow: "hidden",
            // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            // transition: "all 0.3s ease",
            // display: "flex",
            // flexDirection: "column",
            // backgroundColor: "#fff",
            // "&:hover": {
            //   transform: "translateY(-4px)",
            //   boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
            // },
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            {image && (
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={name}
                sx={{ objectFit: "cover" }}
              />
            )}
            {tagLabel && (
              <Chip
                label={tagLabel}
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: tagColor,
                  color: "#fff",
                  fontWeight: 500,
                }}
                size="small"
              />
            )}
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 140,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color={theme.palette.text.primary}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: "48px",
                }}
              >
                {name}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOn
                  sx={{ fontSize: 18, color: theme.palette.text.secondary }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {location}
                </Typography>
              </Stack>
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Stack direction="row" alignItems="center" spacing={0.3}>
                <Star sx={{ fontSize: 18, color: "#FFC107" }} />
                <Typography variant="body2" fontWeight={500}>
                  {rating.toFixed(1)}
                </Typography>
              </Stack>

              <Typography variant="body1" fontWeight={600} color="primary">
                ${price.toLocaleString()}
              </Typography>
            </Stack>
          </CardContent>

          <CardActions
            sx={{
              justifyContent: "center",
              pb: 2,
              pt: 0,
            }}
          >
            <Button
              // component={Link}
              // to={link}
              onClick={link}
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 6,
                px: 3,
                py: 1,
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              View Details
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default EventCard;
