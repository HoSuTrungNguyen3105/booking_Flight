import {
  Box,
  Divider,
  Fade,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useState, type ReactNode } from "react";
import { Button } from "../Button/Button";
import NonVegIcon from "../../../src/svgs/celery-svg.svg";
import VeganIcon from "../../../src/svgs/orange-svg.svg";
import SeafoodIcon from "../../../src/svgs/shrimp-svg.svg";
import DessertIcon from "../../../src/svgs/chicken-svg.svg";
import BeverageIcon from "../../../src/svgs/gelatin-svg.svg";
import DataTable from "../DataGrid/index.tsx";
import { motion } from "framer-motion";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

type FoodData = {
  id: number;
  name: string;
  type: string;
  price: number;
  isValue?: boolean;
};
const meals: FoodData[] = [
  { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12 },
  { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
  { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
  { id: 4, name: "Phở bò", type: "Non-Veg", price: 10 },
  { id: 5, name: "Cháo trắng", type: "Vegan", price: 6 },
  { id: 6, name: "Cơm sườn", type: "Non-Veg", price: 13 },
  { id: 7, name: "Salad rau củ", type: "Vegan", price: 7 },
  { id: 8, name: "Bún cá", type: "Seafood", price: 11 },
  { id: 9, name: "Mì chay rau nấm", type: "Vegan", price: 9 },
  { id: 10, name: "Cá hồi nướng sốt bơ chanh", type: "Seafood", price: 16 },
  { id: 11, name: "Bánh xèo", type: "Non-Veg", price: 10, isValue: false },
  { id: 12, name: "Bánh bao chay", type: "Vegan", price: 5 },
  { id: 13, name: "Súp cua", type: "Seafood", price: 8 },
  { id: 14, name: "Cơm tấm bì chả", type: "Non-Veg", price: 11 },
  { id: 15, name: "Chè đậu xanh", type: "Dessert", price: 4 },
  { id: 16, name: "Trái cây tươi", type: "Vegan", price: 5 },
  { id: 17, name: "Bánh flan", type: "Dessert", price: 4 },
  { id: 18, name: "Nước cam", type: "Beverage", price: 3 },
  { id: 19, name: "Cà phê sữa đá", type: "Beverage", price: 3 },
  { id: 20, name: "Trà chanh", type: "Beverage", price: 2.5 },
  { id: 21, name: "Nước ngọt", type: "Beverage", price: 2 },
  { id: 22, name: "Bánh mì kẹp thịt", type: "Non-Veg", price: 5 },
  { id: 23, name: "Mì quảng", type: "Non-Veg", price: 9 },
  { id: 24, name: "Bánh mì thịt nguội", type: "Non-Veg", price: 6 },
  { id: 25, name: "Bánh mì chả cá", type: "Non-Veg", price: 7 },
  { id: 26, name: "Bánh mì pate", type: "Non-Veg", price: 5 },
  { id: 27, name: "Bánh mì xíu mại", type: "Non-Veg", price: 6 },
  { id: 28, name: "Bánh mì thịt nướng", type: "Non-Veg", price: 7 },
];

// Map icon theo loại món
const typeIcons: Record<string, ReactNode> = {
  "Non-Veg": (
    <Box component="img" src={NonVegIcon} alt="Non-Veg" width={20} mr={1} />
  ),
  Vegan: <Box component="img" src={VeganIcon} alt="Vegan" width={20} mr={1} />,
  Seafood: (
    <Box component="img" src={SeafoodIcon} alt="Seafood" width={20} mr={1} />
  ),
  Dessert: (
    <Box component="img" src={DessertIcon} alt="Dessert" width={20} mr={1} />
  ),
  Beverage: (
    <Box component="img" src={BeverageIcon} alt="Beverage" width={20} mr={1} />
  ),
};

const Food = () => {
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const theme = useTheme();
  const handleSelect = (id: number) => {
    console.log(typeIcons);
    setSelectedMeals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "type", headerName: "Loại" },
    {
      field: "price",
      headerName: "Giá (USD)",
      valueFormatter: (params: any) => {
        const num = Number(params);
        return !isNaN(num) ? `${num} USD` : "0.00 USD";
      },
    },
    {
      field: "action",
      headerName: "Chọn",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isSelected = selectedMeals.includes(params.row.id);
        return (
          <Button
            priority="custom"
            customLabelColor="#000000"
            size="small"
            customColor={isSelected ? "#6FCF97" : "#F5A3C7"}
            label={isSelected ? "Đã chọn" : "Chọn món"}
            onClick={() => handleSelect(params.row.id)}
          />
        );
      },
    },
  ];
  const totalPrice = meals
    .filter((meal) => selectedMeals.includes(meal.id))
    .reduce((sum, meal) => sum + meal.price, 0);

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
        background: "linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <RestaurantMenuIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
        <Typography
          variant="h4"
          fontWeight={700}
          color={theme.palette.text.primary}
        >
          In-Flight Meal Management
        </Typography>
      </Box>

      {/* Data Table Section */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
          "& .MuiDataGrid-root": {
            border: "none",
            "& .MuiDataGrid-cell": {
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[100],
              fontWeight: 600,
            },
          },
        }}
      >
        <DataTable
          rows={meals}
          columns={columns}
          checkboxSelection={false}
          onRowClick={(params) => handleSelect(params.row.id)}
        />
      </Paper>

      {/* Selected Meals Section */}
      {selectedMeals.length > 0 && (
        <Fade in>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: "#ffffff",
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              mb={3}
              color={theme.palette.text.primary}
            >
              Selected In-Flight Meals
            </Typography>

            <Grid container spacing={2}>
              {meals
                .filter((meal) => selectedMeals.includes(meal.id))
                .map((meal) => (
                  <Grid size={12} key={meal.id}>
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50],
                        "&:hover": {
                          backgroundColor: theme.palette.grey[100],
                        },
                      }}
                    >
                      {typeIcons[meal.type]}
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={theme.palette.text.primary}
                        >
                          {meal.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={theme.palette.text.secondary}
                        >
                          {meal.name || "Standard meal served onboard"}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={theme.palette.success.main}
                      >
                        ${meal.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Total Price & Confirm Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color={theme.palette.text.primary}
              >
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                size="large"
                label="Confirm Meal List"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
                // onClick={handleConfirmMeals}
              ></Button>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Food;
