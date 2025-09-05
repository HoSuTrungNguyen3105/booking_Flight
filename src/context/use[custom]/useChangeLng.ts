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

  // state tạm (pending, chưa xác nhận)
  const [pendingLang, setPendingLang] = useState<DropdownOptions | null>(null);
  const [pendingPayMoney, setPendingPayMoney] =
    useState<DropdownOptions | null>(null);

  // Khi chọn trong dropdown → chỉ set pending
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

  // Khi người dùng nhấn "Xác nhận"
  const confirmLanguage = () => {
    if (!pendingLang) return;
    setSelectedLang(pendingLang);
    const lng = String(pendingLang.value);
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setPendingLang(null);
  };

  const confirmSaveChange = () => {
    // Lưu paymoney nếu có pending
    if (pendingPayMoney) {
      setSelectedPayMoney(pendingPayMoney);
      localStorage.setItem("paymoney", String(pendingPayMoney.value));
      setPendingPayMoney(null);
    }

    // Lưu language nếu có pending
    if (pendingLang) {
      setSelectedLang(pendingLang);
      const lng = String(pendingLang.value);
      i18n.changeLanguage(lng);
      localStorage.setItem("language", lng);
      setPendingLang(null);
    }
  };

  return {
    // chính thức
    selectedLang,
    selectedPayMoney,

    // tạm (dùng hiển thị preview trong modal)
    pendingLang,
    pendingPayMoney,

    // chọn tạm
    handleLanguageSelect,
    handlePayMoneySelect,

    // xác nhận
    confirmSaveChange,

    // options
    optionLanguage,
    optionPayMoney,
  };
};

// import { useState } from "react";
// import type { DropdownOptions } from "../../common/Dropdown/type";
// import i18n from "../../i18n";
// import { optionLanguage } from "../../i18n/resource";
// const optionPayMoney: DropdownOptions[] = [
//   { label: "USD ($)", value: "usd" },
//   { label: "KRW (₩)", value: "krw" },
//   { label: "VND (₫)", value: "vnd" },
// ];

// export const useChangeLanguage = () => {
//   const [selectedLang, setSelectedLang] = useState<DropdownOptions | null>(
//     optionLanguage.find((o) => o.value === localStorage.getItem("language")) ||
//       null
//   );

//   const [selectedPayMoney, setSelectedPayMoney] =
//     useState<DropdownOptions | null>(
//       optionPayMoney.find(
//         (o) => o.value === localStorage.getItem("paymoney")
//       ) || optionPayMoney[0] // mặc định USD
//     );

//   const handleLanguageChange = (newValue: string | number) => {
//     const selected = optionLanguage.find((o) => o.value === newValue);
//     if (!selected) return;

//     setSelectedLang(selected);
//     const lng = String(selected.value);
//     i18n.changeLanguage(lng);
//     localStorage.setItem("language", lng);
//   };

//   const handlePayMoneyChange = (newValue: string | number) => {
//     const selected = optionPayMoney.find((o) => o.value === newValue);
//     if (!selected) return;

//     setSelectedPayMoney(selected);
//     localStorage.setItem("paymoney", String(selected.value));
//   };

//   return {
//     selectedLang,
//     handleLanguageChange,
//     optionLanguage,
//     selectedPayMoney,
//     handlePayMoneyChange,
//     optionPayMoney,
//   };
// };
