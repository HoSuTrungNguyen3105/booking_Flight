// import React, { useEffect, useState } from "react";
// import { useGetMeal } from "../../components/Api/useGetApi";
// import type { Meal, MealResponse } from "../../utils/type";

// export default function MealList() {
//   const [data, setData] = useState<Meal[]>([]);
//   const { refetchFlightBookingDataData } = useGetMeal();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await refetchFlightBookingDataData();
//         if (res) {
//           setData(res.list ?? []);
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu:", error);
//       }
//     };

//     fetchData();
//   }, [refetchFlightBookingDataData]);

//   if (data.length === 0) return <p>Đang tải dữ liệu...</p>;

//   return (
//     <div>
//       <h2>{data[0].description}</h2>
//       <ul>
//         {data.map((meal) => (
//           <li key={meal.id}>
//             <strong>{meal.name}</strong> ({meal.mealType}) - ${meal.price}
//             <br />
//             {meal.description}
//             <br />
//             <em>Flight Meals:</em>
//             <ul>
//               {meal.flightMeals.length > 0 ? (
//                 meal.flightMeals.map((fm) => (
//                   <li key={fm.id}>
//                     Flight {fm.flightId} - Qty: {fm.quantity} - Price: $
//                     {fm.price}
//                   </li>
//                 ))
//               ) : (
//                 <li>Không có chuyến bay nào</li>
//               )}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useGetMeal } from "../../components/Api/useGetApi";
import type { Meal } from "../../utils/type";

export default function MealList() {
  const [data, setData] = useState<Meal[]>([]);
  const { refetchFlightBookingDataData } = useGetMeal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refetchFlightBookingDataData();
        if (res) {
          setData(res.list ?? []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [refetchFlightBookingDataData]);

  if (data.length === 0) return <p>Đang tải dữ liệu...</p>;

  // Định nghĩa cột cho DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", width: 130 },
    { field: "price", headerName: "Giá ($)", width: 120, type: "number" },
    { field: "description", headerName: "Mô tả", flex: 1.5 },
    {
      field: "flightMeals",
      headerName: "Flight Meals",
      flex: 2,
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {params.value.map((fm: any) => (
              <li key={fm.id}>
                Flight {fm.flightId} - Qty: {fm.quantity} - Price: ${fm.price}
              </li>
            ))}
          </ul>
        ) : (
          "Không có chuyến bay"
        ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
}
