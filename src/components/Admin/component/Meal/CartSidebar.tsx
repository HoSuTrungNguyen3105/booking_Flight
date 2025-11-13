import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import type { Meal, MealOrder } from "../../../../utils/type";

type Props = {
  meal: Meal[];
  items: MealOrder[];
  onSubmit: () => void;
  onClear: () => void;
};

export default function CartSidebar({ items, meal, onSubmit, onClear }: Props) {
  const total = items.reduce((s, it) => s + it.quantity + 2, 0);
  const meals = meal.reduce((s, it) => s + it.price + total, 0);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Trip / Flight
      </Typography>
      <Typography variant="body2">LBG → HKG</Typography>
      <Typography variant="body2">Date: 30th Jan 2025</Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Order Summary</Typography>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>Items</Typography>
        <Typography>{items.length}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>Total</Typography>
        <Typography fontWeight={700}>${meals.toFixed(2)}</Typography>
      </Box>

      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={items.length === 0}
        >
          Submit Order
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClear}>
          Clear
        </Button>
      </Box>
    </Paper>
  );
}
