import { Box, Paper, Typography } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useState, type ReactNode } from "react";
import { Button } from "../Button/Button";
import NonVegIcon from "../../../src/svgs/celery-svg.svg";
import VeganIcon from "../../../src/svgs/orange-svg.svg";
import SeafoodIcon from "../../../src/svgs/shrimp-svg.svg";
import DessertIcon from "../../../src/svgs/chicken-svg.svg";
import BeverageIcon from "../../../src/svgs/gelatin-svg.svg";
import DataTable from "../DataGrid/index.tsx";
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
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Danh sách món ăn trên chuyến bay
      </Typography>

      <Box
        sx={{
          height: 400,
          width: "100%",
          // minHeight: "400px",
          // overflow: "auto", // ✅ chỉ hiện scroll khi cần
          // "& .MuiDataGrid-virtualScroller": {
          //   overflowY: "auto !important", // ✅ đảm bảo scroll hoạt động đúng
          // },
          // "&::-webkit-scrollbar": {
          //   width: 0,
          //   height: 0,
          // },
        }}
      >
        <DataTable
          rows={meals}
          columns={columns}
          checkboxSelection={false}
          // onSelectionModelChange={(newSelection) => {
          //   setSelectedMeals(newSelection as number[]);
          // }}
          // pageSizeOptions={[5]}
          // disableRowSelectionOnClick
        />
      </Box>

      {selectedMeals.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#f4f6f8",
            mt: 2,
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Món đã chọn
          </Typography>
          {selectedMeals.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#f0f8ff", // màu nền nhẹ
                border: "1px solid #cce",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={2}
                sx={{ color: "#333" }}
              >
                Món đã chọn
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                textAlign="right"
                mt={2}
                sx={{ color: "#2e7d32" }}
              >
                Tổng cộng: {totalPrice.toFixed(2)} USD
              </Typography>

              {meals
                .filter((meal) => selectedMeals.includes(meal.id))
                .map((meal) => (
                  <Box
                    key={meal.id}
                    display="flex"
                    alignItems="center"
                    mb={1.2}
                    p={1}
                    borderRadius={1}
                    sx={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    {typeIcons[meal.type]}
                    <Typography ml={1} color="#333">
                      {meal.name} –{" "}
                      <Box component="span" fontWeight="bold">
                        {meal.price.toFixed(2)} USD
                      </Box>
                    </Typography>
                  </Box>
                ))}
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Food;
