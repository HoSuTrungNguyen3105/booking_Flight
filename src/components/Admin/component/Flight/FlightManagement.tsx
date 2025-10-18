import { memo, useState } from "react";
import type { TabItem } from "../../../Layout/SearchLayout";
import SearchLayout from "../../../Layout/SearchLayout";
import FlightList from "./FlightList";
import MealList from "../Meal/MealListTable";

const FlightManagement = () => {
  const [tabX, setTab] = useState(0);

  const tabs: TabItem[] = [
    {
      label: "FlightList",
      value: "FlightList",
      content: <FlightList />,
    },
    {
      label: "MealList",
      value: "MealList",
      content: <MealList />,
    },
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
