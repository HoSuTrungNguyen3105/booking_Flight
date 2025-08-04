import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

const customStyles = {
  borderRadius: "3px",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: 1.35,
};

const theme = createTheme({
  palette: {
    grey: {
      50: "#f7f7f7",
      100: "#f2f2f2",
      200: "#e0e0e0",
      300: "#d2d2d2",
      400: "#b8a8a8",
      500: "#8e8e8e",
      600: "#696969",
      700: "#5e5e5e",
      800: "#bcbcbc",
      900: "#797878",
    },
    background: {
      default: "#f2f2f2",
      paper: "#ffffff",
    },
    primary: {
      main: "#758c8b",
      light: "#88a5a4",
      dark: "#3b5b5a",
    },
    secondary: {
      main: "#6366f1",
      light: "#e0e7ff",
      dark: "#4338ca",
    },
    error: {
      main: "#9a011c",
      light: "#f4e7eb",
      dark: "#f44336",
    },
    warning: {
      main: "#ffd600",
      light: "#fff7db",
      dark: "#e58900",
    },
    success: {
      main: "#4db6ac",
    },
    text: {
      primary: "#515151",
      secondary: "#bcbcbc",
    },
    DataGrid: {
      bg: "#FFFFFF",
      headerBg: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
    fontSize: 16,
    fontWeightRegular: 400,

    // title1: {
    //   fontSize: '20px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // title2: {
    //   fontSize: '20px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // title3: {
    //   fontSize: '20px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // subtitle1Semibold: {
    //   fontSize: '16px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // body2Medium: {
    //   fontSize: '15px',
    //   fontWeight: 500,
    //   lineHeight: 1.2,
    // },
    // body2Regular: {
    //   fontSize: '14px',
    //   fontWeight: 400,
    //   lineHeight: 1.2,
    // },
    // bodyMedium: {
    //   fontSize: '13px',
    //   fontWeight: 500,
    //   lineHeight: 1.2,
    // },
    // bodyRegular1: {
    //   fontSize: '13px',
    //   fontWeight: 400,
    //   lineHeight: 1.2,
    // },
    // bodyRegular2: {
    //   fontSize: '13px',
    //   fontWeight: 400,
    //   lineHeight: 1.35,
    // },
    // body15Semibold: {
    //   fontSize: '14px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // smallBodyMedium: {
    //   fontSize: '13px',
    //   fontWeight: 500,
    //   lineHeight: 1.2,
    // },
    // smallBodyRegular: {
    //   fontSize: '12px',
    //   fontWeight: 400,
    //   lineHeight: 1.2,
    // },
    // captionSemibold: {
    //   fontSize: '11px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
    // subtitle15: {
    //   fontSize: '15px',
    //   fontWeight: 600,
    //   lineHeight: 1.2,
    // },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          ...customStyles,
          "& .MuiInputBase-input": {
            padding: "11px 17px",
          },
          "&.Mui-disabled": {
            backgroundColor: "#F2F2F2",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          ...customStyles,
          textTransform: "none",
          "& .MuiButton-loading": {
            visibility: "hidden",
          },
          "& .MuiTypography-root": {
            visibility: "hidden",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: customStyles,
      },
    },
  },
});

export default theme;
