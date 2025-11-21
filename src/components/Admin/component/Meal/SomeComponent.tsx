import { useNavigate } from "react-router-dom";
import type { FlightInfo } from "./FareComparison";

const SomeComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const flightData: FlightInfo[] = [
      { route: "Hanoi -> Saigon", class: "Economy", note: "Window seat" },
      { route: "Saigon -> Hanoi", class: "Business", note: "Aisle seat" },
    ];

    navigate("/FareComparison", { state: { flight: flightData } });
  };

  return <button onClick={handleClick}>Compare Fare</button>;
};

export default SomeComponent;
