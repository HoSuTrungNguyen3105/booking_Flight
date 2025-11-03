import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface IProps {
  url: string;
  title: string;
  color: string;
  background: string;
  touch?: boolean;
  margin?: number;
  children: React.ReactNode;
}

const CardGroup: React.FC<IProps> = ({
  url,
  title,
  color,
  background,
  margin,
  touch,
  children,
}) => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  //   const scroll = (direction: "left" | "right") => {
  //     if (!scrollRef.current) return;
  //     const { scrollLeft, clientWidth } = scrollRef.current;
  //     const scrollTo =
  //       direction === "left"
  //         ? scrollLeft - clientWidth
  //         : scrollLeft + clientWidth;
  //     scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  //   };

  const startX = useRef<number>(0);
  const isDown = useRef<boolean>(false);
  const itemWidth = useRef<number>(0);
  const scrollLeftX = useRef<number>(0);
  const preventClick = useRef<boolean>(false);
  const movedDistance = useRef<number>(0);
  const navReferenceDiv = useRef<HTMLDivElement | null>(null);

  const [leftArrowDisabled, setLeftArrowDisabled] = useState<boolean>(true);
  const [rightArrowDisabled, setRightArrowDisabled] = useState<boolean>(false);

  /**
   * Sets up the scroll functionality and event listeners on the navigation element.
   */
  useEffect(() => {
    const currentNav = navReferenceDiv.current!;

    /**
     * Updates the disabled state of the left and right arrow buttons based on the current scroll position.
     */
    const updateButtons = () => {
      const { offsetWidth, scrollWidth, scrollLeft } = navReferenceDiv.current!;

      setLeftArrowDisabled(scrollLeft <= 0);

      setRightArrowDisabled(
        scrollWidth - Math.round(scrollLeft) <= offsetWidth + 1
      );
    };

    /**
     * Handles mouse movement during a drag interaction.
     *
     * @param e - The `MouseEvent` representing the mouse move event.
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;

      const x = e.pageX - navReferenceDiv.current!.offsetLeft;

      const walk = x - startX.current;

      navReferenceDiv.current!.scrollLeft = scrollLeftX.current - walk;

      movedDistance.current = Math.abs(walk);

      preventClick.current = movedDistance.current > 5;

      updateButtons();
    };

    /**
     * Initiates a drag interaction when the mouse button is pressed down on the navigation element.
     *
     * @param e - The `MouseEvent` representing the mouse down event.
     */
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      isDown.current = true;

      startX.current = e.pageX - navReferenceDiv.current!.offsetLeft;

      scrollLeftX.current = navReferenceDiv.current!.scrollLeft;

      preventClick.current = false;

      movedDistance.current = 0;

      updateButtons();
    };

    /**
     * Ends the drag interaction when the mouse button is released.
     */
    const handleMouseUp = () => {
      isDown.current = false;
    };

    /**
     * Ends the drag interaction when the mouse leaves the navigation area.
     */
    const handleMouseLeave = () => {
      isDown.current = false;
      preventClick.current = false;
    };

    /**
     * Updates the arrow button state during scrolling.
     */
    const handleScroll = () => {
      updateButtons();
    };

    /**
     * Prevents the default click action if the mouse has been dragged to avoid accidental clicks on child elements during scrolling.
     *
     * @param e - The `MouseEvent` representing the click event.
     */
    const handleClick = (e: MouseEvent) => {
      if (preventClick.current) {
        e.preventDefault();
      }
    };

    if (currentNav.children.length > 0) {
      const firstChild = currentNav.children[0] as HTMLElement;

      itemWidth.current = firstChild.offsetWidth + (margin ?? 0);
    }

    updateButtons();

    window.addEventListener("resize", updateButtons);
    currentNav.addEventListener("click", handleClick);
    currentNav.addEventListener("scroll", handleScroll);

    if (touch) {
      currentNav.addEventListener("mouseup", handleMouseUp);
      currentNav.addEventListener("mousedown", handleMouseDown);
      currentNav.addEventListener("mousemove", handleMouseMove);
      currentNav.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("resize", updateButtons);
      currentNav.removeEventListener("click", handleClick);
      currentNav.removeEventListener("scroll", handleScroll);

      if (touch) {
        currentNav.removeEventListener("mouseup", handleMouseUp);
        currentNav.removeEventListener("mousedown", handleMouseDown);
        currentNav.removeEventListener("mousemove", handleMouseMove);
        currentNav.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [touch, margin]);

  /**
   * Scrolls the navigation container horizontally by one item width.
   *
   * @param direction - A string indicating the direction to scroll, either 'left' or 'right'.
   */
  const handleHorizontalScroll = (direction: "left" | "right") => {
    const scrollAmount =
      direction === "left" ? -itemWidth.current : itemWidth.current;

    navReferenceDiv.current!.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    const { offsetWidth, scrollWidth, scrollLeft } = navReferenceDiv.current!;

    setLeftArrowDisabled(scrollLeft <= 0);

    setRightArrowDisabled(
      scrollWidth - Math.round(scrollLeft) <= offsetWidth + 1
    );
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        backgroundColor: background || "transparent",
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
          fontWeight={600}
          color={color || "primary"}
          sx={{ textTransform: "capitalize" }}
        >
          {title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          href={url}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 2,
            py: 1,
          }}
        >
          See all
        </Button>
      </Stack>

      {/* Slider / Scrollable container */}
      <Box sx={{ position: "relative" }}>
        {/* Left scroll button */}
        {/* <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton> */}

        {/* Scrollable content */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: 2,
            px: 6,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {children}
        </Box>

        {/* Right scroll button */}
        {/* <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton> */}

        {!leftArrowDisabled && (
          <div className="left-arrow">
            <button
              type="button"
              disabled={leftArrowDisabled}
              onClick={() => handleHorizontalScroll("left")}
              className={`button-circle ${
                leftArrowDisabled ? "button-gray" : "button-default"
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          </div>
        )}
        {/* <div className='scrollable' ref={navReferenceDiv}>
        {children}
      </div> */}
        <Box
          ref={navReferenceDiv}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: 2,
            px: 6,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {children}
        </Box>
        {!rightArrowDisabled && (
          <div className="right-arrow">
            <button
              type="button"
              disabled={rightArrowDisabled}
              onClick={() => handleHorizontalScroll("right")}
              className={`button-circle ${
                rightArrowDisabled ? "button-gray" : "button-default"
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default CardGroup;
