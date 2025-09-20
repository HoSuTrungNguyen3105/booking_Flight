type AircraftProps = {
  aircraft: number;
};
const AircraftDetail = ({ aircraft }: AircraftProps) => {
  return <div>{aircraft}</div>;
};

export default AircraftDetail;
