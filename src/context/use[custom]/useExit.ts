import { useNavigate } from "react-router-dom";

export function useExit() {
  const navigate = useNavigate();

  const exit = () => {
    navigate(-1);
  };

  return exit;
}
