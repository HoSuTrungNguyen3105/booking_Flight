import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Fade,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import theme from "../../scss/theme";

interface IProps {
  url: string;
  title: string;
  color?: string;
  background?: string;
  touch?: boolean;
  margin?: number;
  children: React.ReactNode;
}

const CardGroup: React.FC<IProps> = ({
  url,
  title,
  color = "primary",
  background = "transparent",
  margin = 0,
  //   touch = true,
  children,
}) => {
  const navRef = useRef<HTMLDivElement>(null);

  const [scrollState, setScrollState] = useState({
    leftDisabled: true,
    rightDisabled: false,
  });

  // Cập nhật trạng thái nút
  const updateArrows = useCallback(() => {
    const el = navRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, offsetWidth } = el;
    setScrollState({
      leftDisabled: scrollLeft <= 0,
      rightDisabled: scrollLeft + offsetWidth >= scrollWidth - 1,
    });
  }, []);

  // Theo dõi scroll, resize, thay đổi children
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    // Cập nhật ngay sau khi render
    const timeout = setTimeout(updateArrows, 100);

    el.addEventListener("scroll", updateArrows);
    const resizeObserver = new ResizeObserver(updateArrows);
    resizeObserver.observe(el);

    return () => {
      clearTimeout(timeout);
      el.removeEventListener("scroll", updateArrows);
      resizeObserver.disconnect();
    };
  }, [updateArrows, children]);

  // Scroll sang trái/phải
  const handleScroll = (direction: "left" | "right") => {
    const el = navRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    const scrollAmount = (firstChild?.offsetWidth || 300) + margin;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Delay để chờ animation rồi cập nhật nút
    setTimeout(updateArrows, 300);
  };

  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        backgroundColor: background,
        position: "relative",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color={color}
          sx={{ textTransform: "capitalize" }}
        >
          {title}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          href={url}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 2.5,
            py: 1,
          }}
        >
          See all
        </Button>
      </Stack>

      {/* Scrollable container */}
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          margin: "20px auto 0 auto",
          //   maxWidth: "1700px",
          //   position: "relative",
          //   margin: "20px auto 0 auto",
        }}
      >
        {/* overflow: "hidden", position: "relative" */}
        {/* Left arrow */}
        <Fade in={!scrollState.leftDisabled}>
          <IconButton
            onClick={() => handleScroll("left")}
            disabled={scrollState.leftDisabled}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "white",
              opacity: scrollState.leftDisabled ? 0.4 : 1,
              boxShadow: 3,
              "&:hover": { bgcolor: theme.palette.grey[100] },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        </Fade>

        {/* Cards */}
        <Box
          ref={navRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            // px: 2,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {children}
        </Box>

        {/* Right arrow */}
        <Fade in={!scrollState.rightDisabled}>
          <IconButton
            onClick={() => handleScroll("right")}
            disabled={scrollState.rightDisabled}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "white",
              opacity: scrollState.rightDisabled ? 0.4 : 1,
              boxShadow: 3,
              "&:hover": { bgcolor: theme.palette.grey[100] },
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Fade>
      </Box>
    </Box>
  );
};

export default CardGroup;
