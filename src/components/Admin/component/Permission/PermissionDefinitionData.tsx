import { Grid } from "@mui/material";
import PermissionDefinitionCard from "./PermissionDefinitionCard";
import { useGetPermissionDefinitions } from "../../../../context/Api/PermissionsApi";

const PermissionDefinitionList = () => {
  const {
    permissionDefinitions,
    refetchPermissionDefinitions,
    // loadingPermissionDefinitions,
  } = useGetPermissionDefinitions();

  //   if (loadingPermissionDefinitions) return <div>Loading...</div>;

  return (
    <Grid container spacing={2}>
      {permissionDefinitions?.list?.map((definition) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={definition.id}>
          <PermissionDefinitionCard
            definition={definition}
            onRefresh={refetchPermissionDefinitions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PermissionDefinitionList;
