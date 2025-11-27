import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";
import type { ActionType } from "../../common/Dropdown/SelectDropdown";
import { useFindLocaleConfig, type LocaleTypeProps } from "../Api/CommonApi";

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
    value: key,
  })
);

type AppSettings = LocaleTypeProps | null;

const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem("appSettings");
    return raw ? (JSON.parse(raw) as LocaleTypeProps) : null;
  } catch {
    console.warn("Invalid appSettings in localStorage");
    return null;
  }
};

export const useChangeLanguage = () => {
  const { dataFindLocaleConfig, refetchFindLocaleConfig } =
    useFindLocaleConfig();

  const settings = useMemo(() => loadSettings(), []);

  const [selectedLang, setSelectedLang] = useState<ActionType | null>(
    () => optionLanguage.find((o) => o.value === settings?.language) || null
  );

  const [selectedPayMoney, setSelectedPayMoney] = useState<ActionType | null>(
    () => currencyOptions.find((o) => o.value === settings?.currency) || null
  );

  const [pendingLanguage, setPendingLanguage] = useState<ActionType | null>(
    null
  );
  const [pendingPayMoney, setPendingPayMoney] = useState<ActionType | null>(
    null
  );

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleLanguageSelect = useCallback((newValue: string | number) => {
    const selected = optionLanguage.find((o) => o.value === newValue);
    if (selected) setPendingLanguage(selected);
  }, []);

  const handlePayMoneySelect = useCallback((newValue: string | number) => {
    const selected = currencyOptions.find((o) => o.value === newValue);
    if (selected) setPendingPayMoney(selected);
  }, []);

  // ------------------------------
  // Save Changes
  // ------------------------------
  const confirmSaveChange = useCallback(() => {
    const newSettings: LocaleTypeProps = {
      language:
        (pendingLanguage?.value as string) ?? selectedLang?.value ?? "en",
      currency:
        (pendingPayMoney?.value as string) ?? selectedPayMoney?.value ?? "USD",
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

    refetchFindLocaleConfig(newSettings);
  }, [
    pendingLanguage,
    pendingPayMoney,
    selectedLang,
    selectedPayMoney,
    refetchFindLocaleConfig,
  ]);

  const handleSaveChange = useCallback(() => {
    confirmSaveChange();
  }, [confirmSaveChange]);

  // ------------------------------
  // Auto load locale config on mount
  // ------------------------------
  useEffect(() => {
    if (settings?.language && settings?.currency) {
      refetchFindLocaleConfig(settings);
    }
  }, []);

  return {
    handleSaveChange,

    selectedLang,
    selectedPayMoney,

    pendingLanguage,
    pendingPayMoney,

    handleLanguageSelect,
    handlePayMoneySelect,

    confirmSaveChange,

    optionLanguage,
    currencyOptions,

    dataFindLocaleConfig,
  };
};
