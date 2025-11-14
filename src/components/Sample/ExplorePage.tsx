import { useParams } from "react-router-dom";

const ExplorePage = () => {
  const { arrival, departure, dateRange, passengerCount, hasTicket } =
    useParams();

  console.log("Điểm đến:", arrival);
  console.log("Điểm đi:", departure);
  console.log(
    "dateRange passengerCount hasTicket :",
    dateRange,
    passengerCount,
    hasTicket
  );

  return <div>Trang explore</div>;
};

export default ExplorePage;
