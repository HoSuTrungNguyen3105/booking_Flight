import { useState } from "react";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";
import type { ActionType } from "../../common/Dropdown/SelectDropdown";

export interface CurrencyInfo {
  title: string;
  locale: string;
}

export type CurrencyMap = Record<string, CurrencyInfo>;

export const CURRENCIES: CurrencyMap = {
  USD: { title: "U.S. Dollar", locale: "en-US" },
  KRW: { title: "Korean Won", locale: "ko-KR" },
  JPY: { title: "Japanese Yen", locale: "ja-JP" },
  VND: { title: "Vietnamese Dong", locale: "vi-VN" },
};

export const currencyOptions: ActionType[] = Object.keys(CURRENCIES).map(
  (key) => ({
    label: CURRENCIES[key].title,
    value: key as keyof typeof CURRENCIES,
  })
);

export const useChangeLanguage = () => {
  const [selectedLang, setSelectedLang] = useState<ActionType | null>(
    optionLanguage.find((o) => o.value === localStorage.getItem("language")) ||
      null
  );

  const [selectedPayMoney, setSelectedPayMoney] = useState<ActionType | null>(
    currencyOptions.find(
      (o) => o.value === localStorage.getItem("currencyOptions")
    ) || currencyOptions[0]
  );

  const [pendingLang, setPendingLang] = useState<ActionType | null>(null);
  const [pendingPayMoney, setPendingPayMoney] = useState<ActionType | null>(
    null
  );

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
    currencyOptions,
  };
};
