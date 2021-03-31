import React from "react";
import { useSelector } from "react-redux";
import {
  selectFixtureById,
  selectOutcomeById as selectOutcomeFromOffer,
} from "../../offer";
import { selectOutcomeById } from "../state/selectors";
import { RootState } from "../../../app/store";

function getDay(date: Date) {
  return ["ned", "pon", "uto", "sri", "čet", "pet", "sub"][date.getDay()];
}

function constructDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = getDay(date);
  const time = date.toLocaleTimeString().slice(0, 5);
  return `${day} ${time}`;
}

interface IOutcomeProps {
  id: React.ReactText;
}

export const Outcome = ({ id }: IOutcomeProps) => {
  const outcome = useSelector((state: RootState) =>
    selectOutcomeById(state, id)
  );
  const fixture = useSelector((state: RootState) =>
    selectFixtureById(state, outcome?.fixture || "")
  );
  const outcomeEntity = useSelector((state: RootState) =>
    selectOutcomeFromOffer(state, id)
  );
  if (!outcomeEntity || !fixture) return null;
  const { away, home } = fixture;
  return (
    <div className="outcome">
      <div className="outcome-header">
        <div className="title">
          {away.name} - {home.name}
        </div>
      </div>
      <div className="outcome-footer">
        <div className="footer-left">
          <span className="time">{constructDate(fixture.startsAt)}</span>
          {outcome?.stopped && (
            <strong style={{ color: "red" }}>STOPPED</strong>
          )}
        </div>
        <div className="footer-right">
          <span className="type">{outcomeEntity.name}</span>
          <span className="price">{outcomeEntity.odds}</span>
        </div>
      </div>
    </div>
  );
};
