import React, { useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import type { Meal } from "../../../../utils/type";

type Props = {
  menu: Meal[];
  onAddToCart: (menuItem: Meal) => void;
  value: Meal["mealType"];
  onChange: (newCat: Meal) => void;
  onEditItem: (item: Meal) => void;
  onDeleteItem: (id: number) => void;
};

const categories: Meal["mealType"][] = [
  "Breakfast",
  "Bakery",
  "Snacks & Sandwiches",
  "Drinks",
  "Other",
];

export default function MenuTabs({
  menu,
  onAddToCart,
  value,
  onChange,
  onEditItem,
  onDeleteItem,
}: Props) {
  const grouped = useMemo(() => {
    const map = new Map<(typeof categories)[number], Meal[]>();
    categories.forEach((c) => map.set(c, []));
    menu.forEach((m) => {
      map.get(m.mealType)?.push(m);
    });
    return map;
  }, [menu]);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={(e, val) => onChange(val as Meal)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map((c) => (
          <Tab
            key={c}
            label={`${c} (${grouped.get(c)?.length ?? 0})`}
            value={c}
          />
        ))}
      </Tabs>

      <Box mt={2}>
        <Grid container spacing={2}>
          {(grouped.get(value) || []).map((item) => (
            <Grid key={item.id} size={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" mt={1}>
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => onAddToCart(item)}>
                    Add
                  </Button>
                  <Button size="small" onClick={() => onEditItem(item)}>
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
      </Box>
    </Box>
  );
}
