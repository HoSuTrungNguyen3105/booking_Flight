import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";
type LatLngTupleProps = {
  departureTime?: LatLngTuple;
  arrivalTime?: LatLngTuple;
};
const FlightPath = ({ departureTime, arrivalTime }: LatLngTupleProps) => {
  const departure: LatLngTuple = [21.2187, 105.8042];
  const arrival: LatLngTuple = [10.8189, 106.6519]; // SGN

  console.log("time", departureTime, arrivalTime);
  return (
    <MapContainer
      center={[16, 106] as [number, number]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker điểm đi */}
      <Marker position={departure}>
        <Popup>Departure: Hanoi (HAN)</Popup>
      </Marker>

      {/* Marker điểm đến */}
      <Marker position={arrival}>
        <Popup>Arrival: Ho Chi Minh (SGN)</Popup>
      </Marker>

      {/* Đường bay */}
      <Polyline positions={[departure, arrival]} color="blue" />
    </MapContainer>
  );
};

export default FlightPath;
