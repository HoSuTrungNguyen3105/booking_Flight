// import { Box, Button, Typography } from "@mui/material";
// import {
//   DataGrid,
//   type GridColDef,
//   type GridRenderCellParams,
// } from "@mui/x-data-grid";
// import { useState } from "react";

// // Danh sách món ăn mẫu
// const meals = [
//   { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12 },
//   { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
//   { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
//   { id: 4, name: "Phở bò", type: "Non-Veg", price: 10 },
//   { id: 5, name: "Cháo trắng", type: "Vegan", price: 6 },
// ];

// // Định nghĩa các cột cho DataGrid
// const columns = (handleSelect: (id: number) => void): GridColDef[] => [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "name", headerName: "Tên món", flex: 1 },
//   { field: "type", headerName: "Loại", flex: 1 },
//   {
//     field: "price",
//     headerName: "Giá (USD)",
//     flex: 1,
//     type: "number",
//     valueFormatter: (params: any) => {
//       const value = params.value as number;
//       return typeof value === "number" ? `${value.toFixed(2)} USD` : "N/A";
//     },
//   },
//   {
//     field: "action",
//     headerName: "Chọn",
//    width: 120,
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
//   },
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

//   return (
//     <Box className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
//       <Typography className="text-2xl font-bold text-gray-800 mb-4">
//         🍱 Danh sách món ăn trên chuyến bay
//       </Typography>

//       <Box sx={{ height: 400, width: "100%" }}>
//         <DataGrid
//           rows={meals}
//           columns={columns(handleSelect)}
//           pageSizeOptions={[5]}
//           disableRowSelectionOnClick
//         />
//       </Box>

//       {selectedMeal && (
//         <Typography className="text-lg text-green-600">
//           ✅ Đã chọn món có ID: {selectedMeal}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default Food;

import { Box, Button, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState } from "react";
import TextArea from "../Input/TextArea";

const meals = [
  { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12 },
  { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
  { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
  { id: 4, name: "Phở bò", type: "Non-Veg", price: 10 },
  { id: 5, name: "Cháo trắng", type: "Vegan", price: 6 },
];

const Food = () => {
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelectedMeals((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Bỏ nếu đã có
      } else {
        return [...prev, id]; // Thêm nếu chưa có
      }
    });
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
        const value = params.value as number;
        return typeof value === "number" ? `${value.toFixed(2)} USD` : "N/A";
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
            variant={isSelected ? "contained" : "outlined"}
            color={isSelected ? "success" : "primary"}
            size="small"
            onClick={() => handleSelect(params.row.id)}
          >
            {isSelected ? "Đã chọn" : "Chọn món"}
          </Button>
        );
      },
    },
  ];

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
        <TextArea className="text-lg text-green-600">
          ✅ Đã chọn món: {selectedMeals.join(", ")}
        </TextArea>
      )}
    </Box>
  );
};

export default Food;
