import { memo, useState } from "react";
import type { TabItem } from "../../../Layout/SearchLayout";
import SearchLayout from "../../../Layout/SearchLayout";
import FlightList from "./FlightList";
import MealList from "../Meal/MealList";
import TicketList from "../../../Sample/TicketList";
import BaggageList from "../../../Sample/BaggageList";
import BookingList from "../../../Sample/BookingList";

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
      label: "BaggageList",
      value: "BaggageList",
      content: <BaggageList />,
    },
    {
      label: "BookingList",
      value: "BookingList",
      content: <BookingList />,
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
