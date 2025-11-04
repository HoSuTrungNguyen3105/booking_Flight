import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";

type LatLngTupleProps = {
  departureTime: number;
  arrivalTime: number;
};

const FlightPath = ({ departureTime, arrivalTime }: LatLngTupleProps) => {
  const departure: LatLngTuple = [21.2187, 105.8042];
  const arrival: LatLngTuple = [10.8189, 106.6519]; // SGN
  const [location, setLocation] = useState<[number, number]>([
    departureTime,
    arrivalTime,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return (
    <MapContainer
      center={location}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker điểm đi */}
      <Marker position={location}>
        <Popup>Departure: Hanoi (HAN)</Popup>
      </Marker>

      {/* Marker điểm đến */}
      <Marker position={location}>
        <Popup>Arrival: Ho Chi Minh (SGN)</Popup>
      </Marker>

      {/* Đường bay */}
      <Polyline positions={[departure, arrival]} color="blue" />
    </MapContainer>
  );
};

export default FlightPath;
