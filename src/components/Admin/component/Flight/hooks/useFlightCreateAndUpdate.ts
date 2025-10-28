import { useCallback, useEffect, useRef, useState } from "react";
import type { FlightFormData, FlightFormMode } from "../FlightManagementModal";
import {
  useGetAllCode,
  useGetFlightByIDData,
} from "../../../../../context/Api/useGetApi";
import {
  useCreateFlight,
  useCreateMultiFlight,
  useFlightUpdate,
  type CreateManyFlightResultItem,
} from "../../../../../context/Api/usePostApi";
import { useToast } from "../../../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

interface IFlightCreateAndUpdateProps {
  onClose?: () => void;
  onSuccess?: () => void;
  flightId?: number;
  //   onUpdate: () => void;
  mode?: FlightFormMode;
}

export const useFlightCreateAndUpdate = ({
  onClose = () => {},
  onSuccess = () => {},
  flightId = 0,
  mode = "create",
}: IFlightCreateAndUpdateProps) => {
  const toast = useToast();

  const createDefaultFormData = (): FlightFormData => ({
    flightNo: "",
    flightType: "",
    departureAirport: "",
    arrivalAirport: "",
    // status: "SCHEDULED",
    aircraftCode: "",
    scheduledDeparture: 0,
    scheduledArrival: 0,
    priceEconomy: 0,
    priceBusiness: 0,
    priceFirst: 0,
    // gateId: "",
    terminal: "",
  });

  const [flights, setFlights] = useState<FlightFormData[]>([
    createDefaultFormData(),
  ]);

  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = (
    index: number,
    field: keyof FlightFormData,
    value: string | number
  ) => {
    const newFlights = [...flights];
    (newFlights[index][field] as any) = value;
    setFlights(newFlights);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[index]) {
        delete newErrors[index];
      }
      return newErrors;
    });
  };

  const handleAddFlight = () => {
    setFlights([...flights, createDefaultFormData()]);
  };

  const handleRemoveFlight = (index: number) => {
    if (flights.length === 1) return;
    setFlights(flights.filter((_, i) => i !== index));
  };

  const { refetchCreateMultiFlight } = useCreateMultiFlight();

  const navigate = useNavigate();

  const handleSubmitMultiFlight = async () => {
    try {
      const result = await refetchCreateMultiFlight(flights);

      if (result?.resultCode === "00") {
        const errorMap: Record<number, string> = {};

        setErrors([]);

        const newFlights = flights.map((f, idx) =>
          errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
        );
        setFlights(newFlights);

        if (Object.keys(errorMap).length === 0) {
          navigate("/admin/FlightManagement");
        }
      } else {
        const errorMap: Record<number, string> = {};

        result?.list?.forEach(
          (item: CreateManyFlightResultItem, idx: number) => {
            if (item.errorCode && item.errorCode !== "00") {
              errorMap[idx] = item.errorMessage || "Unknown error";
            }
          }
        );

        setErrors(errorMap);

        const newFlights = flights.map((f, idx) =>
          errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
        );
        setFlights(newFlights);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const { getFlightByIdData, refetchGetFlightData } = useGetFlightByIDData({
    id: mode === "update" && flightId ? flightId : undefined,
  });

  const stepTopRef = useRef<HTMLDivElement | null>(null);

  const { refetchCreateFlightData } = useCreateFlight();

  const { refetchUpdateFlightId } = useFlightUpdate({ id: flightId });

  const { getAllCode } = useGetAllCode();

  const mapFlightToFormData = (
    data?: Partial<FlightFormData>
  ): FlightFormData => {
    if (!data) return createDefaultFormData();

    return {
      flightNo: data.flightNo || "",
      flightType: data.flightType || "",
      departureAirport: data.departureAirport || "",
      arrivalAirport: data.arrivalAirport || "",
      // status: data.status || "SCHEDULED",
      aircraftCode: data.aircraftCode || "",
      scheduledDeparture: data.scheduledDeparture
        ? Number(data.scheduledDeparture)
        : 0,
      scheduledArrival: data.scheduledArrival
        ? Number(data.scheduledArrival)
        : 0,
      priceEconomy: data.priceEconomy || 0,
      priceBusiness: data.priceBusiness || 0,
      priceFirst: data.priceFirst || 0,
      gateId: data.gateId || "",
      terminal: data.terminal || "",
      isCancelled: data.isCancelled || false,
      delayMinutes: data.delayMinutes || 0,
      seats: data.seats || [],
    };
  };

  useEffect(() => {
    if (mode === "update" && getFlightByIdData?.data) {
      setFormData(mapFlightToFormData(getFlightByIdData.data));
    }
  }, [getFlightByIdData?.data, mode]);

  const handleRefetchAllData = useCallback(async () => {
    try {
      if (mode === "update" && flightId) {
        await refetchGetFlightData();
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  }, [mode, flightId, refetchGetFlightData]);

  const [formData, setFormData] = useState<FlightFormData>(
    mode === "update"
      ? mapFlightToFormData(getFlightByIdData?.data)
      : createDefaultFormData()
  );

  const handleSave = useCallback(async () => {
    try {
      if (mode === "update" && flightId) {
        const updateData = {
          flightNo: formData.flightNo,
          flightType: formData.flightType,
          departureAirport: formData.departureAirport,
          arrivalAirport: formData.arrivalAirport,
          aircraftCode: formData.aircraftCode,
          actualDeparture: formData.actualDeparture,
          actualArrival: formData.actualArrival,
          priceEconomy: formData.priceEconomy,
          priceBusiness: formData.priceBusiness,
          priceFirst: formData.priceFirst,
          gateId: formData.gateId,
          terminal: formData.terminal,
          isCancelled: formData.isCancelled,
          delayMinutes: formData.delayMinutes,
          ...(formData.isCancelled && {
            cancellationReason: formData.cancellationReason,
          }),
          ...(formData.delayMinutes && {
            delayReason: formData.delayReason,
          }),
        };

        const response = await refetchUpdateFlightId(updateData);

        if (response?.resultCode === "00") {
          onSuccess();
          onClose();
        } else {
          toast(response?.resultMessage || "Update flight failed", "error");
        }
      } else if (mode === "create") {
        const createData = {
          flightNo: formData.flightNo,
          flightType: formData.flightType,
          departureAirport: formData.departureAirport,
          arrivalAirport: formData.arrivalAirport,
          aircraftCode: formData.aircraftCode,
          scheduledDeparture: formData.scheduledDeparture,
          scheduledArrival: formData.scheduledArrival,
          priceEconomy: formData.priceEconomy,
          priceBusiness: formData.priceBusiness,
          priceFirst: formData.priceFirst,
          terminal: formData.terminal,
        };

        const response = await refetchCreateFlightData(createData);

        if (response?.resultCode === "00") {
          toast(response?.resultMessage || "Success create", "success");
          onSuccess();
          onClose();
        } else {
          toast(response?.resultMessage || "Error create", "error");
        }
      }
    } catch (error) {
      console.error("Error saving flight:", error);
    }
  }, [
    formData,
    mode,
    flightId,
    refetchUpdateFlightId,
    refetchCreateFlightData,
    onSuccess,
  ]);

  useEffect(() => {
    if (mode === "update" && getFlightByIdData?.data) {
      setFormData(mapFlightToFormData(getFlightByIdData.data));
    }
  }, [getFlightByIdData?.data, mode]);

  useEffect(() => {
    if (!open) {
      setFormData(
        mode === "update"
          ? mapFlightToFormData(getFlightByIdData?.data)
          : createDefaultFormData()
      );
      setActiveStep(0);
    }
  }, [open, mode, getFlightByIdData]);

  const optionAirportCode =
    getAllCode?.data?.airport?.map((e) => ({
      label: ` ${e.value}`,
      value: e.code,
    })) ?? [];

  const optionAircraftCode =
    getAllCode?.data?.aircraft?.map((e) => ({
      label: ` ${e.value}`,
      value: e.code,
    })) ?? [];

  const optionWay = [
    {
      value: "oneway",
      label: "Một chiều",
    },
    { value: "roundtrip", label: "Khứ hồi" },
  ];

  const steps = [
    "Thông tin cơ bản",
    "Thời gian bay",
    "Giá vé & Dung lượng",
    "Cổng & Trạng thái",
  ];

  const handleInputChange = <K extends keyof FlightFormData>(
    field: K,
    value: FlightFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    handleSave();
  };

  useEffect(() => {
    if (stepTopRef.current) {
      stepTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeStep]);

  return {
    formData,
    handleSubmit,
    optionAirportCode,
    optionAircraftCode,
    handleRefetchAllData,
    handleInputChange,
    optionWay,
    stepTopRef,
    setActiveStep,
    activeStep,
    steps,

    handleSubmitMultiFlight,
    handleAddFlight,
    handleRemoveFlight,
    errors,
    handleChange,
    flights,
  } as const;
};
