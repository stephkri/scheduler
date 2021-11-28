import { useState } from "react";

/*
useVisualMode is a function to control the state of each Appointment component. Since there are
many different visual components that can go into an Appointment component, this function is used
to transition back and forth between each one.
*/
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);

  /*
  "history" is an array consisting of every mode in which an Appointment component has been.
  */
  const [history, setHistory] = useState([initial]);

  /*
  The transition function is called with a mandatory parameter of which mode it transitions to
  and an optional parameter which says if the mode should replace the previous one in the
  history array.

  setMode is called before setHistory in both transition and back since it can be done without
  relying on what the history array looks like.
  */
  const transition = function(newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      // essentially popping the array and pushing the newMode in
      setHistory(history => [...history.slice(0, history.length - 1), newMode]);
    } else {
      // essentially pushing the newMode in without popping
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