import { useGetAircraftByCodeFlight } from "../../../../context/Api/AircraftApi";

type AircraftProps = {
  aircraft: string;
};
const AircraftDetail = ({ aircraft }: AircraftProps) => {
  const { dataAircraftByCodeFlight } = useGetAircraftByCodeFlight(aircraft);
  return <div>{JSON.stringify(dataAircraftByCodeFlight)}</div>;
};

export default AircraftDetail;
