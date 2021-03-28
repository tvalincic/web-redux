import React from "react";
import { useSelector } from "react-redux";
import { selectOutcomeById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import classnames from "classnames";

interface IOutcomeProps {
  id: React.ReactText | null;
}

const EmptyOutcome = () => <div className="fixture-outcome">-</div>;

export const Outcome = ({ id }: IOutcomeProps) => {
  const outcome = useSelector((state: RootState) =>
    selectOutcomeById(state, id || "")
  );
  if (!outcome) return <EmptyOutcome />;
  return (
    <div
      className={classnames("fixture-outcome selectable", {
        selected: !!outcome.selected,
      })}
    >
      {outcome.odds}
    </div>
  );
};
