import { Box } from "@mui/material";
import DataGridInTab from "../../common/Dropdown/Data";
import InspectionSection from "../../common/Dropdown/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import Hero from "../../components/Hero/Hero";

const DataV2 = () => {
  type RowData = {
    id: number;
    name: string;
    age: number;
    email: string;
  };
  const typeList = ["John Doe", "Henry Gover", "John Smith"] as const;
  const statusList = [
    "완료@gmail.com",
    "미완료@gmail.com",
    "진행중@gmail.com",
  ] as const;

  const initialData: RowData[] = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    age: Math.floor(Math.random() * 100),
    name: typeList[Math.floor(Math.random() * typeList.length)],
    email: statusList[Math.floor(Math.random() * statusList.length)],
  }));

  const row = [
    {
      id: 1,
      name: "John Doe",
      age: 30,
      email: "johndoe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 25,
      email: "janesmith@example.com",
    },
  ];

  const tabs = [
    {
      label: "Tab 1",
      description: "Description for Tab 1",
      content: <DataGridInTab />,
    },
    {
      label: "Tab 2",
      description: "Description for Tab 2",
      content: <Hero />,
    },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];

  return (
    <Box>
      <Box paddingTop={2}>
        <InspectionSection
          onRowClick={() => {}}
          handleAction={() => {}}
          columns={columns}
          tabs={[]}
          rows={row}
          loading={false}
          onSearch={() => {}}
        />
      </Box>
    </Box>
  );
};

export default DataV2;
