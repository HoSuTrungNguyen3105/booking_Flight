export type Hotel = {
  id: number;
  hotelCode?: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  distanceToCenter: number;
  imageUrl: string;
  price: number;
  rooms?: number;
  discountPercent?: number;
  isPrime: boolean;
  freeWifi: boolean;
  covidMeasures: boolean;
  freeCancel: boolean;
  payLater: boolean;
  createdAt: number;
  updatedAt: number;
};

export type CreateHotelDto = Omit<Hotel, "id" | "createdAt" | "updatedAt">;
