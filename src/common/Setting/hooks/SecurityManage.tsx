import { useCallback, useMemo, useState } from "react";
import type { TabItem } from "../../../components/Layout/SearchLayout";
import SearchLayout from "../../../components/Layout/SearchLayout";
import InspectionSection from "../../Dropdown/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { DateFormatEnum, formatDateKR } from "../../../hooks/format";
import { useNavigate } from "react-router-dom";
import type { GridRowDef } from "../../DataGrid";
import { useFindAllPassenger } from "../../../components/Api/useGetApi";
import DataSecure from "../DataSecure";

export const columnsPassenger: GridColDef[] = [
  { field: "fullName", headerName: "Họ và tên", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Số điện thoại", flex: 1 },
  { field: "passport", headerName: "Passport", flex: 1 },
  {
    field: "accountLockYn",
    headerName: "Tài khoản khóa",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography>{value === "Y" ? "Đã khóa" : "Hoạt động"}</Typography>
    ),
  },
  {
    field: "isEmailVerified",
    headerName: "Email xác thực",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography>{value === "Y" ? "Đã xác thực" : "Chưa xác thực"}</Typography>
    ),
  },
  {
    field: "lastLoginDate",
    headerName: "Lần đăng nhập cuối",
    flex: 1,
    renderCell: ({ value }) =>
      value ? (
        <Typography>
          {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
        </Typography>
      ) : (
        <Typography>-</Typography>
      ),
  },
];

const SecurityManage = () => {
  const [tabX, setTab] = useState(0);
  const [getValuePassenger, setGetValuePassenger] = useState(false);
  const [passengerId, setPassengerId] = useState("");

  const { dataAllPassenger } = useFindAllPassenger();

  const navigate = useNavigate();
  const onRowSelect = (rowData: GridRowDef) => {
    // navigate(`/admin/data-secure`, {
    //   state: { data: rowData, type: tabX },
    // });
    setGetValuePassenger(true);
    setPassengerId(rowData.id as string);
  };
  const rowData = useMemo(
    () =>
      dataAllPassenger?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataAllPassenger]
  );

  const handleReturn = useCallback(() => {
    setGetValuePassenger(false);
  }, [setGetValuePassenger]);

  const tabs: TabItem[] = [
    {
      label: "Passenger",
      value: "Passenger",
      content: (
        <InspectionSection
          onRowClick={onRowSelect}
          handleAction={() => {}}
          columns={columnsPassenger}
          tabs={[]}
          rows={rowData}
          loading={false}
          onSearch={() => {}}
        />
      ),
    },
    {
      label: "InspectionSection",
      value: "auto",
      content: <Typography></Typography>,
    },
  ];
  if (getValuePassenger)
    return <DataSecure returnButton={handleReturn} passenger={passengerId} />;

  return (
    <div>
      <SearchLayout
        onChangeTab={setTab}
        activeTab={tabX}
        title="Layout"
        tabs={tabs}
      />
    </div>
  );
};

export default SecurityManage;
