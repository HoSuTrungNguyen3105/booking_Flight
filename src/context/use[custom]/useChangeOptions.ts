import { useState } from "react";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";
import type { ActionType } from "../../common/Dropdown/SelectDropdown";

export interface CurrencyInfo {
  title: string;
  locale: string;
}

type AppSettings = {
  language: string | null;
  currency: string | null;
};

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
    value: key,
  })
);

export const useChangeLanguage = () => {
  let settings: AppSettings = { language: null, currency: null };
  try {
    const raw = localStorage.getItem("appSettings");
    if (raw) settings = JSON.parse(raw);
  } catch {
    console.warn("Invalid appSettings in localStorage");
  }

  const [selectedLang, setSelectedLang] = useState<ActionType | null>(
    optionLanguage.find((o) => o.value === settings.language) || null
  );

  const [selectedPayMoney, setSelectedPayMoney] = useState<ActionType | null>(
    currencyOptions.find((o) => o.value === settings.currency) || null
  );

  const [pendingLanguage, setPendingLanguage] = useState<ActionType | null>(
    null
  );
  const [pendingPayMoney, setPendingPayMoney] = useState<ActionType | null>(
    null
  );

  const handleLanguageSelect = (newValue: string | number) => {
    const selected = optionLanguage.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingLanguage(selected);
  };

  const handlePayMoneySelect = (newValue: string | number) => {
    const selected = currencyOptions.find((o) => o.value === newValue);
    if (!selected) return;
    setPendingPayMoney(selected);
  };

  const confirmSaveChange = () => {
    const newSettings: AppSettings = {
      language:
        (pendingLanguage?.value as string) ?? selectedLang?.value ?? null,
      currency:
        (pendingPayMoney?.value as string) ?? selectedPayMoney?.value ?? null,
    };

    localStorage.setItem("appSettings", JSON.stringify(newSettings));

    if (pendingPayMoney) {
      setSelectedPayMoney(pendingPayMoney);
      setPendingPayMoney(null);
    }

    if (pendingLanguage) {
      setSelectedLang(pendingLanguage);
      i18n.changeLanguage(String(pendingLanguage.value));
      setPendingLanguage(null);
    }
  };

  return {
    selectedLang,
    selectedPayMoney,

    pendingLanguage,
    pendingPayMoney,

    handleLanguageSelect,
    handlePayMoneySelect,

    confirmSaveChange,

    optionLanguage,
    currencyOptions,
  };
};
