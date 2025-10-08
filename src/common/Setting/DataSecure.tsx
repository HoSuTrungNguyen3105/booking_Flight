import { useState, useMemo, useCallback, useEffect } from "react";
import type { GridRowDef } from "../DataGrid";
import { Box, Button, Typography } from "@mui/material";
import TableSection from "./TableSection";
import type { GridColDef } from "@mui/x-data-grid";
import theme from "../../scss/theme";
import { useFindPassengerById } from "../../components/Api/usePostApi";
import type { Passenger } from "../../utils/type";
import DetailSection, { type IDetailItem } from "../DetailSection";
import { DateFormatEnum, formatDate, formatDateKR } from "../../hooks/format";

type DataSecureProps = {
  passenger: string;
  returnButton: () => void;
};

const DataSecure = ({ passenger, returnButton }: DataSecureProps) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Passenger | null>(null);

  const { dataPassengerById, refetchPassengerById } = useFindPassengerById();
  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        setLoading(true);
        const res = await refetchPassengerById({ id: passenger });
        if (res?.resultCode === "00") {
          setData(res.data as Passenger);
        } else {
          console.error(res?.resultMessage);
        }
      } catch (err) {
        console.error("Fetch passenger error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (passenger) {
      fetchPassenger();
    }
  }, [passenger, refetchPassengerById]);

  const columnBookingList: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "bookingTime",
        headerName: "Booking Time",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">
            {formatDate(DateFormatEnum.MMMM_D_YYYY, value)}
          </Typography>
        ),
      },
      {
        field: "mealCount",
        headerName: "Meal Orders",
        flex: 1,
      },
    ],
    []
  );

  const columnMealOrder: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "bookingId",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "mealId",
        headerName: "Booking Time",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">
            {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
          </Typography>
        ),
      },
      {
        field: "quantity",
        headerName: "Meal quantity",
        flex: 1,
      },
    ],
    []
  );

  const rowData = useMemo(
    () =>
      dataPassengerById?.data?.bookings.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPassengerById]
  );

  const rowDataMealOrder = useMemo(
    () =>
      dataPassengerById?.data?.bookings.map((item) => ({
        ...item,
        id: item.mealOrders.map((e) => e.id).join(", "),
      })) || [],
    [dataPassengerById]
  );

  const detailData: IDetailItem[] = [
    {
      title: "Họ và tên",
      description: data?.fullName || "None",
    },
    {
      title: "Email",
      description: data?.email || "None",
    },
    {
      title: "Số điện thoại",
      description: data?.phone || "None",
    },
    {
      title: "Passport",
      description: data?.passport || "None",
    },
    {
      title: "Lần đăng nhập cuối",
      description: data?.lastLoginDate
        ? formatDate(DateFormatEnum.MMMM_D_YYYY, data.lastLoginDate)
        : "None",
    },
    {
      title: "Tài khoản khóa",
      description: data?.accountLockYn === "Y" ? "Đã khóa" : "Hoạt động",
    },
    {
      title: "Flight Booking",
      description: data?.bookings?.[0]?.flight?.flightNo || "-",
    },
    {
      title: "Seat Id",
      description: data?.bookings?.[0]?.seats?.id || "-",
    },
    {
      title: "Email xác thực",
      description:
        data?.isEmailVerified === "Y" ? "Đã xác thực" : "Chưa xác thực",
    },
  ];

  const renderDataSection = useCallback(
    (
      name: string,
      columns: GridColDef[],
      rows: GridRowDef[],
      isLoading: boolean,
      handleRowClick?: (row: GridRowDef) => void
    ) => {
      return (
        <Box borderTop={1} borderColor={theme.palette.grey[200]}>
          <Box
            bgcolor="white"
            px="16px"
            py="12px"
            border={1}
            borderTop={0}
            borderBottom={0}
          >
            <Typography variant="subtitle1" sx={{ gap: "10px" }}>
              {name}
            </Typography>
          </Box>
          <Box sx={{ padding: "8px" }}>
            <TableSection
              setRows={() => {}}
              rows={rows}
              columns={columns}
              isLoading={isLoading}
              handleRowClick={handleRowClick}
            />
          </Box>
        </Box>
      );
    },
    []
  );

  return (
    <Box minHeight={"50vh"}>
      <Box overflow={"auto"} minHeight={"50vh"}>
        <DetailSection data={detailData} />
        <Button onClick={returnButton} variant="contained">
          Return
        </Button>
        <Box borderTop={1} paddingTop={2} borderColor={"grey.200"}>
          {renderDataSection(
            "하위 파일 목록",
            columnBookingList,
            rowData,
            isLoading
          )}
          {renderDataSection(
            "연관 점검 항목",
            columnMealOrder,
            rowDataMealOrder,
            isLoading
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default DataSecure;
