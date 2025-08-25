import { useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout";
import DataSecure from "./DataSecure";
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
