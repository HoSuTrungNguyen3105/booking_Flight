import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);

    // Nếu default là string → trả raw string
    if (typeof defaultValue === "string" || defaultValue === null) {
      return (item as unknown as T) ?? defaultValue;
    }

    // Nếu object → parse
    try {
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof value === "string") {
      // string → store directly
      localStorage.setItem(key, value);
    } else if (value === null || value === undefined) {
      localStorage.setItem(key, "");
    } else {
      // Object → JSON
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
