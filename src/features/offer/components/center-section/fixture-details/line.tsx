import React from "react";
import { useSelector } from "react-redux";
import { selectLineById } from "../../../state/selectors";
import { RootState } from "../../../../../app/store";
import { Outcome } from "../outcome";

interface ILine {
  id: React.ReactText;
  offerStopped: boolean;
}

export const Line = ({ id, offerStopped }: ILine) => {
  const line = useSelector((state: RootState) => selectLineById(state, id));
  if (!line) return null;
  const stopped = line.stopped || offerStopped;
  return (
    <section className="line offer-line">
      <div className="line-name">{line.name}</div>
      <div className="outcomes">
        {line.outcomes.map((outcome) => (
          <Outcome
            id={outcome}
            showName={true}
            stopped={stopped}
            key={outcome}
          />
        ))}
      </div>
    </section>
  );
};
