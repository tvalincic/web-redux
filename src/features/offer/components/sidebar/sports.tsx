import React from "react";
import { useSelector } from "react-redux";
import { selectSportIds, selectActiveSportId } from "../../state/selectors";
import { Sport } from "./sport";

export const Sports = () => {
  const sportIds = useSelector(selectSportIds);
  const activeSport = useSelector(selectActiveSportId);
  return (
    <div className="sports">
      {sportIds.map((sport) => (
        <Sport sportId={sport} key={sport} active={sport === activeSport} />
      ))}
    </div>
  );
};
