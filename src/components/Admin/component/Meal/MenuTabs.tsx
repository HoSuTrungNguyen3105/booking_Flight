import { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import type { Meal } from "../../../../utils/type";
import TabPanel, {
  type ITabItem,
} from "../../../../common/AdditionalCustomFC/TabPanel";

type Props = {
  menu: Meal[];
  onAddToCart: (menuItem: Meal) => void;
  value: Meal["mealType"];
  onChange: (newCategory: Meal["mealType"]) => void;
  onEditItem: (item: Meal) => void;
  onDeleteItem: (id: number) => void;
};

// Extract all possible meal types from the Meal type
type MealType = Meal["mealType"];

// Define categories based on actual meal types
const categories: ITabItem[] = [
  { label: "Breakfast", value: "Breakfast", description: "Breakfast" },
  { label: "Bakery", value: "Bakery" },
  { label: "Snacks & Sandwiches", value: "Snacks & Sandwiches" },
  { label: "Drinks", value: "Drinks" },
  { label: "Other", value: "Other" },
];

export default function MenuTabs({
  menu,
  onAddToCart,
  value,
  onChange,
  onEditItem,
  onDeleteItem,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const grouped = useMemo(() => {
    const map = new Map<MealType, Meal[]>();

    // Initialize all categories with empty arrays
    categories.forEach((category) => {
      map.set(category.value as MealType, []);
    });

    // Group menu items by mealType
    menu.forEach((item) => {
      const category = item.mealType;
      if (map.has(category)) {
        map.get(category)?.push(item);
      } else {
        // If mealType doesn't match any category, add to "Other"
        map.get("Other")?.push(item);
      }
    });

    return map;
  }, [menu]);

  // Find current tab index based on value
  const currentTabIndex = useMemo(() => {
    return categories.findIndex((category) => category.value === value);
  }, [value]);

  const handleTabChange = (newTabIndex: number) => {
    setActiveTab(newTabIndex);
    const newCategory = categories[newTabIndex]?.value as MealType;
    if (newCategory) {
      onChange(newCategory);
    }
  };

  // Get current category items safely
  const currentItems = useMemo(() => {
    return grouped.get(value) || [];
  }, [grouped, value]);

  return (
    <Box>
      <TabPanel
        tabs={categories}
        onChangeTab={handleTabChange}
        activeTab={activeTab}
      />

      <Box mt={2}>
        <Grid container spacing={2}>
          {currentItems.map((item) => (
            <Grid size={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {item.description}
                  </Typography>
                  <Typography variant="h6" mt={1}>
                    $
                    {typeof item.price === "number"
                      ? item.price.toFixed(2)
                      : "0.00"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => onAddToCart(item)}
                    variant="contained"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="small"
                    onClick={() => onEditItem(item)}
                    color="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {currentItems.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No items found in this category
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
