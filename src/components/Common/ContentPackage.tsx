import { useParams } from "react-router-dom";
import FlightGuideSection from "../Sample/FlightGuideSection";
import { Box } from "@mui/material";

const ContentPackage = () => {
  const { title } = useParams();
  return (
    <Box
      display={"flex"}
      width={"100%"}
      justifyContent={"center"}
      mt={1}
      mb={2}
    >
      <FlightGuideSection title={title || ""} />
    </Box>
  );
};

export default ContentPackage;
