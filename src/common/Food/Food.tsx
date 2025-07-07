// // import { Box, Button, Typography } from "@mui/material";
// // import {
// //   DataGrid,
// //   type GridColDef,
// //   type GridRenderCellParams,
// // } from "@mui/x-data-grid";
// // import { useState } from "react";

// // // Danh sách món ăn mẫu
// // const meals = [
// //   { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12 },
// //   { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
// //   { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
// //   { id: 4, name: "Phở bò", type: "Non-Veg", price: 10 },
// //   { id: 5, name: "Cháo trắng", type: "Vegan", price: 6 },
// // ];

// // // Định nghĩa các cột cho DataGrid
// // const columns = (handleSelect: (id: number) => void): GridColDef[] => [
// //   { field: "id", headerName: "ID", width: 70 },
// //   { field: "name", headerName: "Tên món", flex: 1 },
// //   { field: "type", headerName: "Loại", flex: 1 },
// //   {
// //     field: "price",
// //     headerName: "Giá (USD)",
// //     flex: 1,
// //     type: "number",
// //     valueFormatter: (params: any) => {
// //       const value = params.value as number;
// //       return typeof value === "number" ? `${value.toFixed(2)} USD` : "N/A";
// //     },
// //   },
// //   {
// //     field: "action",
// //     headerName: "Chọn",
// //    width: 120,
// //       sortable: false,
// //       filterable: false,
// //       renderCell: (params: GridRenderCellParams) => {
// //         const isSelected = selectedMeals.includes(params.row.id);
// //         return (
// //           <Button
// //             variant={isSelected ? "contained" : "outlined"}
// //             color={isSelected ? "success" : "primary"}
// //             size="small"
// //             onClick={() => handleSelect(params.row.id)}
// //           >
// //             {isSelected ? "Đã chọn" : "Chọn món"}
// //           </Button>
// //         );
// //       },
// //   },
// // ];

// // const Food = () => {
// //   const [selectedMeals, setSelectedMeals] = useState<number[]>([]);

// //   const handleSelect = (id: number) => {
// //     setSelectedMeals((prev) => {
// //       if (prev.includes(id)) {
// //         return prev.filter((item) => item !== id); // Bỏ nếu đã có
// //       } else {
// //         return [...prev, id]; // Thêm nếu chưa có
// //       }
// //     });
// //   };

// //   return (
// //     <Box className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
// //       <Typography className="text-2xl font-bold text-gray-800 mb-4">
// //         🍱 Danh sách món ăn trên chuyến bay
// //       </Typography>

// //       <Box sx={{ height: 400, width: "100%" }}>
// //         <DataGrid
// //           rows={meals}
// //           columns={columns(handleSelect)}
// //           pageSizeOptions={[5]}
// //           disableRowSelectionOnClick
// //         />
// //       </Box>

// //       {selectedMeal && (
// //         <Typography className="text-lg text-green-600">
// //           ✅ Đã chọn món có ID: {selectedMeal}
// //         </Typography>
// //       )}
// //     </Box>
// //   );
// // };

// // export default Food;

// import { Box, Button, Typography } from "@mui/material";
// import {
//   DataGrid,
//   type GridColDef,
//   type GridRenderCellParams,
// } from "@mui/x-data-grid";
// import { useMemo, useState } from "react";
// import TextArea from "../Input/TextArea";

// const meals = [
//   { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12 },
//   { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
//   { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
//   { id: 4, name: "Phở bò", type: "Non-Veg", price: 10 },
//   { id: 5, name: "Cháo trắng", type: "Vegan", price: 6 },
// ];

// const Food = () => {
//   const [selectedMeals, setSelectedMeals] = useState<number[]>([]);

//   const handleSelect = (id: number) => {
//     setSelectedMeals((prev) => {
//       if (prev.includes(id)) {
//         return prev.filter((item) => item !== id); // Bỏ nếu đã có
//       } else {
//         return [...prev, id]; // Thêm nếu chưa có
//       }
//     });
//   };

//   const selectedMealNames = useMemo(() => {
//     return meals
//       .filter((meal) => selectedMeals.includes(meal.id))
//       .map((meal) => meal.name)
//       .join(",");
//   }, [selectedMeals]);

//   const columns: GridColDef[] = [
//     { field: "id", headerName: "ID", width: 70 },
//     { field: "name", headerName: "Tên món", flex: 1 },
//     { field: "type", headerName: "Loại", flex: 1 },
//     {
//       field: "price",
//       headerName: "Giá (USD)",
//       flex: 1,
//       type: "number",
//       valueFormatter: (params: any) => {
//         const value = params.value as number;
//         return typeof value === "number" ? `${value.toFixed(2)} USD` : "N/A";
//       },
//     },
//     {
//       field: "action",
//       headerName: "Chọn",
//       width: 120,
//       sortable: false,
//       filterable: false,
//       renderCell: (params: GridRenderCellParams) => {
//         const isSelected = selectedMeals.includes(params.row.id);
//         return (
//           <Button
//             variant={isSelected ? "contained" : "outlined"}
//             color={isSelected ? "success" : "primary"}
//             size="small"
//             onClick={() => handleSelect(params.row.id)}
//           >
//             {isSelected ? "Đã chọn" : "Chọn món"}
//           </Button>
//         );
//       },
//     },
//   ];

//   return (
//     <Box className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
//       <Typography className="text-2xl font-bold text-gray-800 mb-4">
//         🍱 Danh sách món ăn trên chuyến bay
//       </Typography>

//       <Box sx={{ height: 400, width: "100%" }}>
//         <DataGrid
//           rows={meals}
//           columns={columns}
//           pageSizeOptions={[5]}
//           disableRowSelectionOnClick
//         />
//       </Box>

//       {selectedMeals.length > 0 && (
//         <Box>
//           <Typography className="mt-4 mb-2 text-lg font-medium text-gray-700">
//             ✅ Tên món đã chọn:
//           </Typography>
//           <TextArea

//             id="meal-list"
//             placeholder="Tên các món sẽ hiện ở đây..."
//             value={selectedMealNames}
//             onChange={() => {}} // read-only
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Food;

import { Box, Paper, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState, type ReactNode } from "react";
import TextArea from "../Input/TextArea"; // Component TextArea bạn đã viết
import { Button } from "../Button/Button";
import NonVegIcon from "../../../public/svgs/celery-svg.svg";
import VeganIcon from "../../../public/svgs/orange-svg.svg";
import SeafoodIcon from "../../../public/svgs/shrimp-svg.svg";
import DessertIcon from "../../../public/svgs/chicken-svg.svg";
import BeverageIcon from "../../../public/svgs/gelatin-svg.svg";
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
    { field: "type", headerName: "Loại", flex: 1 },
    {
      field: "price",
      headerName: "Giá (USD)",
      flex: 1,
      type: "number",
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
    <Box className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <Typography className="text-2xl font-bold text-gray-800 mb-4">
        🍱 Danh sách món ăn trên chuyến bay
      </Typography>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={meals}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
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
          {/* {meals
            .filter((meal) => selectedMeals.includes(meal.id))
            .join(",")
            .map((meal) => (
              <Box key={meal.id} display="flex" alignItems="center" mb={1}>
                {typeIcons[meal.type]}
                <Typography ml={1}>{meal.name}</Typography>
              </Box>
            ))} */}
        </Box>
      )}
    </Box>
  );
};

export default Food;
