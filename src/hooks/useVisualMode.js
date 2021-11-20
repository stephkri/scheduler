import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = function(newMode) {
    history.push(newMode);
    setMode(newMode);
  }
  const back = function() {
    history.pop(mode);
    setMode(history[history.length - 1]);
  }
  return { mode, transition, back };
};