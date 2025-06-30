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
const AsideContainer = styled("div")(() => ({
  position: "relative",
  height: "100%",
}));
const ResizeHandle = styled("div")({
  zIndex: 10,
  width: 8,
  height: 40,
  transform: "translate(100̀%, -50%)",
  backgroundColor: "#ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "se-resize",
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
  const [sidebarHeight, setSidebarHeight] = useState<number>(0);
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
    <ResizeHandle sx={{ height: "100%", px: 1 }}>
      <Box
        component="img"
        // src="./public/image.jpg"
        sx={{ fontSize: "16px", color: "#666" }}
        alt="Resize Handle"
      />
    </ResizeHandle>
  );
  return (
    <AsideContainer ref={asideRef}>
      <ResizableBox
        style={{ border: "1px solid #ccc", padding: 10 }}
        axis="x"
        width={sidebarWidth}
        height={sidebarHeight}
        minConstraints={[185, sidebarHeight]}
        maxConstraints={[400, sidebarHeight]}
        resizeHandles={["e"]} // southeast handle
        onResizeStart={(e) => {
          e.preventDefault();
        }}
        onResize={(_, { size }) => {
          handleWidthChange(size.width);
        }}
        handle={resizeHandleBox}
      >
        <NavContainer>
          <Box component={"nav"} height={`100%`}>
            {children}
          </Box>
        </NavContainer>
      </ResizableBox>
    </AsideContainer>
  );
};

export default memo(Sidebar);
