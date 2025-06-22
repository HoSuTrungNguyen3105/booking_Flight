import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useTranslation } from "react-i18next";
import "../../scss/form/_radio.scss";
import type { RadioProps } from "./type";

const RadioUI: React.FC<RadioProps> = ({
  label,
  options,
  name,
  selectedValue,
  onChange,
  color = "primary",
}) => {
  const { t } = useTranslation();
  return (
    <div className="radio-container">
      <FormControl className={`radio-group ${color}`}>
        <FormLabel className="radio-label">{t(label)}</FormLabel>
        <RadioGroup
          row
          name={name}
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio className="radio-input" disabled={option.disabled} />
              }
              label={t(option.label)}
              className={`radio-option ${option.disabled ? "disabled" : ""}`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioUI;
