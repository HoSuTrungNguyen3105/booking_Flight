type AircraftProps = {
  aircraft: number;
};
const AircarftDetail = ({ aircraft }: AircraftProps) => {
  return <div>{aircraft}</div>;
};

export default AircarftDetail;
