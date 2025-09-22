// import React, { useCallback } from 'react';
// import ReactFlow, {
//   Node,
//   Edge,
//   addEdge,
//   Connection,
//   useNodesState,
//   useEdgesState,
//   Controls,
//   Background,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// const initialNodes: Node[] = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'Phòng 101' },
//     position: { x: 250, y: 25 },
//     style: { background: '#f0f0f0', border: '1px solid #222', width: 100, height: 60 },
//   },
//   {
//     id: '2',
//     data: { label: 'Hành lang' },
//     position: { x: 100, y: 125 },
//     style: { background: '#e0e0e0', width: 200, height: 40 },
//   },
//   {
//     id: '3',
//     data: { label: 'Cầu thang' },
//     position: { x: 400, y: 125 },
//     style: { background: '#d0d0d0', width: 80, height: 120 },
//   },
// ];

// const initialEdges: Edge[] = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e1-3', source: '1', target: '3' },
// ];

// const BuildingDiagram: React.FC = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   return (
//     <div style={{ width: '100%', height: '500px' }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// };

// export default BuildingDiagram;

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AirportShuttle as GateIcon,
  Flight as FlightIcon,
  Terrain as RunwayIcon,
  LocalParking as StandIcon,
  Business as TerminalIcon,
} from "@mui/icons-material";

// Định nghĩa kiểu dữ liệu
interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

interface AirportDiagramState {
  nodes: Node[];
  connections: Connection[];
}

