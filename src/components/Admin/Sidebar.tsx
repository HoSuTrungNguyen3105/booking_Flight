import { Box, styled } from "@mui/material";
import {
  useRef,
  useState,
  type PropsWithChildren,
  useCallback,
  useEffect,
  memo,
} from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const AsideContainer = styled("div")(() => ({
  position: "relative",
  height: "100%",
}));

const ResizeHandle = styled("div")({
  position: "absolute",
  top: "50%",
  right: 0,
  transform: "translateY(-50%)",
  width: 6,
  height: 40,
  backgroundColor: "#ccc",
  cursor: "col-resize",
  zIndex: 10,
});

const NavContainer = styled(Box)({
  height: "100%",
  overflow: "hidden",
});

const Sidebar = ({ children }: PropsWithChildren) => {
  const asideRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(
    Number(localStorage.getItem("sidebarWidth")) || 250
  );
  const [sidebarHeight, setSidebarHeight] = useState<number>(
    window.innerHeight
  );

  const handleWidthChange = useCallback((newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem("sidebarWidth", newWidth.toString());
  }, []);

  const resizeHandle = useCallback(() => {
    if (asideRef.current) {
      setSidebarHeight(asideRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    resizeHandle();
    window.addEventListener("resize", resizeHandle);
    return () => window.removeEventListener("resize", resizeHandle);
  }, [resizeHandle]);

  const resizeHandleBox = (
    <ResizeHandle>
      <Box
        sx={{
          width: "4px",
          height: "40px",
          bgcolor: "#999",
          borderRadius: "2px",
        }}
      />
    </ResizeHandle>
  );

  return (
    <AsideContainer ref={asideRef}>
      <ResizableBox
        width={sidebarWidth}
        height={sidebarHeight}
        axis="x"
        minConstraints={[185, sidebarHeight]}
        maxConstraints={[400, sidebarHeight]}
        resizeHandles={["e"]}
        onResize={(_, { size }) => handleWidthChange(size.width)}
        handle={resizeHandleBox}
        // style={{
        //   position: "relative", // ✅ rất quan trọng để handle dùng absolute bên trong
        //   display: "flex",
        //   flexDirection: "column",
        // }}
      >
        <NavContainer>
          <Box component="nav" height="100%">
            {children}
          </Box>
        </NavContainer>
      </ResizableBox>
    </AsideContainer>
  );
};

export default memo(Sidebar);
