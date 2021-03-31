import React from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import {
  selectLineById,
  selectStructuredLineOutcomeIds,
} from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Outcome } from "./outcome";

interface ILineProps {
  id: React.ReactText;
  stoppedOffer: boolean;
}

export const Line = ({ id, stoppedOffer }: ILineProps) => {
  const line = useSelector((state: RootState) => selectLineById(state, id));
  const outcomes = useSelector((state: RootState) =>
    selectStructuredLineOutcomeIds(state, line?.id || "")
  );
  if (!line) return null;
  const stopped = line.stopped || stoppedOffer;
  return (
    <div
      className={classnames("line line-grid", {
        stopped,
      })}
    >
      {outcomes.map((outcome, i) => (
        <Outcome id={outcome} key={outcome || i} stopped={stopped} />
      ))}
    </div>
  );
};
