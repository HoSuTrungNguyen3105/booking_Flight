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
  IconButton,
  Tooltip,
  Rating,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  Share,
  CalendarToday,
} from "@mui/icons-material";
import theme from "../../scss/theme";

interface EventCardProps {
  link: () => void;
  name: string;
  image?: string;
  location: string;
  price: number;
  rating?: number;
  tagLabel?: string;
  date?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
  onShare?: () => void;
  availableSpots?: number;
}

const EventCard: React.FC<EventCardProps> = ({
  link,
  name,
  image,
  location,
  price,
  rating = 0,
  tagLabel,
  date,
  onFavorite,
  isFavorite = false,
  onShare,
  availableSpots,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toLocaleString()}`;
  };

  const getSpotsText = (spots?: number) => {
    if (!spots) return null;
    if (spots < 10) return `${spots} spots left`;
    if (spots < 20) return "Almost full";
    return null;
  };

  const spotsText = getSpotsText(availableSpots);
  const isLowAvailability = availableSpots && availableSpots < 20;

  return (
    <Card
      sx={{
        width: isMobile ? "100%" : 350,
        minWidth: isMobile ? "100%" : 350,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        {image && !imageError ? (
          <CardMedia
            component="img"
            height={250}
            width={200}
            image={image}
            alt={name}
            sx={{
              objectFit: "cover",
              display: imageLoaded ? "block" : "none",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1/1",
              bgcolor: "#f5f5f5",
              height: 250,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: 2,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              No image available
            </Typography>
          </Box>
        )}

        {/* Top Badges */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Stack direction="column" spacing={1}>
            {tagLabel && (
              <Chip
                label={tagLabel}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
                size="small"
              />
            )}
            {isLowAvailability && (
              <Chip
                label={spotsText}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
                size="small"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {onShare && (
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={onShare}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,1)",
                    },
                  }}
                >
                  <Share sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {onFavorite && (
              <Tooltip
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <IconButton
                  size="small"
                  onClick={onFavorite}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,1)",
                    },
                  }}
                >
                  {isFavorite ? (
                    <Favorite
                      sx={{ fontSize: 18, color: theme.palette.error.main }}
                    />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          "&:last-child": { pb: 2.5 },
        }}
      >
        {/* Event Name */}
        <Tooltip title={name} placement="top">
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "48px",
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            {name}
          </Typography>
        </Tooltip>

        {/* Location and Date */}
        <Stack spacing={1} mb={2}>
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

          {date && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CalendarToday
                sx={{ fontSize: 16, color: theme.palette.text.secondary }}
              />
              <Typography variant="body2" color="text.secondary">
                {date}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Rating and Price */}
        <Box sx={{ mt: "auto" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Rating
                value={rating}
                readOnly
                size="small"
                precision={0.5}
                sx={{ fontSize: "1.1rem" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                ({rating.toFixed(1)})
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              fontWeight={700}
              color="primary"
              sx={{ fontSize: "1.25rem" }}
            >
              {formatPrice(price)}
            </Typography>
          </Stack>
        </Box>
      </CardContent>

      {/* Action Section */}
      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          onClick={link}
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            borderRadius: 3,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
