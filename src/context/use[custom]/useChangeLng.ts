import { useState } from "react";
import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";
import useLocalStorage from "./useLocalStorage";

const currencyOptions: DropdownOptions[] = [
  { label: "USD ($)", value: "usd" },
  { label: "KRW (₩)", value: "krw" },
  { label: "VND (₫)", value: "vnd" },
];

export const useChangeLanguage = () => {
  // Sử dụng useLocalStorage thay vì useState + localStorage trực tiếp
  const [language, setLanguage] = useLocalStorage<string>(
    "language",
    (optionLanguage[0]?.value as string) || "en"
  );

  const [currency, setCurrency] = useLocalStorage<string>(
    "currency",
    (currencyOptions[0]?.value as string) || "usd"
  );

  const [pendingLang, setPendingLang] = useState<DropdownOptions | null>(null);
  const [pendingPayMoney, setPendingPayMoney] =
    useState<DropdownOptions | null>(null);

  // Tìm selected options dựa trên giá trị từ localStorage
  const selectedLang = optionLanguage.find((o) => o.value === language) || null;
  const selectedPayMoney =
    currencyOptions.find((o) => o.value === currency) || currencyOptions[0];

  const handleLanguageSelect = (newValue: string | number) => {
    const selected = optionLanguage.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingLang(selected);
  };

  const handlePayMoneySelect = (newValue: string | number) => {
    const selected = currencyOptions.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingPayMoney(selected);
  };

  const confirmSaveChange = () => {
    if (pendingPayMoney) {
      setCurrency(String(pendingPayMoney.value)); // Cập nhật qua useLocalStorage
      setPendingPayMoney(null);
    }

    if (pendingLang) {
      const lng = String(pendingLang.value);
      setLanguage(lng); // Cập nhật qua useLocalStorage
      i18n.changeLanguage(lng);
      setPendingLang(null);
    }
  };

  // Hủy thay đổi pending
  const cancelChanges = () => {
    setPendingLang(null);
    setPendingPayMoney(null);
  };

  return {
    selectedLang,
    selectedPayMoney,

    pendingLang,
    pendingPayMoney,

    handleLanguageSelect,
    handlePayMoneySelect,

    confirmSaveChange,
    cancelChanges, // Thêm hàm hủy

    optionLanguage,
    currencyOptions,
  };
};
