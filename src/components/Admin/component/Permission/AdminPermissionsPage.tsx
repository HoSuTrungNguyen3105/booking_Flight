import React, { useState } from "react";
import SearchLayout from "../../../Layout/SearchLayout";
import type { TabItem } from "../../../Layout/SearchLayout";
import RolePermissionsTab from "./RolePermissionsTab";
import PermissionDefinitionsTab from "./PermissionDefinitionsTab";
import SeedPermissionsTab from "./SeedPermissionsTab";
import PermissionDefinitionList from "./PermissionDefinitionData";

const AdminPermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: TabItem[] = [
    {
      label: "Role Permissions",
      value: "role-permissions",
      content: <RolePermissionsTab />,
    },
    {
      label: "Permission Definitions",
      value: "permission-definitions",
      content: <PermissionDefinitionsTab />,
    },
    {
      label: "Permission Definitions List",
      value: "permission-definitions-list",
      content: <PermissionDefinitionList />,
    },
    {
      label: "Seed Permissions",
      value: "seed-permissions",
      content: <SeedPermissionsTab />,
    },
  ];

  return (
    <SearchLayout
      title="Permission Management"
      tabs={tabs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
    />
  );
};

export default AdminPermissionsPage;
