import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  List,
  ListItem,
} from "@mui/material";

type Player = "X" | "O" | null;
type Board = Player[];

function calculateWinner(squares: Board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c] as [number, number, number],
      };
    }
  }
  return { winner: null, line: null };
}

interface SquareProps {
  value: Player;
  onClick: () => void;
  highlight?: boolean;
}

function Square({ value, onClick, highlight }: SquareProps) {
  return (
    <Button
      variant={highlight ? "contained" : "outlined"}
      color={highlight ? "warning" : "primary"}
      onClick={onClick}
      sx={{
        width: 80,
        height: 80,
        fontSize: 28,
        fontWeight: 600,
      }}
    >
      {value}
    </Button>
  );
}

function Board({
  squares,
  onPlay,
  winningLine,
}: {
  squares: Board;
  onPlay: (i: number) => void;
  winningLine: null | [number, number, number];
}) {
  return (
    <Grid container spacing={1} justifyContent="center">
      {Array.from({ length: 18 }).map((_, i) => (
        <Grid size={2} key={i} display="flex" justifyContent="center">
          <Square
            value={squares[i]}
            onClick={() => onPlay(i)}
            highlight={!!(winningLine && winningLine.includes(i))}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default function Tictoctoe() {
  const [history, setHistory] = useState<Board[]>([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const current = history[step];
  const xIsNext = step % 2 === 0;
  const { winner, line } = calculateWinner(current);

  function handlePlay(i: number) {
    if (current[i] || winner) return;
    const next = current.slice();
    next[i] = xIsNext ? "X" : "O";
    const newHistory = history.slice(0, step + 1).concat([next]);
    setHistory(newHistory);
    setStep(newHistory.length - 1);
  }

  const jumpTo = (move: number) => setStep(move);
  const reset = () => {
    setHistory([Array(9).fill(null)]);
    setStep(0);
  };

  const isDraw = !winner && current.every(Boolean);

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tic Tac Toe (MUI)
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Board squares={current} onPlay={handlePlay} winningLine={line} />

        <Box mt={3}>
          {winner ? (
            <Typography variant="h6" color="success.main">
              Winner: {winner}
            </Typography>
          ) : isDraw ? (
            <Typography variant="h6" color="warning.main">
              Draw!
            </Typography>
          ) : (
            <Typography>Next player: {xIsNext ? "X" : "O"}</Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button variant="contained" onClick={reset}>
            Reset
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Move History
        </Typography>
        <List dense>
          {history.map((_, move) => (
            <ListItem key={move} sx={{ justifyContent: "center" }}>
              <Button
                size="small"
                variant={move === step ? "contained" : "outlined"}
                onClick={() => jumpTo(move)}
              >
                {move === 0 ? "Game Start" : `Go to move #${move}`}
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
