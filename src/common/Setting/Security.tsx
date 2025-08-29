import { useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout";
import ManageMyInfo from "./ManageMyInfo";
import { Box } from "@mui/material";
import { FileUpload } from "../FileUploader";

const Security = () => {
  const [tabX, setTab] = useState(0);
  const tabs: TabItem[] = [
    {
      label: "Security",
      value: "auto",
      content: (
        <Box width={"20rem"}>
          <FileUpload name="file" />
        </Box>
      ),
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
        title="Layout"
        tabs={tabs}
        onChangeTab={setTab}
        activeTab={tabX}
      />
    </div>
  );
};

export default Security;
