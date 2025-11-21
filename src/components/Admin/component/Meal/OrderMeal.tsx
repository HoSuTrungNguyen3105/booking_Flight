import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Grid,
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";

import { PlusCircle } from "lucide-react";
import MenuTabs from "./MenuTabs";
import OrderTable, { type OrderItem } from "./OrderTable";
import type { Meal } from "../../../../utils/type";
import { useGetMeal } from "../../../../context/Api/MealApi";

const OrderMeal = () => {
  const { mealData } = useGetMeal();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Meal["mealType"]>("Breakfast");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Meal | null>(null);
  const [search, setSearch] = useState("");

  const menu = useMemo(() => mealData?.list || [], [mealData]);

  useEffect(() => {
    // setMenu([]); // This is no longer needed as menu is derived from mealData
  }, []);

  function handleDeleteMenu(id: number) {
    // Implement delete logic if needed, or remove this function if not used
    // For now, we just remove from cart if it's there
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  // add to cart (create or increase)
  function handleAddToCart(menuItem: Meal) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === menuItem.id);
      if (existing) {
        return prev.map((c) =>
          c.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        const newCartItem: OrderItem = {
          id: menuItem.id,
          mealCode: menuItem.mealCode,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        };
        return [...prev, newCartItem];
      }
    });
  }

  function handleRemove(id: number) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function handleUpdateQty(id: number, qty: number) {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c))
    );
  }

  function handleUpdateNote(id: number, note: string) {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, note } : c)));
  }

  function handleSubmitOrder() {
    // TODO: Implement submit logic (e.g., create FlightMeals)
    console.log("Submitting order:", cart);
    setCart([]);
  }

  function handleClearCart() {
    setCart([]);
  }

  // search filter
  const filteredMenu = useMemo(() => {
    return menu.filter((m) => {
      const matchesCategory = m.mealType === selectedCategory;
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.mealCode.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, search]);

  return (
    <Box>
      {/* <HeaderBar /> */}

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditingItem(null);
                      setDialogOpen(true);
                    }}
                  >
                    <PlusCircle />
                  </IconButton>
                </Box>
              </Box>

              <MenuTabs
                menu={filteredMenu}
                onAddToCart={handleAddToCart}
                value={selectedCategory}
                onChange={(c) => setSelectedCategory(c)}
                onEditItem={(i) => {
                  // setEditingItem(i);
                  setDialogOpen(true);
                }}
                onDeleteItem={(id) => handleDeleteMenu(id)}
              />

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Selected Items
                </Typography>
                <OrderTable
                  items={cart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                  onUpdateNote={handleUpdateNote}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={4}>
            {/* <CartSidebar items={cart} onSubmit={handleSubmitOrder} onClear={handleClearCart} /> */}
          </Grid>
        </Grid>
      </Container>

      {/* <AddMenuItemDialog
        open={dialogOpen}
        onClose={()=>setDialogOpen(false)}
        onSave={handleAddOrUpdateMenu}
        initial={editingItem}
      /> */}
    </Box>
  );
};

export default OrderMeal;
