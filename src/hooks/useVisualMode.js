import { useEffect, useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = function(newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      setHistory(history => [...history.slice(0, history.length - 1), newMode]);
    } else {
      setHistory(history => [...history, newMode]);
    }
  }
  const back = function() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(history => [...history.slice(0, history.length - 1)]);
    }
  }
  /*
  useEffect(() => {
    console.log("Outside history", history)
    console.log("Mode", mode)
  }, [history, mode])
  */
  return { mode, transition, back };
};