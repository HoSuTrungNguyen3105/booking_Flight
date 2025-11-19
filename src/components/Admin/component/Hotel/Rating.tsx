import { Star, StarHalf, StarOff } from "lucide-react";
import { Box, Typography } from "@mui/material";

type TReview = {
  reviews?: number;
};

const Rating: React.FC<TReview> = ({ reviews = 0 }) => {
  const starIcons = Array.from({ length: 5 }, (_, i) => {
    const index = i + 1;

    if (reviews >= index) return <Star key={i} size={20} />;
    if (reviews >= index - 0.5) return <StarHalf key={i} size={20} />;
    return <StarOff key={i} size={20} />;
  });

  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      {starIcons}
      <Typography variant="body2" color="text.secondary">
        ({reviews} Reviews)
      </Typography>
    </Box>
  );
};

export default Rating;
