import { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useGetFlightData, useGetMeal } from "../../components/Api/useGetApi";
import type { Meal } from "../../utils/type";
import { Typography } from "@mui/material";
import FlightTable from "./hooks/FlightData";
import type { Flight } from "./type";

export default function MealList() {
  const [data, setData] = useState<Meal[]>([]);
  const [dataFlight, setDataFlight] = useState<Flight[]>([]);
  const { refetchFlightBookingDataData } = useGetMeal();
  const { refetchGetFlightData } = useGetFlightData();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refetchGetFlightData();
        if (res?.resultCode == "00") {
          setDataFlight(res.list ?? []);
        } else {
          setDataFlight([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [refetchGetFlightData]); // ✅ sửa lại dependency đúng

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
      <Typography>Flight list</Typography>
      <FlightTable flights={dataFlight} />;
    </div>
  );
}
