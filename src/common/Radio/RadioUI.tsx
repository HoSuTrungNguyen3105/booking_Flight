import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import type { RadioProps } from "./type";

const RadioUI: React.FC<RadioProps> = ({
  options,
  name,
  selectedValue,
  onChange,
  color = "primary",
}) => {
  return (
    <div className="radio-container">
      <FormControl className={`radio-group ${color}`}>
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
              label={option.label}
              className={`radio-option ${option.disabled ? "disabled" : ""}`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioUI;
