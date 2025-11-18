import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import { PlusCircle } from "lucide-react";
import MenuTabs from "./MenuTabs";
import OrderTable from "./OrderTable";
import type { FlightMeal, Meal, MealOrder } from "../../../../utils/type";
import type { MealOrderToBooking } from "../../../Employee/types/booking";

type CreateMealOrderDto = Omit<MealOrder, "booking" | "flightMeal">;

const OrderMeal = () => {
  const [menu, setMenu] = useState<Meal[]>([]);
  const [cart, setCart] = useState<MealOrderToBooking[]>([]);
  const [flightMeal, setFlightMeal] = useState<FlightMeal[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Meal["mealType"]>("Breakfast");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MealOrder | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMenu([]);
  }, []);

  // CRUD menu
  // function handleAddOrUpdateMenu(item: MealOrder) {
  //   setMenu((prev) => {
  //     const exists = prev.find((p) => p.id === item.id);
  //     if (exists) {
  //       return prev.map((p) => (p.id === item.id ? item : p));
  //     } else {
  //       return [item, ...prev];
  //     }
  //   });
  // }

  function handleDeleteMenu(id: number) {
    setMenu((prev) => prev.filter((m) => m.id !== id));
    // optionally remove from cart
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  // add to cart (create or increase)
  // function handleAddToCart(menuItem: CreateMealOrderDto) {
  //   setCart((prev) => {
  //     const existing = prev.find((c) => c.id === menuItem.id);
  //     if (existing) {
  //       return prev.map((c) =>
  //         c.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c
  //       );
  //     } else {
  //       const newCart: CreateMealOrderDto = {
  //         id: menuItem.id,
  //         bookingId: menuItem.bookingId,
  //         flightMealId: menuItem.flightMealId,
  //         quantity: menuItem.quantity,
  //       };
  //       return [...prev, newCart];
  //     }
  //   });
  // }

  function handleUpdateQty(id: string, qty: number) {
    // setCart((prev) =>
    //   prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c))
    // );
  }

  function handleRemove(id: string) {
    // setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function handleUpdateNote(id: string, note: string) {
    // setCart((prev) => prev.map((c) => (c.id === id ? { ...c, note } : c)));
  }

  function handleSubmitOrder() {
    // demo: log order, clear cart
    // const order = {
    //   id: `o${Date.now()}`,
    //   items: cart,
    //   total: cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0),
    //   createdAt: new Date().toISOString(),
    // };
    // console.log("Submitting order", order);
    // alert(
    //   `Order submitted. Total: $${order.total.toFixed(
    //     2
    //   )}. See console for details.`
    // );
    setCart([]);
  }

  function handleClearCart() {
    setCart([]);
  }

  // search filter
  const filteredMenu = menu.filter(
    (m) => {}
    // m.mealId === selectedCategory &&
    // m.quantity.toLowerCase().includes(search.toLowerCase())
  );

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
                onAddToCart={() => {}} //handleAddToCart
                value={selectedCategory}
                onChange={(c) => setSelectedCategory(c)}
                onEditItem={(i) => {
                  //setEditingItem(i);
                  setDialogOpen(true);
                }}
                onDeleteItem={(id) => handleDeleteMenu(id)}
              />

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Selected Items
                </Typography>
                {/* <OrderTable
                  items={cart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                  onUpdateNote={handleUpdateNote}
                /> */}
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
