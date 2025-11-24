export const generateSearchToken = (params: Record<string, string>): string => {
  const salt = "FLIGHT_SEARCH_SECRET_SALT_2024";
  const sortedKeys = Object.keys(params).sort();
  const dataString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return btoa(`${salt}:${dataString}`);
};
