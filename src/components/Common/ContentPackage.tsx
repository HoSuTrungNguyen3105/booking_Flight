import { useParams } from "react-router-dom";
import FlightGuideSection from "../Sample/FlightGuideSection";
import { Box } from "@mui/material";

const ContentPackage = () => {
  const { title } = useParams();
  return (
    <Box width={"50rem"}>
      <FlightGuideSection title={title || ""} />
      {title}
    </Box>
  );
};

export default ContentPackage;
