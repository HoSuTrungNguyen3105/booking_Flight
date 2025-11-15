import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useCreateRandomFlight } from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import { ResponseCode } from "../../utils/response";

const CreateRandomFlights: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { refetchCreateRandomFlight } = useCreateRandomFlight();
  const toast = useToast();
  const handleCreateFlights = async () => {
    setLoading(true);
    try {
      const res = await refetchCreateRandomFlight();
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(`Created ${res.resultMessage} flights successfully!`);
      }
    } catch (err: any) {
      toast(`${err.message}!`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateFlights}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Create Random Flights"}
      </Button>
    </div>
  );
};

export default CreateRandomFlights;
