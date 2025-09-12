import React, { useState } from "react";
import { Box, Typography, FormControlLabel, Button } from "@mui/material";
import "../../scss/form/_checkbox.scss";
import { useTranslation } from "react-i18next";
import { Checkbox } from "./Checkbox";

const CheckboxUI: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  //   const currentLanguage = locales[i18n.language as keyof typeof locales];
  const initialPrimaryState = [
    [false, false],
    [false, true],
    [false, false],
  ];
  const initialSecondaryState = [
    [false, false],
    [true, false],
    [false, false],
  ];

  const changeLanguage = () => {
    if (i18n.language == "en") {
      i18n.changeLanguage("ko");
    } else {
      i18n.changeLanguage("en");
    }
  };

  const [primaryState, setPrimaryState] = useState(initialPrimaryState);
  const [secondaryState, setSecondaryState] = useState(initialSecondaryState);

  const handleParentChange = (
    columnIndex: number,
    state: boolean[][],
    setState: React.Dispatch<React.SetStateAction<boolean[][]>>
  ) => {
    const [child1, child2] = state[columnIndex];
    const allChecked = child1 && child2;
    const newColumnState = [!allChecked, !allChecked];
    const newState = [...state];
    newState[columnIndex] = newColumnState;
    setState(newState);
  };

  const handleChildChange = (
    columnIndex: number,
    childIndex: number,
    state: boolean[][],
    setState: React.Dispatch<React.SetStateAction<boolean[][]>>
  ) => {
    const newColumnState = [...state[columnIndex]];
    newColumnState[childIndex] = !state[columnIndex][childIndex];
    const newState = [...state];
    newState[columnIndex] = newColumnState;
    setState(newState);
  };

  const isParentIndeterminate = (columnIndex: number, state: boolean[][]) => {
    const [child1, child2] = state[columnIndex];
    console.log(
      `Column ${columnIndex} - Child1: ${child1}, Child2: ${child2}, Indeterminate: ${
        child1 !== child2
      }`
    );

    return child1 !== child2;
  };

  const renderMatrix = (
    title: string,
    state: boolean[][],
    setState: React.Dispatch<React.SetStateAction<boolean[][]>>,
    color: "primary" | "secondary"
  ) => (
    <Box className="matrix-group">
      <Typography className="matrix-title">{title}</Typography>
      <Box className="matrix-container">
        {/* Header Row */}
        <Box className="matrix-row header-row">
          <Typography className="header-cell">Default</Typography>
          <Typography className="header-cell">Hover</Typography>
          <Typography className="header-cell">Disabled</Typography>
        </Box>
        {/* Checked Row */}
        <Box className="matrix-row">
          <Typography className="status-cell">Checked</Typography>
          {state.map((column, columnIndex) => (
            <Box key={columnIndex} className="matrix-cell">
              <FormControlLabel
                control={
                  <Checkbox
                    className={`checkbox ${color}`}
                    color={color}
                    checked={column[0]}
                    onChange={() =>
                      handleChildChange(columnIndex, 0, state, setState)
                    }
                  />
                }
                label="Text"
              />
            </Box>
          ))}
        </Box>
        {/* Unchecked Row */}
        <Box className="matrix-row">
          <Typography className="status-cell">Unchecked</Typography>
          {state.map((column, columnIndex) => (
            <Box key={columnIndex} className="matrix-cell">
              <FormControlLabel
                control={
                  <Checkbox
                    className={`checkbox ${color}`}
                    data-testid={`${title}-Unchecked-${columnIndex}`}
                    color={color}
                    checked={column[1]}
                    onChange={() =>
                      handleChildChange(columnIndex, 1, state, setState)
                    }
                  />
                }
                label="Text"
              />
            </Box>
          ))}
        </Box>
        {/* Indeterminate Row */}
        <Box className="matrix-row">
          <Typography className="status-cell">Indeterminate</Typography>
          {state.map((_, columnIndex) => (
            <Box key={columnIndex} className="matrix-cell">
              <FormControlLabel
                control={
                  <Checkbox
                    className={`checkbox ${color}`}
                    data-testid={`${title}-Indeterminate-${columnIndex}`}
                    color={color}
                    checked={state[columnIndex][0] && state[columnIndex][1]}
                    indeterminate={isParentIndeterminate(columnIndex, state)}
                    onChange={() =>
                      handleParentChange(columnIndex, state, setState)
                    }
                  />
                }
                label="Text"
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className="checkbox-ui">
      <Typography className="title">{t("title1")}</Typography>
      <Typography className="description1">{t("description1")}</Typography>
      <Typography className="description2">{t("description2")}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => changeLanguage()}
        className="language-button"
      >
        {t("language")}
      </Button>
      <Box className="matrix-wrapper">
        {renderMatrix(
          "Color-Primary",
          primaryState,
          setPrimaryState,
          "primary"
        )}
        {renderMatrix(
          "Color-Secondary",
          secondaryState,
          setSecondaryState,
          "secondary"
        )}
      </Box>
    </Box>
  );
};

export default CheckboxUI;
