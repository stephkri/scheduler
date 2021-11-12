import React from "react";

import classNames from "classnames";
import "./DayListItem.scss";

export default function DayListItem(props) {
  console.log("Props", props)
  return (
    <li onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{props.spots} spots remaining</h3>
    </li>
  );
}