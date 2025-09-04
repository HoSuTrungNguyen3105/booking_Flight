import { Box, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (val: string) => void;
  onComplete?: (val: string) => void;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
}: OTPInputProps) {
  const [internal, setInternal] = useState<string>("".padEnd(length, ""));
  const vals = (value ?? internal)
    .slice(0, length)
    .padEnd(length, "")
    .split("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const setVal = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    if (!value) setInternal(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const handleChange = (idx: number, ch: string) => {
    const digits = ch.replace(/\D/g, "");
    const next = vals.map((v, i) => (i === idx ? digits : v)).join("");
    setVal(next);
    if (digits && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
      e.preventDefault();
    }
    if (e.key === "Backspace" && !vals[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  return (
    <Box display="flex" gap={1} justifyContent="center">
      {Array.from({ length }).map((_, i) => (
        <TextField
          key={i}
          inputRef={(el) => (inputsRef.current[i] = el)}
          value={vals[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: 500,
            },
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          sx={{
            width: 48,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 56,
            },
          }}
        />
      ))}
    </Box>
  );
}
