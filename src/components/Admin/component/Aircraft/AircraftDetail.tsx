type AircraftProps = {
  aircraft: string;
};
const AircraftDetail = ({ aircraft }: AircraftProps) => {
  return <div>{aircraft}</div>;
};

export default AircraftDetail;
