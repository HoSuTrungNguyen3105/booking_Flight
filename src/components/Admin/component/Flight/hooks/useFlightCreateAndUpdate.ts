import { useCallback, useEffect, useRef, useState } from "react";
import type { FlightFormData, FlightFormMode } from "../FlightManagementModal";
import {
  useGetAllCode,
  useGetAllGateCode,
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
import { ResponseCode } from "../../../../../utils/response";

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
  const [enableAdvancedPrice, setEnableAdvancedPrice] = useState(false);

  const createDefaultFormData = (): FlightFormData => ({
    flightNo: "",
    flightType: "",
    departureAirport: "",
    arrivalAirport: "",
    aircraftCode: "",
    scheduledDeparture: 0,
    scheduledArrival: 0,
    priceEconomy: 0,
    priceBusiness: 0,
    priceFirst: 0,
    gateId: "",
    isDomestic: false,
    // isCancelled: false,
    // delayMinutes: 0,
    seats: [],
  });

  const [flights, setFlights] = useState<FlightFormData[]>([
    createDefaultFormData(),
  ]);

  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = useCallback(
    (
      index: number,
      field: keyof FlightFormData,
      value: string | number | boolean
    ) => {
      setFlights((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });

      setErrors((prev) => {
        if (!prev[index]) return prev;
        const { [index]: _, ...rest } = prev;
        return rest;
      });
    },
    []
  );
  const handleAddFlight = useCallback(() => {
    setFlights((prev) => [...prev, createDefaultFormData()]);
  }, []);

  const handleRemoveFlight = useCallback((index: number) => {
    setFlights((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  }, []);

  const { refetchCreateMultiFlight } = useCreateMultiFlight();

  const navigate = useNavigate();

  const handleSubmitMultiFlight = useCallback(async () => {
    try {
      const result = await refetchCreateMultiFlight(flights);
      const errorMap: Record<number, string> = {};

      result?.list?.forEach((item: CreateManyFlightResultItem, idx: number) => {
        if (item.errorCode && item.errorCode !== ResponseCode.SUCCESS) {
          errorMap[idx] = item.errorMessage || "Unknown error";
        }
      });

      setErrors(errorMap);

      const newFlights = flights.map((f, idx) =>
        errorMap[idx] ? f : { ...f, flightNo: "", aircraftCode: "" }
      );
      setFlights(newFlights);

      if (Object.keys(errorMap).length === 0) {
        navigate("/admin/FlightManagement");
      }
    } catch (err) {
      console.error("Error submitting flights:", err);
    }
  }, [flights, refetchCreateMultiFlight, navigate]);

  const [activeStep, setActiveStep] = useState(0);

  const { getFlightByIdData, refetchGetFlightData } = useGetFlightByIDData({
    id: mode === "update" && flightId ? flightId : undefined,
  });

  const stepTopRef = useRef<HTMLDivElement | null>(null);

  const { refetchCreateFlightData } = useCreateFlight();

  const { refetchUpdateFlightId } = useFlightUpdate({ id: flightId });

  const { getAllCode } = useGetAllCode();

  const mapFlightToFormData = useCallback(
    (data?: Partial<FlightFormData>): FlightFormData => ({
      ...createDefaultFormData(),
      ...data,
      scheduledDeparture: Number(data?.scheduledDeparture ?? 0),
      scheduledArrival: Number(data?.scheduledArrival ?? 0),
    }),
    []
  );

  useEffect(() => {
    if (mode === "update" && getFlightByIdData?.data) {
      setFormData(mapFlightToFormData(getFlightByIdData.data));
    }
  }, [mode, getFlightByIdData?.data, mapFlightToFormData]);

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
      const payload = {
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
        isDomestic: formData.isDomestic,
        gateId: formData.gateId,
        // isCancelled: formData.isCancelled,
        // delayMinutes: formData.delayMinutes,
        // cancellationReason: formData.isCancelled
        //   ? formData.cancellationReason
        //   : undefined,
        // delayReason: formData.delayMinutes ? formData.delayReason : undefined,
      };

      const response =
        mode === "update"
          ? await refetchUpdateFlightId(payload)
          : await refetchCreateFlightData(payload);
      console.log("res", payload);
      if (response?.resultCode === ResponseCode.SUCCESS) {
        toast(response?.resultMessage || "Success", "success");
        onSuccess?.();
        onClose?.();
      } else {
        toast(response?.resultMessage || "Error", "error");
      }
    } catch (err) {
      console.error("Error saving flight:", err);
    }
  }, [
    formData,
    mode,
    refetchUpdateFlightId,
    refetchCreateFlightData,
    onSuccess,
    onClose,
  ]);

  useEffect(() => {
    if (!open) {
      setFormData(
        mode === "update"
          ? mapFlightToFormData(getFlightByIdData?.data)
          : createDefaultFormData()
      );
      setActiveStep(0);
    }
  }, [open, mode, getFlightByIdData, mapFlightToFormData]);

  const { dataAllGateCode } = useGetAllGateCode();

  const optionAllGateCode =
    dataAllGateCode?.list?.map((e) => ({
      label: ` ${e.code}`,
      value: e.id,
    })) ?? [];

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

  const handleInputChange = useCallback(
    <K extends keyof FlightFormData>(field: K, value: FlightFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

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
    enableAdvancedPrice,
    setEnableAdvancedPrice,
    stepTopRef,
    setActiveStep,
    activeStep,
    steps,
    optionAllGateCode,

    handleSubmitMultiFlight,
    handleAddFlight,
    handleRemoveFlight,
    errors,
    handleChange,
    flights,
  } as const;
};
