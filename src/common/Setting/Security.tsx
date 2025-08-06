import React, { useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout";
import DataSecure from "./DataSecure";
import InspectionSection from "../Dropdown/InspectionSection";
import { Typography } from "@mui/material";
import ManageMyInfo from "./ManageMyInfo";

const Security = () => {
  const [tabX, setTab] = useState(0);
  const tabs: TabItem[] = [
    {
      label: "Security",
      value: "auto",
      content: <DataSecure />,
    },
    {
      label: "InspectionSection",
      value: "auto",
      // content: <InspectionSection />,
      content: <ManageMyInfo />,
    },
  ];
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

export default Security;
