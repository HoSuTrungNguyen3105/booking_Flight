import { useState, useMemo } from "react";
import {
  Container,
  Grid,
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import { PlusCircle, Search } from "lucide-react";

import MenuTabs from "./MenuTabs";
import OrderTable, { type OrderItem } from "./OrderTable";
import type { Meal } from "../../../../utils/type";
import { useGetMeal } from "../../../../context/Api/MealApi";

const OrderMeal = () => {
  const { mealData } = useGetMeal();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Meal["mealType"]>("Breakfast");
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [editingItem, setEditingItem] = useState<Meal | null>(null);
  const [search, setSearch] = useState("");

  // Convert meal data
  const mealList = useMemo(() => mealData?.list || [], [mealData]);

  // Debounce search (UX mượt hơn)
  const filteredMenu = useMemo(() => {
    const s = search.toLowerCase().trim();
    return mealList.filter((m) => {
      const matchCategory = m.mealType === selectedCategory;
      const matchSearch =
        m.name.toLowerCase().includes(s) ||
        m.mealCode.toLowerCase().includes(s);

      return matchCategory && matchSearch;
    });
  }, [mealList, selectedCategory, search]);

  // CART HANDLERS -------------------------------------

  function handleAddToCart(menuItem: Meal) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === menuItem.id);
      if (existing) {
        return prev.map((c) =>
          c.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          mealCode: menuItem.mealCode,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
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

  function handleDeleteMenu(id: number) {
    // Optional: remove from cart
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  // ------------------------------------------------------

  return (
    <Box>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {/* LEFT CONTENT */}
          <Grid size={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {/* Search + Add Button */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <TextField
                  size="small"
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Tooltip title="Add new menu item">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      // setEditingItem(null);
                      // setDialogOpen(true);
                    }}
                  >
                    <PlusCircle />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Menu Tabs */}
              <MenuTabs
                menu={filteredMenu}
                onAddToCart={handleAddToCart}
                value={selectedCategory}
                onChange={(c) => setSelectedCategory(c)}
                onEditItem={() => {
                  // setEditingItem(i);
                  // setDialogOpen(true);
                }}
                onDeleteItem={handleDeleteMenu}
              />

              {/* Cart Items */}
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

          {/* RIGHT SIDEBAR PLACEHOLDER */}
          <Grid size={4}>
            {/* Future: CartSidebar / Summary */}
            <Paper sx={{ p: 2, height: "100%" }}>Sidebar</Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OrderMeal;
