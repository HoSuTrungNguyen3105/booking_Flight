import {
  MethodType,
  type FlightMealDetailApiResponse,
  type MealResponse,
  type DetailResponseMessage,
  type FlightMeal,
  type ResponseMessage,
  type CreateFlightMealProps,
  type CreateMealDto,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import { useEffect } from "react";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

export const useGetFlightMealsById = (id: number) => {
  const {
    data: fetchFlightMealsById,
    refetch: refetchFlightMealsById,
    loading: loadingFlightMealsById,
    error: errorFlightMealsById,
  } = useFetch<FlightMealDetailApiResponse, void>({
    url: `/sys/flight-meals/${id}`,
    autoFetch: false,
    config: getMethod,
  });

  useEffect(() => {
    if (id && id > 0) {
      refetchFlightMealsById();
    }
  }, [id]);

  return {
    fetchFlightMealsById,
    refetchFlightMealsById,
    loadingFlightMealsById,
    errorFlightMealsById,
  };
};

export const useGetMeal = () => {
  const { data, refetch, loading } = useFetch<MealResponse, MealResponse>({
    url: "/sys/meals",
    autoFetch: true,
    config: getMethod,
  });
  return {
    mealData: data,
    refetchMealData: refetch,
    loadingMealData: loading,
  };
};

export const useGetMealByFlightId = (id: number) => {
  const {
    data: getGetMealByFlightId,
    refetch: refetchGetMealByFlightId,
    loading: loadingGetMealByFlightId,
  } = useFetch<DetailResponseMessage<FlightMeal>, void>({
    url: `/sys/flight-meals/flight/${id}`,
    autoFetch: true,
    config: getMethod,
  });

  return {
    getGetMealByFlightId,
    refetchGetMealByFlightId,
    loadingGetMealByFlightId,
  };
};

export const useCreateFlightMeal = () => {
  const { refetch: refetchAddMealToFlight, loading: loadingAddMealToFlight } =
    useFetch<ResponseMessage, CreateFlightMealProps>({
      url: "/sys/flight-meals",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchAddMealToFlight,
    loadingAddMealToFlight,
  };
};

export const useCreateMultiMeal = () => {
  const { refetch: refetchCreateMultiMeal, loading: loadingCreateMultiMeal } =
    useFetch<MealResponse, CreateMealDto[]>({
      url: "/sys/meals/create-many",
      autoFetch: false,
      config: postMethod,
    });
  return {
    loadingCreateMultiMeal,
    refetchCreateMultiMeal,
  };
};
