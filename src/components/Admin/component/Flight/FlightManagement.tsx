import { memo, useState } from "react";
import { Box } from "@mui/material";
import type { TabItem } from "../../../Layout/SearchLayout";
import InspectionSection from "../../../../common/CustomRender/InspectionSection";
import SearchLayout from "../../../Layout/SearchLayout";
import FlightList from "./FlightList";

const FlightManagement = () => {
  const [tabX, setTab] = useState(0);

  const tabs: TabItem[] = [
    {
      label: "FlightList",
      value: "FlightList",
      content: <FlightList />,
    },
    // {
    //   label: "inspectionSection",
    //   value: "auto",
    //   content: <Typography></Typography>,
    // },
  ];

  //   if (getValuePassenger)
  //     return <DataSecure returnButton={handleReturn} passenger={passengerId} />;

  return (
    <SearchLayout
      onChangeTab={setTab}
      activeTab={tabX}
      title="Security Manage"
      tabs={tabs}
    />
  );
};

export default memo(FlightManagement);
