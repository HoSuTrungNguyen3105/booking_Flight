import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import type { FlightMeal } from "../../../../utils/type";
import { useGetMealByFlightId } from "../../../../context/Api/useGetApi";
import { useLocation } from "react-router-dom";

export default function OrderTable() {
  const location = useLocation();
  const id = location.state.id || {};
  const [items, setItems] = React.useState<FlightMeal[]>([]);
  const { getGetMealByFlightId } = useGetMealByFlightId(id);
  const onUpdateQty = (id: number, qty: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
  };

  const onRemove = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const onUpdateNote = (id: number, note: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, note } : it)));
  };

  const total = items.reduce(
    (sum, it) => sum + (it.price ?? 0) * it.quantity,
    0
  );

  return (
    <Box>
      <Typography></Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Description</TableCell>
              <TableCell align="right">Unit Price (USD)</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {getGetMealByFlightId?.list?.map((it) => (
              <TableRow key={it.id}>
                <TableCell>
                  {it.meal.description || it.meal.name || "N/A"}
                </TableCell>
                <TableCell align="right">
                  ${(it.price ?? 0).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        onUpdateQty(it.id, Math.max(1, it.quantity - 1))
                      }
                    >
                      <MinusCircle size={16} />
                    </IconButton>
                    <TextField
                      value={it.quantity}
                      onChange={(e) =>
                        onUpdateQty(
                          it.id,
                          Math.max(1, Number(e.target.value || 1))
                        )
                      }
                      inputProps={{ style: { textAlign: "center" }, min: 1 }}
                      size="small"
                      sx={{ width: 64 }}
                      type="number"
                    />
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQty(it.id, it.quantity + 1)}
                    >
                      <PlusCircle size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(it.quantity * (it.price ?? 0)).toFixed(2)}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => onRemove(it.id)}>
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={3}>
                <Typography fontWeight={700}>Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>${total.toFixed(2)}</Typography>
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
