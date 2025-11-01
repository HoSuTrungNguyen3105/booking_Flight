import { memo, useState } from "react";
import type { TabItem } from "../../../Layout/SearchLayout";
import SearchLayout from "../../../Layout/SearchLayout";
import FlightList from "./FlightList";
import MealList from "../Meal/MealList";
import TicketList from "../../../Sample/TicketList";
import TerminalContainer from "../InfrastructureEntities/TerminalContainer";

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
    {
      label: "TicketList",
      value: "TicketList",
      content: <TicketList />,
    },
    {
      label: "TicketList",
      value: "TicketList",
      content: <TerminalContainer />,
    },
    {
      label: "TicketList",
      value: "TicketList",
      content: <TicketList />,
    },
  ];

  return (
    <SearchLayout
      onChangeTab={setTab}
      activeTab={tabX}
      title="Flight Management State"
      tabs={tabs}
    />
  );
};

export default memo(FlightManagement);
