import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });

  const formatSpots = (spots) => {
    if (!spots) {
      return `no spots remaining`;
    }
    if (spots === 1) {
      return `${spots} spot remaining`;
    }
    return `${spots} spots remaining`;
  };
  const availabityMessage = formatSpots(props.spots);
  return (
    <li
      onClick={() => props.setDay(props.name)}
      className={dayClass}
      selected={props.selected}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{availabityMessage}</h3>
    </li>
  );
}
