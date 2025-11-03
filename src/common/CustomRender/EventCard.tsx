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
} from "@mui/material";
import { Badge } from "@mui/icons-material";
import { Link } from "react-router-dom";
import theme from "../../scss/theme";

interface EventCardProps {
  url: string;
  from: string;
  when: string;
  name: string;
  venue: string;
  image: string;
  color: string;
}

const EventCard: React.FC<EventCardProps> = ({
  url,
  from,
  when,
  name,
  venue,
  image,
  color,
}) => {
  return (
    <Card
      sx={{
        flexShrink: 0,
        width: 300,
        // textAlign: "left",
        borderRadius: 2,
        display: "inline-block",
        //margin: "2px 20px 15px 0",
        backgroundColor: "white", // hoặc use theme.palette.background.paper
        whiteSpace: "normal", // MUI không hỗ trợ !important, dùng "normal" thay cho initial
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Image with Badge */}
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="180" image={image} alt={name} />
        <Box sx={{ position: "absolute", top: 8, left: 8 }}>
          <Badge />
          {/* color={color} text="NEW" */}
        </Box>
      </Box>

      {/* Card content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography color={color} variant="h6" gutterBottom>
          {name}
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2" color={theme.palette.grey[300]}>
            <span className="material-symbols-outlined">event</span> {when}
          </Typography>
          <Typography variant="body2" color={theme.palette.grey[300]}>
            <span className="material-symbols-outlined">apartment</span> {venue}
          </Typography>
          <Typography variant="body2" color={theme.palette.grey[300]}>
            <span className="material-symbols-outlined">local_activity</span>{" "}
            from <strong>£{from}</strong>
          </Typography>
        </Stack>
      </CardContent>

      {/* Card actions */}
      <CardActions sx={{ justifyContent: "center" }}>
        <Link to={`/${url}`}>
          <Button
            // component="a"
            size="large"
            variant="outlined"
            sx={{
              color: color || theme.palette.primary.dark,
              minWidth: 80,
              minHeight: 40,
              borderRadius: 6,
              textTransform: "none",
              border: "1px solid",
              p: 0,
            }}
          >
            Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default EventCard;
