import { useState } from "react";
import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";

const optionPayMoney: DropdownOptions[] = [
  { label: "USD ($)", value: "usd" },
  { label: "KRW (₩)", value: "krw" },
  { label: "VND (₫)", value: "vnd" },
];

export const useChangeLanguage = () => {
  const [selectedLang, setSelectedLang] = useState<DropdownOptions | null>(
    optionLanguage.find((o) => o.value === localStorage.getItem("language")) ||
      null
  );

  const [selectedPayMoney, setSelectedPayMoney] =
    useState<DropdownOptions | null>(
      optionPayMoney.find(
        (o) => o.value === localStorage.getItem("paymoney")
      ) || optionPayMoney[0]
    );

  const [pendingLang, setPendingLang] = useState<DropdownOptions | null>(null);
  const [pendingPayMoney, setPendingPayMoney] =
    useState<DropdownOptions | null>(null);

  const handleLanguageSelect = (newValue: string | number) => {
    const selected = optionLanguage.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingLang(selected);
  };

  const handlePayMoneySelect = (newValue: string | number) => {
    const selected = optionPayMoney.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingPayMoney(selected);
  };

  const confirmSaveChange = () => {
    if (pendingPayMoney) {
      setSelectedPayMoney(pendingPayMoney);
      localStorage.setItem("paymoney", String(pendingPayMoney.value));
      setPendingPayMoney(null);
    }

    if (pendingLang) {
      setSelectedLang(pendingLang);
      const lng = String(pendingLang.value);
      i18n.changeLanguage(lng);
      localStorage.setItem("language", lng);
      setPendingLang(null);
    }
  };

  return {
    selectedLang,
    selectedPayMoney,

    pendingLang,
    pendingPayMoney,

    handleLanguageSelect,
    handlePayMoneySelect,

    confirmSaveChange,

    optionLanguage,
    optionPayMoney,
  };
};
