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
import type { Meal, MealOrder } from "../../../../utils/type";

type Props = {
  items: MealOrder[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
};

export default function OrderTable({
  items,
  onUpdateQty,
  onRemove,
  onUpdateNote,
}: Props) {
  const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Description</TableCell>
              <TableCell align="right">Unit Price (USD)</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.name}</TableCell>
                <TableCell align="right">${it.unitPrice.toFixed(2)}</TableCell>
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
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value || 1));
                        onUpdateQty(it.id, val);
                      }}
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
                  ${(it.unitPrice * it.quantity).toFixed(2)}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Note"
                    value={it.note || ""}
                    onChange={(e) => onUpdateNote(it.id, e.target.value)}
                  />
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
