import { memo, useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout";
import ManageMyInfo from "./ManageMyInfo";
import { Box } from "@mui/material";

const Security = () => {
  const [tabX, setTab] = useState(0);
  const tabs: TabItem[] = [
    {
      label: "Security",
      value: "auto",
      content: <Box width={"20rem"} />,
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
        title="Security"
        tabs={tabs}
        onChangeTab={setTab}
        activeTab={tabX}
      />
    </div>
  );
};

export default memo(Security);
