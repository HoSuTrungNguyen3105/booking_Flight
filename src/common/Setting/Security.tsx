import { memo, useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout";
import ManageMyInfo from "../../components/Profile/ManageMyInfo";

const Security = () => {
  const [tabX, setTab] = useState(0);
  const tabs: TabItem[] = [
    {
      label: "InspectionSection",
      value: "auto",
      content: <ManageMyInfo />,
    },
  ];
  return (
    <div>
      <SearchLayout
        title="Security"
        tabs={tabs}
        onChangeTab={setTab}
        activeTab={tabX}
      />
    </div>
  );
};

export default memo(Security);
