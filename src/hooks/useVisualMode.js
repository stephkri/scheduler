import { useState } from "react";

/*
useVisualMode is a function to control the state of each Appointment component. Since there are
many different visual components that can go into an Appointment component, this function is used
to transition back and forth between each one.
*/
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
  return { mode, transition, back };
};