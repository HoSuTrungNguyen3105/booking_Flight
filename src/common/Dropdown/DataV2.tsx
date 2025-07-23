import { Box } from "@mui/material";
import "./index.scss";
import DataGridInTab from "../../common/Dropdown/Data";
import InspectionSection from "../../common/Dropdown/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import { MultiTimepicker } from "../TimePicker";
const DataV2 = () => {
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
      content: <MultiTimepicker />,
    },
  ];
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "age", headerName: "Age", type: "number", width: 110 },
    { field: "email", headerName: "Email", width: 200 },
  ];
  return (
    // <Box className="hero-section">
    //   <Box className="hero-container">
    //     <Typography className="hero-title">Find your next stay</Typography>
    //     <Typography className="hero-subtitle">
    //       Search low prices on hotels for your dream vacation...
    //     </Typography>
    <Box>
      <Box paddingTop={2}>
        {/* <DataGridInTab /> */}
        <InspectionSection
          totalResult={100}
          currentPage={1}
          totalPage={5}
          pageSize={10}
          onChangePage={() => {}}
          onPageSizeChange={() => {}}
          onSortModelChange={() => {}}
          sortModel={[]}
          handleAction={() => {}}
          columns={[]}
          tabs={tabs}
          rows={[]}
          loading={false}
          onSearch={() => {}}
        />
      </Box>
    </Box>
  );
};

export default DataV2;