const AirportSampleDiagram: React.FC = () => {
  const [state, setState] = useState<AirportDiagramState>({
    nodes: [
      {
        id: "1",
        type: "terminal",
        x: 100,
        y: 100,
        label: "Terminal 1",
        width: 120,
        height: 60,
      },
      {
        id: "2",
        type: "terminal",
        x: 400,
        y: 100,
        label: "Terminal 2",
        width: 120,
        height: 60,
      },
      {
        id: "3",
        type: "gate",
        x: 50,
        y: 200,
        label: "Cổng A1",
        width: 80,
        height: 40,
      },
      {
        id: "4",
        type: "gate",
        x: 150,
        y: 200,
        label: "Cổng A2",
        width: 80,
        height: 40,
      },
      {
        id: "5",
        type: "gate",
        x: 450,
        y: 200,
        label: "Cổng B1",
        width: 80,
        height: 40,
      },
      {
        id: "6",
        type: "runway",
        x: 250,
        y: 350,
        label: "Đường băng 1",
        width: 150,
        height: 30,
      },
      {
        id: "7",
        type: "runway",
        x: 450,
        y: 350,
        label: "Đường băng 2",
        width: 150,
        height: 30,
      },
      {
        id: "8",
        type: "stand",
        x: 250,
        y: 250,
        label: "Vị trí 1",
        width: 70,
        height: 70,
      },
      {
        id: "9",
        type: "flight",
        x: 350,
        y: 300,
        label: "VN 123",
        width: 90,
        height: 40,
      },
    ],
    connections: [
      { id: "c1", source: "1", target: "3" },
      { id: "c2", source: "1", target: "4" },
      { id: "c3", source: "2", target: "5" },
      { id: "c4", source: "3", target: "8" },
      { id: "c5", source: "4", target: "8" },
      { id: "c6", source: "5", target: "8" },
      { id: "c7", source: "8", target: "6" },
      { id: "c8", source: "8", target: "7" },
      { id: "c9", source: "9", target: "6" },
    ],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("gate");
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeId, setNewNodeId] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const renderDiagram = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Xóa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ lưới
    drawGrid(ctx, canvas.width, canvas.height);

    // Vẽ các đường kết nối
    if (showConnections) {
      state.connections.forEach((conn) => {
        drawConnection(ctx, conn, state.nodes);
      });
    }

    // Vẽ các node
    state.nodes.forEach((node) => {
      let color = "#2196f3";
      let borderColor = "#1976d2";

      switch (node.type) {
        case "terminal":
          color = "#4caf50";
          borderColor = "#388e3c";
          break;
        case "gate":
          color =
            node.properties?.status === "available"
              ? "#2196f3"
              : node.properties?.status === "occupied"
              ? "#ff9800"
              : "#f44336";
          borderColor =
            node.properties?.status === "available"
              ? "#1976d2"
              : node.properties?.status === "occupied"
              ? "#f57c00"
              : "#d32f2f";
          break;
        case "runway":
          color = "#ff9800";
          borderColor = "#f57c00";
          break;
        case "stand":
          color = "#9c27b0";
          borderColor = "#7b1fa2";
          break;
        case "flight":
          color = "#f44336";
          borderColor = "#d32f2f";
          break;
      }

      // Vẽ hình chữ nhật cho node
      ctx.fillStyle = color;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(node.x, node.y, node.width || 80, node.height || 40, 6);
      ctx.fill();
      ctx.stroke();

      // Vẽ text
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        node.label,
        node.x + (node.width || 80) / 2,
        node.y + (node.height || 40) / 2
      );

      // Vẽ thông tin bổ sung cho một số node
      if (node.type === "gate" && node.properties?.status) {
        ctx.font = "10px Arial";
        ctx.fillText(
          node.properties.status,
          node.x + (node.width || 80) / 2,
          node.y + (node.height || 40) + 15
        );
      }
    });

    // Đánh dấu node được chọn
    if (selectedNode) {
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.roundRect(
        selectedNode.x - 5,
        selectedNode.y - 5,
        (selectedNode.width || 80) + 10,
        (selectedNode.height || 40) + 10,
        8
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [
    state,
    selectedNode,
    showGrid,
    showConnections,
    connectionStyle,
    drawGrid,
    drawConnection,
  ]);

  // Cập nhật canvas khi state thay đổi
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  const handleAddNode = () => {
    const newId = newNodeId || `node-${state.nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      type: selectedNodeType,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      label: newNodeLabel || `New ${selectedNodeType}`,
      width:
        selectedNodeType === "terminal"
          ? 120
          : selectedNodeType === "runway"
          ? 150
          : selectedNodeType === "stand"
          ? 70
          : selectedNodeType === "flight"
          ? 90
          : 80,
      height:
        selectedNodeType === "terminal"
          ? 60
          : selectedNodeType === "runway"
          ? 30
          : selectedNodeType === "stand"
          ? 70
          : 40,
    };

    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));

    setDialogOpen(false);
    setNewNodeLabel("");
    setNewNodeId("");
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setState((prev) => ({
        nodes: prev.nodes.filter((node) => node.id !== selectedNode.id),
        connections: prev.connections.filter(
          (conn) =>
            conn.source !== selectedNode.id && conn.target !== selectedNode.id
        ),
      }));
      setSelectedNode(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, node: Node) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left - node.x;
    const offsetY = e.clientY - rect.top - node.y;

    setSelectedNode(node);
    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === selectedNode.id ? { ...node, x: newX, y: newY } : node
      ),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveDiagram = () => {
    localStorage.setItem("airportDiagram", JSON.stringify(state));
    alert("Đã lưu sơ đồ thành công!");
  };

  const handleLoadDiagram = () => {
    const savedDiagram = localStorage.getItem("airportDiagram");
    if (savedDiagram) {
      setState(JSON.parse(savedDiagram));
      alert("Đã tải sơ đồ thành công!");
    } else {
      alert("Không có sơ đồ nào được lưu!");
    }
  };

  const handleResetDiagram = () => {
    if (
      confirm(
        "Bạn có chắc muốn thiết lập lại sơ đồ? Dữ liệu hiện tại sẽ bị mất."
      )
    ) {
      setState({
        nodes: [
          {
            id: "1",
            type: "terminal",
            x: 100,
            y: 100,
            label: "Terminal 1",
            width: 120,
            height: 60,
          },
          {
            id: "2",
            type: "terminal",
            x: 400,
            y: 100,
            label: "Terminal 2",
            width: 120,
            height: 60,
          },
          {
            id: "3",
            type: "gate",
            x: 50,
            y: 200,
            label: "Cổng A1",
            width: 80,
            height: 40,
          },
          {
            id: "4",
            type: "gate",
            x: 150,
            y: 200,
            label: "Cổng A2",
            width: 80,
            height: 40,
          },
          {
            id: "5",
            type: "gate",
            x: 450,
            y: 200,
            label: "Cổng B1",
            width: 80,
            height: 40,
          },
          {
            id: "6",
            type: "runway",
            x: 250,
            y: 350,
            label: "Đường băng 1",
            width: 150,
            height: 30,
          },
          {
            id: "7",
            type: "runway",
            x: 450,
            y: 350,
            label: "Đường băng 2",
            width: 150,
            height: 30,
          },
          {
            id: "8",
            type: "stand",
            x: 250,
            y: 250,
            label: "Vị trí 1",
            width: 70,
            height: 70,
          },
          {
            id: "9",
            type: "flight",
            x: 350,
            y: 300,
            label: "VN 123",
            width: 90,
            height: 40,
          },
        ],
        connections: [
          { id: "c1", source: "1", target: "3" },
          { id: "c2", source: "1", target: "4" },
          { id: "c3", source: "2", target: "5" },
          { id: "c4", source: "3", target: "8" },
          { id: "c5", source: "4", target: "8" },
          { id: "c6", source: "5", target: "8" },
          { id: "c7", source: "8", target: "6" },
          { id: "c8", source: "8", target: "7" },
          { id: "c9", source: "9", target: "6" },
        ],
      });
      setSelectedNode(null);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sơ đồ Sân bay
          </Typography>
          <Button
            color="inherit"
            onClick={handleSaveDiagram}
            startIcon={<SaveIcon />}
          >
            Lưu
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: isMobile ? "80%" : 300,
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quản lý Sơ đồ
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              fullWidth
              sx={{ mb: 2 }}
            >
              Thêm phần tử
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteNode}
              disabled={!selectedNode}
              fullWidth
              sx={{ mb: 2 }}
            >
              Xóa phần tử
            </Button>

            <Button
              variant="outlined"
              onClick={handleLoadDiagram}
              fullWidth
              sx={{ mb: 2 }}
            >
              Tải sơ đồ
            </Button>

            <Button
              variant="outlined"
              onClick={handleResetDiagram}
              fullWidth
              sx={{ mb: 2 }}
            >
              Thiết lập lại
            </Button>

            {selectedNode && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin phần tử
                  </Typography>
                  <Typography variant="body2">
                    <strong>ID:</strong> {selectedNode.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Loại:</strong> {selectedNode.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nhãn:</strong> {selectedNode.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Vị trí:</strong> ({Math.round(selectedNode.x)},{" "}
                    {Math.round(selectedNode.y)})
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Chú thích:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  icon={<TerminalIcon />}
                  label="Nhà ga"
                  color="success"
                  size="small"
                />
                <Chip
                  icon={<GateIcon />}
                  label="Cổng"
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={<RunwayIcon />}
                  label="Đường băng"
                  color="warning"
                  size="small"
                />
                <Chip
                  icon={<StandIcon />}
                  label="Vị trí đỗ"
                  color="secondary"
                  size="small"
                />
                <Chip
                  icon={<FlightIcon />}
                  label="Chuyến bay"
                  color="error"
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Hướng dẫn:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                - Kéo để di chuyển phần tử
              </Typography>
              <Typography variant="body2" color="textSecondary">
                - Click để chọn phần tử
              </Typography>
            </Box>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
          <Box
            ref={canvasRef}
            component="canvas"
            width={800}
            height={600}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              border: "1px solid #ddd",
              cursor: isDragging ? "grabbing" : "default",
              background: "#fafafa",
            }}
          />

          {/* Render các node để có thể tương tác */}
          {state.nodes.map((node) => (
            <Box
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node)}
              sx={{
                position: "absolute",
                left: node.x,
                top: node.y,
                width: node.width || 80,
                height: node.height || 40,
                bgcolor:
                  node.type === "terminal"
                    ? "#4caf50"
                    : node.type === "gate"
                    ? "#2196f3"
                    : node.type === "runway"
                    ? "#ff9800"
                    : node.type === "stand"
                    ? "#9c27b0"
                    : "#f44336",
                border: `2px solid ${
                  node.type === "terminal"
                    ? "#388e3c"
                    : node.type === "gate"
                    ? "#1976d2"
                    : node.type === "runway"
                    ? "#f57c00"
                    : node.type === "stand"
                    ? "#7b1fa2"
                    : "#d32f2f"
                }`,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                userSelect: "none",
                zIndex: 1,
                ...(selectedNode?.id === node.id && {
                  outline: "3px solid #ff0000",
                }),
              }}
            >
              {node.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Thêm phần tử mới</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Loại phần tử</InputLabel>
            <Select
              value={selectedNodeType}
              label="Loại phần tử"
              onChange={(e) => setSelectedNodeType(e.target.value)}
            >
              <MenuItem value="gate">Cổng</MenuItem>
              <MenuItem value="runway">Đường băng</MenuItem>
              <MenuItem value="terminal">Nhà ga</MenuItem>
              <MenuItem value="stand">Vị trí đỗ</MenuItem>
              <MenuItem value="flight">Chuyến bay</MenuItem>
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label="Nhãn hiển thị"
            fullWidth
            variant="outlined"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            margin="dense"
            label="ID (tùy chọn)"
            fullWidth
            variant="outlined"
            value={newNodeId}
            onChange={(e) => setNewNodeId(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleAddNode} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AirportSampleDiagram;
