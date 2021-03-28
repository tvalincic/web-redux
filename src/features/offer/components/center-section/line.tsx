import React from "react";
import { useSelector } from "react-redux";
import {
  selectLineById,
  selectStructuredLineOutcomeIds,
} from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Outcome } from "./outcome";

interface ILineProps {
  id: React.ReactText;
}

export const Line = ({ id }: ILineProps) => {
  const line = useSelector((state: RootState) => selectLineById(state, id));
  const outcomes = useSelector((state: RootState) =>
    selectStructuredLineOutcomeIds(state, line?.id || "")
  );
  if (!line) return null;
  return (
    <div className="line line-grid">
      {outcomes.map((outcome, i) => (
        <Outcome id={outcome} key={outcome || i} />
      ))}
    </div>
  );
};
